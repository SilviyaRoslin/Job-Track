import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = Router();
const tokenFor = (user) => jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const errors = (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) { res.status(400).json({ message: result.array()[0].msg }); return true; }
  return false;
};

router.post('/register', [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must contain 2–80 characters.'),
  body('email').trim().isEmail().withMessage('Enter a valid email address.'),
  body('password').isLength({ min: 8, max: 100 }).withMessage('Password must be at least 8 characters.')
], async (req, res, next) => {
  try {
    if (errors(req, res)) return;
    const email = req.body.email.toLowerCase().trim();
    if (await User.findOne({ email })) return res.status(409).json({ message: 'An account with this email already exists.' });
    const passwordHash = await bcrypt.hash(req.body.password, 12);
    const user = await User.create({ name: req.body.name.trim(), email, passwordHash });
    return res.status(201).json({ token: tokenFor(user), user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) { next(err); }
});

router.post('/login', [
  body('email').trim().isEmail().withMessage('Enter a valid email address.'),
  body('password').notEmpty().withMessage('Enter your password.')
], async (req, res, next) => {
  try {
    if (errors(req, res)) return;
    const user = await User.findOne({ email: req.body.email.toLowerCase().trim() });
    if (!user || !(await bcrypt.compare(req.body.password, user.passwordHash))) return res.status(401).json({ message: 'Email or password is incorrect.' });
    return res.json({ token: tokenFor(user), user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) { next(err); }
});

router.get('/me', auth, (req, res) => res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email } }));

export default router;
