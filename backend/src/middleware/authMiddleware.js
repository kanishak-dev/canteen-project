const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'A token is required' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ message: 'Invalid Token' });
  }
  return next();
};

exports.isOwner = (req, res, next) => {
  if (req.user.role !== 'owner') {
    return res.status(403).json({ message: 'Requires owner role!' });
  }
  return next();
};