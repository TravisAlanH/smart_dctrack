import express from "express";
import axios from "axios";
import https from "https";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://localhost:5173", "https://audittool-frontend.onrender.com"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "x-dctrack-host"],
  })
);

app.use(express.json());

app.post("/api/*", async (req, res) => {
  try {
    const host = req.headers["x-dctrack-host"];
    if (!host) {
      return res.status(400).json({ error: "Missing dcTrack host header" });
    }

    const target = `https://${host}${req.originalUrl}`;
    const agent = new https.Agent({ rejectUnauthorized: false });

    const response = await axios.post(target, req.body, {
      httpsAgent: agent,
      headers: {
        Authorization: "Basic YWRtaW46c3VuYmlyZA==",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 10000;
app.listen(port, () => console.log("Backend running on " + port));
