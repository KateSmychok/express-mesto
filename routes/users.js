const router = require('express').Router();
const {
  getUsers,
  getUser,
  getCurrentUser,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users');

const {
  validateUserBody,
  validateUserId,
} = require('../middlewares/validators');

router.get('/', getUsers);
router.get('/:userId', validateUserId, getUser);
router.get('/me', getCurrentUser);
router.patch('/me', validateUserBody, updateUserInfo);
router.patch('/me/avatar', validateUserBody, updateAvatar);

module.exports = router;
