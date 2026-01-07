import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conecttedDb from "./database/db.js";
import userRouter from "./router/userRouter.js";

const app = express();

// Load environment variables
dotenv.config();

// ✅ Enable CORS
app.use(
  cors({
    origin: "http://localhost:5173", // allow only frontend
    credentials: true,               // allow cookies/auth headers if needed
  })
);

// Middleware to parse JSON
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Express server is running!");
});

// User routes
app.use("/users", userRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  conecttedDb();
  console.log(`🚀 Server is running on port ${PORT}`);
});
