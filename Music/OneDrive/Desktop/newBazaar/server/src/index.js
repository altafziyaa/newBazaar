import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./DB/db.js";
import sellerRoute from "./routes/sellerRoute.js";
import authRoutes from "./routes/AuthRoutes.js";
import adminRoutes from './routes/AdminRoute.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from "./routes/ProductRoutes.js"; 
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentOrderRoutes from './routes/paymentOrderRoutes.js'
import transactionRoute from './routes/TransactionRoute.js';
import sellerReportRoute from './routes/sellerReportRoute.js';
import errorMiddleware from "./middleware/errorMiddleware.js";
import DealRoutes from './routes/DealsRoutes.js'
import homeCategoryRoutes from './routes/homeCategoryRoutes.js';


dotenv.config();
dbConnect();
const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/sellers", sellerRoute);
app.use("/api/auth", authRoutes); 
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment",paymentOrderRoutes);
app.use("/api/transaction",transactionRoute);
app.use("/api/seller/report",sellerReportRoute);
app.use("/api/admin/deals",DealRoutes);
app.use("/api/home", homeCategoryRoutes);


app.use(errorMiddleware);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

