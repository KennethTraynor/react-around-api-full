const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  card.find({})
    .then((data) => res.status(200).send(data))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  card.create({ name, link, owner: req.user._id })
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Invalid Syntax'));
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  card.findByIdAndDelete(req.params.cardId)
    .then((data) => {
      if (!data) {
        throw new NotFoundError('Card Not Found');
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

module.exports.likeCard = (req, res, next) => {
  card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((data) => {
      if (!data) {
        throw new NotFoundError('Card Not Found');
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

module.exports.dislikeCard = (req, res, next) => {
  card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((data) => {
      if (!data) {
        throw new NotFoundError('Card Not Found');
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
