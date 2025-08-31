import { Schema, model } from 'mongoose';

const InternshipSchema = new Schema({

  companyId: {
    type: String,
    required: true,
  },
  companyName:{
    type:String
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: {
    type: [String], // Array of strings
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export model
export default model('InternshipSchema', InternshipSchema);
