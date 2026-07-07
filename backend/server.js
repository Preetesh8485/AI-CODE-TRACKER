import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import connectDB from "./config/db.js"
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import authRouter from "./routes/authRoutes.js";
import { validateBody } from "./middleware/validateBody.js";
const app = express();
const port=process.env.PORT||4000;
connectDB();
const allowedOrigins = ["http://localhost:5173", process.env.FRONTEND_URL];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}))
app.use(validateBody);
app.get("/", (req, res) => {
  res.status(200).send("API working");
});
app.use('/api/auth',authRouter);
app.use(errorMiddleware);
app.listen(port, () =>
  console.log(`Server running on PORT: ${port}`)
);