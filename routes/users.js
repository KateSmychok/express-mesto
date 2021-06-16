const router = require('express').Router();
const {
  getUsers,
  getUser,
  getCurrentUser,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users');

const {
  validateNameAndAbout,
  validateAvatar,
  validateUserId,
  validateToken,
} = require('../middlewares/validators');

router.get('/', validateToken, getUsers);
router.get('/me', validateToken, getCurrentUser);
router.get('/:userId', validateToken, validateUserId, getUser);
router.patch('/me', validateToken, validateNameAndAbout, updateUserInfo);
router.patch('/me/avatar', validateToken, validateAvatar, updateAvatar);

module.exports = router;
