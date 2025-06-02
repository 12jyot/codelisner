import mongoose from 'mongoose';

const codeExampleSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'python', 'java', 'cpp', 'c', 'html', 'css', 'sql', 'php', 'ruby', 'go', 'rust']
  },
  code: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  }
});

const contentBlockSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['heading', 'text', 'image', 'code']
  },
  content: {
    type: String,
    default: ''
  },
  level: {
    type: String,
    enum: ['h1', 'h2', 'h3', 'h4'],
    default: 'h2'
  },
  url: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  },
  caption: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    enum: ['javascript', 'python', 'java', 'cpp', 'c', 'html', 'css', 'sql', 'php', 'ruby', 'go', 'rust'],
    default: 'javascript'
  },
  title: {
    type: String,
    default: ''
  }
});

const tutorialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['HTML', 'CSS', 'JavaScript', 'Python', 'Java', 'C++', 'C', 'SQL', 'PHP', 'Ruby', 'Go', 'Rust', 'React', 'Node.js', 'MongoDB', 'Other']
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    maxlength: 500
  },
  codeExamples: [codeExampleSchema],
  images: [{
    url: String,
    alt: String,
    caption: String
  }],
  contentBlocks: [contentBlockSchema],
  tags: [{
    type: String,
    trim: true
  }],
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  estimatedReadTime: {
    type: Number, // in minutes
    default: 5
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  metaDescription: {
    type: String,
    maxlength: 160
  },
  metaKeywords: [{
    type: String
  }]
}, {
  timestamps: true
});

// Indexes for better performance (slug already has unique index)
tutorialSchema.index({ category: 1, isPublished: 1 });
tutorialSchema.index({ title: 'text', content: 'text', tags: 'text' });
tutorialSchema.index({ createdAt: -1 });

// Virtual for URL
tutorialSchema.virtual('url').get(function() {
  return `/tutorial/${this.slug}`;
});

// Pre-save middleware to generate slug
tutorialSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

export default mongoose.model('Tutorial', tutorialSchema);
