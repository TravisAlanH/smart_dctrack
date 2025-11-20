import express from "express";
import axios from "axios";
import https from "https";
import path from "path";

const app = express();
app.use(express.json());

// Proxy to dcTrack
app.post("/api/*", async (req, res) => {
  try {
    // host sent from frontend inside header "x-dctrack-host"
    const host = req.headers["x-dctrack-host"];

    if (!host) {
      return res.status(400).json({ error: "Missing dcTrack host" });
    }

    // remove "/api" prefix and rebuild real dcTrack URL
    const apiPath = req.originalUrl;
    const target = `https://${host}${apiPath}`;
    console.log(target);

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

// Serve frontend in production
const __dirname = process.cwd();
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(3000, () => console.log("Backend running on port 3000"));
