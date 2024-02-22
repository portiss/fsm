import React from "react";
import ReactDOM from "react-dom/client";
import TrafficLight from "./traffic-light";
import "./styles.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <TrafficLight />
  </React.StrictMode>
);
