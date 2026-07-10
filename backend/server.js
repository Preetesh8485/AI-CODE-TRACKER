import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import connectDB from "./config/db.js"
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import authRouter from "./routes/authRoutes.js";
import { validateBody } from "./middleware/validateBody.js";
import phRouter from "./routes/platformhandlesRoutes.js";
import { UpdateData } from "./utils/cronJobs.js";
const app = express();
const port=process.env.PORT||4000;
connectDB();
const allowedOrigins = ["http://localhost:5173", process.env.FRONTEND_URL];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}))

UpdateData();
app.get("/", (req, res) => {
  res.status(200).send("API working");
});
app.use('/api/auth',validateBody,authRouter);
app.use("/api/platform",phRouter);
app.use(errorMiddleware);
app.listen(port, () =>
  console.log(`Server running on PORT: ${port}`)
);