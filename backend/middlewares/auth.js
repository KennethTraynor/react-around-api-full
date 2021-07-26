const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorizaton } = req.headers;

  if (!authorizaton || !authorizaton.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Authorization required' });
  }

  const token = authorizaton.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    return res.status(401).send({ message: 'Authorization Required' });
  }

  req.user = payload;

  next();
};
