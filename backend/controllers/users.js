const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const User = require('../models/user');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((data) => res.status(200).send(data))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((data) => {
      if (!data) {
        throw new NotFoundError('User Not Found');
      } else {
        res.status(200).send(data);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Invalid ID'));
      }
      next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((data) => {
      if (!data) {
        throw new NotFoundError('User Not Found');
      } else {
        res.status(200).send(data);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Invalid Syntax'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Invalid ID'));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((data) => {
      if (!data) {
        throw new NotFoundError('User Not Found');
      } else {
        res.status(200).send(data);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Invalid Syntax'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Invalid ID'));
      }
      next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((data) => {
      if (!data) {
        throw new NotFoundError('User Not Found');
      } else {
        res
          .status(200)
          .send({
            name: data.name,
            about: data.about,
            avatar: data.avatar,
            _id: data._id,
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Invalid ID'));
      }
      next(err);
    });
};
