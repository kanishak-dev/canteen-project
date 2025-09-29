const pool = require('../config/database');

exports.createOrder = async (req, res) => {
  const { cart, machineId, clientName, clientPhone } = req.body;
  
  if (!cart || cart.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }
  const io = req.app.get('socketio');
  let client;
  try {
    client = await pool.connect();
    await client.query('BEGIN');

    const orderResult = await client.query(
      'INSERT INTO Orders (status, "machineId", "clientName", "clientPhone") VALUES ($1, $2, $3, $4) RETURNING id',
      ['PENDING', machineId, clientName, clientPhone]
    );
    
    const orderId = orderResult.rows[0].id;
    for (const item of cart) {
      const menuItemResult = await client.query('SELECT name, price, stock FROM MenuItems WHERE id = $1 FOR UPDATE', [item.menuItemId]);
      if (menuItemResult.rows.length === 0) throw new Error(`Menu item not found.`);
      const menuItem = menuItemResult.rows[0];
      if (menuItem.stock < item.quantity) throw new Error(`Not enough stock for ${menuItem.name}.`);
      await client.query('UPDATE MenuItems SET stock = stock - $1 WHERE id = $2', [item.quantity, item.menuItemId]);
      await client.query('INSERT INTO OrderLineItems ("orderId", "menuItemId", quantity, price) VALUES ($1, $2, $3, $4)', [orderId, item.menuItemId, item.quantity, menuItem.price]);
    }
    await client.query('COMMIT');
    io.emit('stockUpdated');
    res.status(201).json({ orderId, message: 'Order created successfully' });
  } catch (error) {
    if (client) await client.query('ROLLBACK');
    res.status(400).json({ message: error.message || 'Failed to create order' });
  } finally {
    if (client) client.release();
  }
};