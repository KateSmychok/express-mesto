const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');
const { validateEmailAndPassword } = require('../middlewares/validators');
const NotFoundError = require('../errors/not-found-err');

const {
  createUser,
  login,
  logout,
} = require('../controllers/users');

router.post('/signup', validateEmailAndPassword, createUser);
router.post('/signin', validateEmailAndPassword, login);
router.post('/signout', logout);
router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);

router.use('*', () => {
  throw new NotFoundError('Страница не найдена');
});

module.exports = router;
