const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const {
  validateCardBody,
  validateCardId,
  validateToken,
} = require('../middlewares/validators');

router.get('/', validateToken, getCards);
router.post('/', validateToken, validateCardBody, createCard);
router.delete('/:cardId', validateToken, validateCardId, deleteCard);
router.put('/:cardId/likes', validateToken, validateCardId, likeCard);
router.delete('/:cardId/likes', validateToken, validateCardId, dislikeCard);

module.exports = router;
