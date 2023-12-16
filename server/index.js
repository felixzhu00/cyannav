const http = require("http");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const fileuploader = require("express-fileupload");
const mongoose = require("mongoose");

if (process.env.NODE_ENV === undefined) {
  process.env.NODE_ENV = "development";
}
dotenv.config({ path: `.env.${process.env.NODE_ENV}` }); // Loads .env

const corsOrigin = process.env.CORS_ORIGIN;
const port = process.env.SERVER_PORT;

const app = express();

// MIDDLE WARE
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(
  cors({
    origin: [`http://${corsOrigin}`], // TODO: change to https for production later
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(fileuploader());

// API routes
const authRouter = require("./routes/auth-router");
app.use("/auth", authRouter);
const mapapiRouter = require("./routes/mapapi-router");
app.use("/api", mapapiRouter);

// Initialize database connection
const db = require("./db");
db.on("error", console.error.bind(console, "MongoDB connection failed"));

// Run server
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => console.log(`Server running on port ${port}`));
}

module.exports = app;
