import dotenv from 'dotenv';
dotenv.config(); // Load .env variables
import studentRoutes from "./routes/studentRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import InternshipRoutes from "./routes/InternshipRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount Routes
app.use("/api/studentRoutes", studentRoutes);
app.use("/api/companyRoutes", companyRoutes);
app.use("/api/InternshipRoutes", InternshipRoutes);
app.use("/api/applicationRoutes", applicationRoutes);
app.use("/api/adminRoutes", adminRoutes);

// Supabase Connection Verification
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_KEY;

if (supabaseUrl && supabaseKey) {
  console.log("Supabase configured with URL:", supabaseUrl);
} else {
  console.error("Missing Supabase credentials in .env");
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
