// models/Company.js
import { Schema, model } from "mongoose";
import { type } from "os";

const companySchema = new Schema({
  email: { type: String },
  password:{type:String},
  companyName: { type: String, required: true },
  role: { type: String, default: "company" },
  website: { type: String },
  description: { type: String },
  logo: {
    data: Buffer,          // binary data of the image
    contentType: String,   // e.g., 'image/png', 'image/jpeg'
    filename: String       // original file name
  },
  phoneNo:{type:String},
  OurValues:[String],
  WorkCulture:{type:String},
  internBenifits:[String],
  isApproved: { type: Boolean, default: false },
  location: { type: String },
  employees: { type: String },
  industry: { type: String },
  fullTimeOpportunities:{type:String},
  certification:{type:String},
  mentorship:{type:String},
  stipend:{type:String},
  foundedYear:{type:String},
  companyType:{type:String},
  address:{type:String},
  subfield:[String],
  internships: [
    {
      title: { type: String},
      duration: { type: String },
      stipend: { type: String },
      requirements: { type: String }
    }
  ] // embedded array of internships
}, { timestamps: true });

export default model("companySchema", companySchema);
