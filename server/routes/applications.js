import { Router } from 'express';
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator';
import Application from '../models/Application.js';
import auth from '../middleware/auth.js';

const router = Router();
router.use(auth);
const fields = [
  body('company').trim().isLength({ min: 1, max: 120 }).withMessage('Company name is required.'),
  body('role').trim().isLength({ min: 1, max: 120 }).withMessage('Job title is required.'),
  body('status').optional().isIn(['Wishlist', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected']).withMessage('Choose a valid application status.'),
  body('workType').optional().isIn(['On-site', 'Hybrid', 'Remote']).withMessage('Choose a valid work type.'),
  body('employmentType').optional().isIn(['Full-time', 'Part-time', 'Internship', 'Contract']).withMessage('Choose a valid employment type.')
];
const patchFields = [
  body('company').optional().trim().isLength({ min: 1, max: 120 }).withMessage('Company name must contain 1–120 characters.'),
  body('role').optional().trim().isLength({ min: 1, max: 120 }).withMessage('Job title must contain 1–120 characters.'),
  body('status').optional().isIn(['Wishlist', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected']).withMessage('Choose a valid application status.'),
  body('workType').optional().isIn(['On-site', 'Hybrid', 'Remote']).withMessage('Choose a valid work type.'),
  body('employmentType').optional().isIn(['Full-time', 'Part-time', 'Internship', 'Contract']).withMessage('Choose a valid employment type.')
];
const validate = (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) { res.status(400).json({ message: result.array()[0].msg }); return false; }
  return true;
};
const safePayload = (body) => {
  const allowed = ['company','role','location','workType','employmentType','status','appliedDate','interviewDate','salary','jobUrl','contactName','notes'];
  const result = {};
  for (const key of allowed) if (body[key] !== undefined) result[key] = body[key] === '' && ['interviewDate'].includes(key) ? null : body[key];
  if (result.appliedDate) result.appliedDate = new Date(result.appliedDate);
  if (result.interviewDate) result.interviewDate = new Date(result.interviewDate);
  return result;
};

router.get('/', async (req, res, next) => {
  try {
    const { q = '', status = 'All' } = req.query;
    const filter = { user: req.user._id };
    if (status !== 'All') filter.status = status;
    if (q.trim()) filter.$or = [{ company: { $regex: q.trim(), $options: 'i' } }, { role: { $regex: q.trim(), $options: 'i' } }, { location: { $regex: q.trim(), $options: 'i' } }];
    const applications = await Application.find(filter).sort({ updatedAt: -1 }).limit(500).lean();
    res.json({ applications });
  } catch (err) { next(err); }
});

router.post('/', fields, async (req, res, next) => {
  try {
    if (!validate(req, res)) return;
    const application = await Application.create({ ...safePayload(req.body), user: req.user._id });
    res.status(201).json({ application });
  } catch (err) { next(err); }
});

router.patch('/:id', patchFields, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid application ID.' });
    if (!validate(req, res)) return;
    const application = await Application.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { $set: safePayload(req.body) }, { new: true, runValidators: true });
    if (!application) return res.status(404).json({ message: 'Application not found.' });
    res.json({ application });
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid application ID.' });
    const application = await Application.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!application) return res.status(404).json({ message: 'Application not found.' });
    res.json({ message: 'Application deleted.' });
  } catch (err) { next(err); }
});

export default router;
