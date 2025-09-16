import dotenv from 'dotenv';
dotenv.config(); // Load .env variables
import studentRoutes from "./routes/studentRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import InternshipRoutes from "./routes/InternshipRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());



app.use(express.json());
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/studentRoutes", studentRoutes);
app.use("/api/companyRoutes", companyRoutes);
app.use("/api/InternshipRoutes", InternshipRoutes);
app.use("/api/applicationRoutes",applicationRoutes)
app.use("/api/adminRoutes",adminRoutes)
// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
