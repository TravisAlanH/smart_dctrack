const express = require("express");
const axios = require("axios");
const https = require("https");
const fs = require("fs");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: ["https://resonant-mochi-a37322.netlify.app", "http://localhost:5173", "https://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-dctrack-host", "x-login-details"],
  })
);

app.use(express.json());

app.options(/\/api\/.*/, (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, x-dctrack-host, x-login-details");
  res.sendStatus(204);
});

app.get(/\/api\/.*/, async (req, res) => {
  try {
    const host = req.headers["x-dctrack-host"];
    const login = req.headers["x-login-details"];
    if (!host) return res.status(400).json({ error: "Missing dcTrack host header" });

    const target = `https://${host}${req.originalUrl}`;
    const agent = new https.Agent({ rejectUnauthorized: false });
    const r = await axios.get(target, { httpsAgent: agent, headers: { Authorization: login } });
    res.status(r.status).json(r.data);
  } catch (e) {
    res.status(500).json({ error: e.message, backendStatus: e.response?.status, backendData: e.response?.data });
  }
});

app.post(/\/api\/.*/, async (req, res) => {
  try {
    const host = req.headers["x-dctrack-host"];
    const login = req.headers["x-login-details"];
    if (!host) return res.status(400).json({ error: "Missing dcTrack host header" });

    const target = `https://${host}${req.originalUrl}`;
    const agent = new https.Agent({ rejectUnauthorized: false });
    const r = await axios.post(target, req.body, {
      httpsAgent: agent,
      headers: { Authorization: login, "Content-Type": "application/json" },
    });
    res.status(r.status).json(r.data);
  } catch (e) {
    res.status(500).json({ error: e.message, backendStatus: e.response?.status, backendData: e.response?.data });
  }
});

app.put(/\/api\/.*/, async (req, res) => {
  try {
    const host = req.headers["x-dctrack-host"];
    const login = req.headers["x-login-details"];
    if (!host) return res.status(400).json({ error: "Missing dcTrack host header" });

    const target = `https://${host}${req.originalUrl}`;
    const agent = new https.Agent({ rejectUnauthorized: false });
    const r = await axios.put(target, req.body, {
      httpsAgent: agent,
      headers: { Authorization: login, "Content-Type": "application/json" },
    });
    res.status(r.status).json(r.data);
  } catch (e) {
    res.status(500).json({ error: e.message, backendStatus: e.response?.status, backendData: e.response?.data });
  }
});

app.delete(/\/api\/.*/, async (req, res) => {
  try {
    const host = req.headers["x-dctrack-host"];
    const login = req.headers["x-login-details"];
    if (!host) return res.status(400).json({ error: "Missing dcTrack host header" });

    const target = `https://${host}${req.originalUrl}`;
    const agent = new https.Agent({ rejectUnauthorized: false });
    const r = await axios.delete(target, { httpsAgent: agent, headers: { Authorization: login } });
    res.status(r.status).json(r.data);
  } catch (e) {
    res.status(500).json({ error: e.message, backendStatus: e.response?.status, backendData: e.response?.data });
  }
});

const port = 10000;

https
  .createServer(
    {
      key: fs.readFileSync("server.key"),
      cert: fs.readFileSync("server.crt"),
    },
    app
  )
  .listen(port, "0.0.0.0", () => {
    console.log("Backend running on https://10.34.5.85:" + port);
  });
