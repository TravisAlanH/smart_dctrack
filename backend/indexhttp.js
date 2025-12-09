const express = require("express");
const axios = require("axios");
const https = require("https");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: [
      "https://192.168.68.62:5173",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://localhost:5173",
      "https://resonant-mochi-a37322.netlify.app/",
    ],
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "x-dctrack-host", "x-login-details"],
  })
);

app.use(express.json());

app.use("/api", async (req, res) => {
  try {
    const host = req.headers["x-dctrack-host"];
    const loginDetails = req.headers["x-login-details"];
    if (!host) return res.status(400).json({ error: "Missing dcTrack host header" });

    const target = `https://${host}${req.originalUrl}`;
    const agent = new https.Agent({ rejectUnauthorized: false });

    const method = req.method.toLowerCase();

    const response = await axios({
      method,
      url: target,
      data: req.body,
      httpsAgent: agent,
      headers: {
        Authorization: loginDetails,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
      backendStatus: err.response?.status,
      backendData: err.response?.data,
    });
  }
});

const port = process.env.PORT || 10000;

app.listen(port, () => {
  console.log("Backend running on http://10.34.5.85:" + port);
});
