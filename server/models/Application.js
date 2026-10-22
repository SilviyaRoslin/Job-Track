import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  company: { type: String, required: true, trim: true, maxlength: 120 },
  role: { type: String, required: true, trim: true, maxlength: 120 },
  location: { type: String, trim: true, maxlength: 120, default: '' },
  workType: { type: String, enum: ['On-site', 'Hybrid', 'Remote'], default: 'Hybrid' },
  employmentType: { type: String, enum: ['Full-time', 'Part-time', 'Internship', 'Contract'], default: 'Full-time' },
  status: { type: String, enum: ['Wishlist', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected'], default: 'Applied' },
  appliedDate: { type: Date, default: Date.now },
  interviewDate: { type: Date, default: null },
  salary: { type: String, trim: true, maxlength: 80, default: '' },
  jobUrl: { type: String, trim: true, maxlength: 500, default: '' },
  contactName: { type: String, trim: true, maxlength: 120, default: '' },
  notes: { type: String, trim: true, maxlength: 4000, default: '' }
}, { timestamps: true });

applicationSchema.index({ user: 1, updatedAt: -1 });
export default mongoose.model('Application', applicationSchema);
