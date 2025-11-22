import express from "express";
import axios from "axios";
import https from "https";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173", "http://192.168.68.51:5173"],
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "x-dctrack-host"],
  })
);

app.use(express.json());

app.get("/api/*", async (req, res) => {
  try {
    const host = req.headers["x-dctrack-host"];
    if (!host) {
      return res.status(400).json({ error: "Missing dcTrack host header" });
    }

    const target = `https://${host}${req.originalUrl}`;
    const agent = new https.Agent({ rejectUnauthorized: false });

    console.log("Forwarding GET to:", target);

    const response = await axios.get(target, {
      httpsAgent: agent,
      headers: {
        Authorization: "Basic YWRtaW46c3VuYmlyZA==",
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

app.post("/api/*", async (req, res) => {
  try {
    const host = req.headers["x-dctrack-host"];
    if (!host) {
      return res.status(400).json({ error: "Missing dcTrack host header" });
    }

    const target = `https://${host}${req.originalUrl}`;
    const agent = new https.Agent({ rejectUnauthorized: false });
    console.log("Forwarding request to:", target);
    const response = await axios.post(target, req.body, {
      httpsAgent: agent,
      headers: {
        Authorization: "Basic YWRtaW46c3VuYmlyZA==",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    res.status(response.status).json(response.data);
    console.log("Response status:", response.status);
  } catch (err) {
    console.log("BACKEND ERROR:");
    console.log("message:", err.message);
    console.log("code:", err.code);
    console.log("response data:", err.response?.data);
    console.log("response status:", err.response?.status);
    console.log("stack:", err.stack);

    res.status(500).json({
      error: err.message,
      backendStatus: err.response?.status,
      backendData: err.response?.data,
    });
  }
});

app.delete("/api/*", async (req, res) => {
  try {
    const host = req.headers["x-dctrack-host"];
    if (!host) {
      return res.status(400).json({ error: "Missing dcTrack host header" });
    }

    const target = `https://${host}${req.originalUrl}`;
    const agent = new https.Agent({ rejectUnauthorized: false });

    console.log("Forwarding DELETE to:", target);

    const response = await axios.delete(target, {
      httpsAgent: agent,
      headers: {
        Authorization: "Basic YWRtaW46c3VuYmlyZA==",
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

app.post("/dctrack-webhook", (req, res) => {
  console.log("Webhook received:", req.body);
  res.status(200).send("OK");
});

const port = process.env.PORT || 10000;
app.listen(port, () => console.log("Backend running on " + port));
