import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import { connectDB } from "./db.js";
import shareholderRoutes from "./routes/shareholderRoutes.js";
import dmatRoutes from "./routes/dmatRoutes.js";
import clientProfileRoutes from "./routes/clientProfileRoutes.js";

// Load env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test endpoint
app.get("/api/ping", (_req, res) => res.json({ message: "pong" }));

// API Routes
app.use("/api/shareholders", shareholderRoutes);
app.use("/api/dmat", dmatRoutes);
app.use("/api/client-profiles", clientProfileRoutes);

// -------------------- Serve React Frontend --------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve built React app
app.use(express.static(path.join(__dirname, "../client/dist/spa")));

// Catch-all route → React handles frontend routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/spa/index.html"));
});

// -------------------- Start Server --------------------
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  });

export default app;
