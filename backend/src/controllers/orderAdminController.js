const pool = require('../config/database');

exports.getAllOrders = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT 
        o.id, o.status, o."createdAt", o."machineId",
        o."clientName", o."clientPhone",
        json_agg(json_build_object('name', mi.name, 'quantity', oli.quantity)) as items
       FROM Orders o
       JOIN OrderLineItems oli ON o.id = oli."orderId"
       JOIN MenuItems mi ON oli."menuItemId" = mi.id
       GROUP BY o.id
       ORDER BY o."createdAt" DESC`
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.markOrderAsComplete = async (req, res) => {
  const io = req.app.get('socketio');
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `UPDATE Orders SET status = 'COMPLETED', "updatedAt" = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Order not found' });
    const orderId = rows[0].id;
    io.emit('orderCompleted', { orderId });
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error marking order as complete:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.cancelOrder = async (req, res) => {
  const io = req.app.get('socketio');
  const { id } = req.params;
  let client;
  try {
    client = await pool.connect();
    await client.query('BEGIN');
    const orderResult = await client.query('SELECT * FROM Orders WHERE id = $1 FOR UPDATE', [id]);
    if (orderResult.rows.length === 0 || orderResult.rows[0].status !== 'PENDING') throw new Error('Order not found or already processed.');
    const lineItemsResult = await client.query('SELECT "menuItemId", quantity FROM OrderLineItems WHERE "orderId" = $1', [id]);
    for (const item of lineItemsResult.rows) {
      await client.query('UPDATE MenuItems SET stock = stock + $1 WHERE id = $2', [item.quantity, item.menuItemId]);
    }
    await client.query(`UPDATE Orders SET status = 'CANCELLED' WHERE id = $1`, [id]);
    await client.query('COMMIT');
    io.emit('stockUpdated');
    io.emit('orderCancelled', { orderId: parseInt(id) });
    res.status(200).json({ message: 'Order cancelled and stock restored.' });
  } catch (error) {
    if (client) await client.query('ROLLBACK');
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    if (client) client.release();
  }
};