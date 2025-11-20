import express from "express";
import axios from "axios";
import https from "https";
import path from "path";

const app = express();
app.use(express.json());

// Fix for __dirname in ES modules
const __dirname = process.cwd();

/*
  Proxy Route
  Accepts: /api/v2/dcimoperations/items?returnDetails=false
  Rewrites to: https://<host-from-header>/v2/dcimoperations/items?returnDetails=false
*/
app.post("/api/*", async (req, res) => {
  try {
    const host = req.headers["x-dctrack-host"];
    if (!host) {
      return res.status(400).json({ error: "Missing dcTrack host header" });
    }

    const apiPath = req.originalUrl;

    // Build full dcTrack URL
    const target = `https://${host}${apiPath}`;
    console.log("Forwarding to:", target);

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
    console.log("Backend error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/*
  Production mode
  Serve Vite build folder (dist)
*/
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Backend listening on " + PORT));
