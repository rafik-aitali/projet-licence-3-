require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const connectDB = require("./config/db");
const { initializeSocket } = require("./config/socket");

const app = express();
const server = http.createServer(app);
const io = initializeSocket(server);

const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://klyv.onrender.com",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use("/api/v1", routes);
app.use(errorHandler);

app.get("/api/ping", (req, res) => {
  res.send("pong");
});

app.get("/", (req, res) => {
  res.send("API is running ...");
});

const PORT = process.env.PORT || 8000;

const start = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in the environment variables");
    }

    await connectDB(process.env.MONGO_URI);
    server.listen(PORT, () =>
      console.log(`Server is running on port: ${PORT}`)
    );
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  process.exit(0);
});

start();
