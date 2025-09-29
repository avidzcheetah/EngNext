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
  },
  requirements: {
    type: [String], // Array of strings
  },
  duration: {
    type: String,
  },
  location: {
    type: String,
  },
  isActive: {
    type: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
industry:{ type:String
}
});

// Export model
export default model('InternshipSchema', InternshipSchema);
