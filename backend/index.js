import express from "express";
import axios from "axios";
import https from "https";
import fs from "fs";
import cors from "cors";
import { log } from "console";

const app = express();

// CORS
app.use(
  cors({
    origin: ["https://192.168.68.51:5173", "http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "x-dctrack-host", "x-login-details"],
  })
);

app.use(express.json());

// GET
app.get("/api/*", async (req, res) => {
  try {
    const host = req.headers["x-dctrack-host"];
    const loginDetails = req.headers["x-login-details"];

    if (!host) {
      return res.status(400).json({ error: "Missing dcTrack host header" });
    }

    const target = `https://${host}${req.originalUrl}`;
    const agent = new https.Agent({ rejectUnauthorized: false });

    console.log("Forwarding GET to:", target);

    const response = await axios.get(target, {
      httpsAgent: agent,
      headers: {
        Authorization: loginDetails,
        Accept: "application/json",
      },
    });

    res.status(response.status).json(response.data);
  } catch (err) {
    console.log("BACKEND GET ERROR:", err.message);
    res.status(500).json({
      error: err.message,
      backendStatus: err.response?.status,
      backendData: err.response?.data,
    });
  }
});

// POST
app.post("/api/*", async (req, res) => {
  try {
    const host = req.headers["x-dctrack-host"];
    const loginDetails = req.headers["x-login-details"];
    if (!host) {
      return res.status(400).json({ error: "Missing dcTrack host header" });
    }

    const target = `https://${host}${req.originalUrl}`;
    const agent = new https.Agent({ rejectUnauthorized: false });

    console.log("Forwarding POST to:", target);

    const response = await axios.post(target, req.body, {
      httpsAgent: agent,
      headers: {
        Authorization: loginDetails,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    res.status(response.status).json(response.data);
  } catch (err) {
    console.log("BACKEND POST ERROR:", err.message);
    res.status(500).json({
      error: err.message,
      backendStatus: err.response?.status,
      backendData: err.response?.data,
    });
  }
});

// DELETE
app.delete("/api/*", async (req, res) => {
  try {
    const host = req.headers["x-dctrack-host"];
    const loginDetails = req.headers["x-login-details"];
    if (!host) {
      return res.status(400).json({ error: "Missing dcTrack host header" });
    }

    const target = `https://${host}${req.originalUrl}`;
    const agent = new https.Agent({ rejectUnauthorized: false });

    console.log("Forwarding DELETE to:", target);

    const response = await axios.delete(target, {
      httpsAgent: agent,
      headers: {
        Authorization: loginDetails,
        Accept: "application/json",
      },
    });

    res.status(response.status).json(response.data);
  } catch (err) {
    console.log("BACKEND DELETE ERROR:", err.message);
    res.status(500).json({
      error: err.message,
      backendStatus: err.response?.status,
      backendData: err.response?.data,
    });
  }
});

// PUT
app.put("/api/*", async (req, res) => {
  try {
    const host = req.headers["x-dctrack-host"];
    const loginDetails = req.headers["x-login-details"];
    if (!host) {
      return res.status(400).json({ error: "Missing dcTrack host header" });
    }

    const target = `https://${host}${req.originalUrl}`;
    const agent = new https.Agent({ rejectUnauthorized: false });

    console.log("Forwarding PUT to:", target);

    const response = await axios.put(target, req.body, {
      httpsAgent: agent,
      headers: {
        Authorization: loginDetails,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    res.status(response.status).json(response.data);
  } catch (err) {
    console.log("BACKEND PUT ERROR:", err.message);
    res.status(500).json({
      error: err.message,
      backendStatus: err.response?.status,
      backendData: err.response?.data,
    });
  }
});

// Webhook
app.post("/dctrack-webhook", (req, res) => {
  console.log("Webhook received:", req.body);
  res.status(200).send("OK");
});

// HTTPS server
const serverOptions = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.crt"),
};

const port = process.env.PORT || 10000;

https.createServer(serverOptions, app).listen(port, () => {
  console.log("Backend running on https://" + "192.168.68.51" + ":" + port);
});
