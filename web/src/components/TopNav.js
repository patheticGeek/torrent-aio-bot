import React from "react";

export default function TopNav({ nav, setNav }) {
  return (
    <div className="nav nav-horiz">
      <div className="content">
        <ul className="d-flex align-items-center space-around width-100 m-0">
          <li
            onClick={() => setNav("search")}
            className={`cursor-pointer p-0 ph-1 height-100 d-flex align-items-center${nav === "search" ? " border-bottom-1" : ""}`}
          >
            <i className="h2 m-0 d-flex align-items-center">
              <ion-icon name="search-outline" />
            </i>
            <span className="tablet-desktop-only ml-05">Search</span>
          </li>
          <li
            onClick={() => setNav("downloads")}
            className={`cursor-pointer p-0 ph-1 height-100 d-flex align-items-center${nav === "downloads" ? " border-bottom-1" : ""}`}
          >
            <i className="h2 m-0 d-flex align-items-center">
              <ion-icon name="download-outline" />
            </i>
            <span className="tablet-desktop-only ml-05">Downloads</span>
          </li>
          <li
            onClick={() => setNav("drive")}
            className={`cursor-pointer p-0 ph-1 height-100 d-flex align-items-center${nav === "drive" ? " border-bottom-1" : ""}`}
          >
            <i className="h2 m-0 d-flex align-items-center">
              <ion-icon name="push-outline" />
            </i>
            <span className="tablet-desktop-only ml-05">GDrive</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
