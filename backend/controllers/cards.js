const Card = require('../models/card');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const UnauthorizedError = require('../errors/unauthorized-error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .sort({ createdAt: -1 })
    .populate(['owner', 'likes'])
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => Card.findById(card._id).populate('owner'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Invalid Syntax'));
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .populate('owner')
    .then((c) => {
      if (c.owner._id !== req.user._id || !req.user._id) {
        throw new UnauthorizedError('Unauthorized');
      } else {
        Card.findByIdAndDelete(req.params.cardId)
          .populate(['owner', 'likes'])
          .then((card) => {
            if (!card) {
              throw new NotFoundError('Card Not Found');
            } else {
              res.status(200).send(card);
            }
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

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Card Not Found');
      } else {
        res.status(200).send(card);
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
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Card Not Found');
      } else {
        res.status(200).send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Invalid ID'));
      }
      next(err);
    });
};
