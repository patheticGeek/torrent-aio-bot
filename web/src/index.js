import React from "react";
import ReactDOM from "react-dom";
import Navbar from "./components/Navbar";
import App from "./App";
import "./assets/css/index.css";
import "./assets/css/helpers.css";
import "./assets/css/navbar.css";

ReactDOM.render(
  <React.StrictMode>
    <Navbar />
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
