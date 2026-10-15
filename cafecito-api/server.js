import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.conf.js";
import logger from "./src/middlewares/logger.js";
import errorHandler from "./src/middlewares/errorHandler.js";
import routes from "./src/routes/index.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());
app.use(logger);

await connectDB();

app.get("/", (req, res) => {
  res.send("Cafecito Feliz con MongoDB");
});

app.use("/api", routes);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    method: req.method,
    url: req.originalUrl,
  });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
