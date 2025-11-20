import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-backend-cpu";
import * as tf from "@tensorflow/tfjs";

tf.ready().then(() => {
  console.log("TF backend ready:", tf.getBackend());
});

createRoot(document.getElementById("root")).render(<App />);
