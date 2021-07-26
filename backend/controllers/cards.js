const card = require('../models/card');

module.exports.getCards = (req, res) => {
  card.find({})
    .then((data) => res.status(200).send(data))
    .catch(() => res.status(500).send({ message: 'Internal Server Error' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  card.create({ name, link, owner: req.user._id })
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Invalid Syntax' });
      } else {
        res.status(500).send({ message: 'Internal Server Error' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  card.findByIdAndDelete(req.params.cardId)
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: 'Card Not Found' });
      } else {
        res.status(200).send(data);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Invalid ID' });
      } else {
        res.status(500).send({ message: 'Internal Server Error' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: 'Card Not Found' });
      } else {
        res.status(200).send(data);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Invalid ID' });
      } else {
        res.status(500).send({ message: 'Internal Server Error' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: 'Card Not Found' });
      } else {
        res.status(200).send(data);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Invalid ID' });
      } else {
        res.status(500).send({ message: 'Internal Server Error' });
      }
    });
};
