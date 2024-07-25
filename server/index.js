import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import multer from "multer";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import { register } from "./controllers/authController.js";
import { verifyToken } from "./middleware/authMiddleware.js";
import postRouter from "./routes/postRouter.js";
import { createPost } from "./controllers/postController.js";
import User from "./models/userModel.js";
import Post from "./models/postModel.js";
import { users, posts } from "./data/index.js";
//  *CONFIGURATIONSSS*///

const __filename = fileURLToPath(import.meta.url);
const __direname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__direname, "public/assets")));

// FILE STORAGE
/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

////////////////////
/////////////////

app.use("/api/auth/register", upload.single("picture"), verifyToken, register);
app.use("/api/posts", upload.single("picture"), verifyToken, createPost);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/posts", postRouter);

const port = process.env.PORT || 6001;
// mongoose
//   .connect(process.env.MONGO)
//   .then(() => {
//     app.listen(port, () => console.log("server is running in port ", port));
//   })
//   .catch((err) => console.log(`error ${err}`));
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO, {
      // useNewUrlParser: true,
    });
    console.log("connected to database");
  } catch (error) {
    throw error;
  }
};
app.listen(port, () => {
  connect();
  // User.insertMany(users);
  // Post.insertMany(posts);
  console.log(`server is running in port ${port}`);
});
