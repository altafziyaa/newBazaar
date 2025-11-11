import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./DB/db.js";
import sellerRoute from "./routes/sellerRoute.js";
import authRoutes from "./routes/AuthRoutes.js";
import adminRoutes from './routes/AdminRoute.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
dbConnect();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/sellers", sellerRoute);
app.use("/api", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

