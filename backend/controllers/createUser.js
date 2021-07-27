const bcrypt = require('bcryptjs');
const BadRequestError = require('../errors/bad-request-error');
const User = require('../models/user');

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email, password: hash,
    }))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Invalid Syntax'));
      }
      next(err);
    });
};
