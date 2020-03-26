import React, { useState } from "react";

export default function NightModeToggle() {
  let localStored = false;
  if (process.browser) {
    localStored = localStorage.getItem("nightMode") === "true";
  }

  const [nightMode, setNightMode] = useState(localStored);

  if (process.browser) {
    if (nightMode) {
      document.body.classList.add("dark");
      localStorage.setItem("nightMode", true);
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("nightMode", false);
    }
  }

  return (
    <button className="btn mv-auto sm neutral" onClick={() => setNightMode(!nightMode)}>
      <span className="bnt-icon">
        <ion-icon name="moon" />
      </span>
    </button>
  );
}
