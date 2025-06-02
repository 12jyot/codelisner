import mongoose from 'mongoose';

const readTimePresetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 50
  },
  minutes: {
    type: Number,
    required: true,
    min: 1,
    max: 300 // Max 5 hours
  },
  description: {
    type: String,
    maxlength: 200,
    default: ''
  },
  category: {
    type: String,
    enum: ['Quick', 'Short', 'Medium', 'Long', 'Extended'],
    default: 'Medium'
  },
  color: {
    type: String,
    default: '#10B981', // Default green color
    match: /^#[0-9A-F]{6}$/i
  },
  icon: {
    type: String,
    default: 'Clock' // Lucide icon name
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  usageCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
readTimePresetSchema.index({ isActive: 1, sortOrder: 1 });

// Virtual for display text
readTimePresetSchema.virtual('displayText').get(function() {
  return `${this.name} (${this.minutes} min)`;
});

export default mongoose.model('ReadTimePreset', readTimePresetSchema);
