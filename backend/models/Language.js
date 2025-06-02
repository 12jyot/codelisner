import mongoose from 'mongoose';

const languageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 50
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  fileExtension: {
    type: String,
    required: true,
    trim: true,
    maxlength: 10
  },
  judge0Id: {
    type: Number,
    required: true,
    unique: true
  },
  monacoLanguage: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    default: '#6B7280', // Default gray color
    match: /^#[0-9A-F]{6}$/i
  },
  icon: {
    type: String,
    default: 'Code' // Lucide icon name
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  tutorialCount: {
    type: Number,
    default: 0
  },
  defaultTemplate: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    maxlength: 200,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes
languageSchema.index({ isActive: 1, sortOrder: 1 });

// Pre-save middleware to generate slug
languageSchema.pre('save', function(next) {
  if (!this.slug || this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

export default mongoose.model('Language', languageSchema);
