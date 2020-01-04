import React from "react";
import NightModeToggle from "./NightModeToggle";
import "../assets/css/navbar.css";

export default function Navbar() {
  return (
    <div className="nav">
      <div className="content">
        <div className="nav-logo">
          <h1 className="h2 m-0">Torrent AIO bot</h1>
        </div>
        <div className="nav-links">
          <NightModeToggle />
        </div>
      </div>
    </div>
  );
}
