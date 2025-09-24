import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  
  {

    studentId: {
      type:String,
      required:true,
    },
    companyId:{
        type:String,
        required:true
    },
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    companyName:{
        type:String,
        required:true,
        trim:true
    },
    email: {
      type: String,
      required: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    internshipTitle: {
      type: String,
      required: true,
      trim: true,
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    skills: {
      type: [String], // array of skills
      default: [],
    },
    gpa: {
      type: Number,
      min: 0.0,
      max: 4.0,
    },
    internshipId :{
      type:String
    }
    ,
    coverLetter:{
      type:String
    },

     interestLevel: {
    type: Number
  },
   cv: {
    data: Buffer,
    contentType: String, // "application/pdf"
    filename: String,
    uploadDate: { type: Date, default: Date.now }
  },

  },
  { timestamps: true } // adds createdAt & updatedAt
);
applicationSchema.index({ studentId: 1, internshipId : 1 }, { unique: true });
const Application = mongoose.model("applicationSchema", applicationSchema);

export default Application;
