const pool = require('../config/database');

exports.getMenuItems = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM MenuItems ORDER BY id ASC');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createMenuItem = async (req, res) => {
  const io = req.app.get('socketio');
  try {
    const { name, price, stock } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO MenuItems (name, price, stock) VALUES ($1, $2, $3) RETURNING *',
      [name, price, stock]
    );
    io.emit('stockUpdated');
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateMenuItem = async (req, res) => {
  const io = req.app.get('socketio');
  try {
    const { id } = req.params;
    const { name, price, stock } = req.body;
    const { rows } = await pool.query(
      'UPDATE MenuItems SET name = $1, price = $2, stock = $3, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [name, price, stock, id]
    );
    io.emit('stockUpdated');
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteMenuItem = async (req, res) => {
  const io = req.app.get('socketio');
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM OrderLineItems WHERE "menuItemId" = $1', [id]);
    await pool.query('DELETE FROM MenuItems WHERE id = $1', [id]);
    io.emit('stockUpdated');
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};