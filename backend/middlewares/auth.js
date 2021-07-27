const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');

module.exports = (req, res, next) => {
  const { authorizaton } = req.headers;

  if (!authorizaton || !authorizaton.startsWith('Bearer ')) {
    next(new UnauthorizedError('Authorization required'));
  }

  const token = authorizaton.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    next(new UnauthorizedError('Authorization required'));
  }

  req.user = payload;
  next();
};
