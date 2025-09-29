const cron = require('node-cron');
const pool = require('../config/database');

const cancelStaleOrders = (io) => {
  cron.schedule('*/5 * * * * *', async () => {
    let client;
    try {
      client = await pool.connect();
      await client.query('BEGIN');
      const staleOrdersResult = await client.query(`SELECT id FROM Orders WHERE status = 'PENDING' AND "createdAt" < NOW() - INTERVAL '15 minute'`);
      if (staleOrdersResult.rows.length === 0) {
        await client.query('COMMIT');
        return;
      }
      const staleOrderIds = staleOrdersResult.rows.map(o => o.id);
      const lineItemsResult = await client.query('SELECT "menuItemId", quantity FROM OrderLineItems WHERE "orderId" = ANY($1::int[])', [staleOrderIds]);
      for (const item of lineItemsResult.rows) {
        await client.query('UPDATE MenuItems SET stock = stock + $1 WHERE id = $2', [item.quantity, item.menuItemId]);
      }
      await client.query(`UPDATE Orders SET status = 'CANCELLED' WHERE id = ANY($1::int[])`, [staleOrderIds]);
      await client.query('COMMIT');
      io.emit('stockUpdated');
      staleOrderIds.forEach(orderId => io.emit('orderCancelled', { orderId }));
    } catch (error) {
      if (client) await client.query('ROLLBACK');
    } finally {
      if (client) client.release();
    }
  });
};
module.exports = { cancelStaleOrders };