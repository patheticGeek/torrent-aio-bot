import React from "react";
import { Link } from "react-router-dom";

export default function DriveItem({ item: { id, name, modifiedTime, iconLink, mimeType } }) {
  const isFolder = mimeType === "application/vnd.google-apps.folder";

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="d-flex align-items-center">
          <img
            src={iconLink}
            alt={mimeType}
            style={{ width: 20, height: 20, objectFit: "contain", objectPosition: "center", marginRight: 8 }}
          />
          {name}
        </h2>
        <span>Modified: {modifiedTime}</span>
        {isFolder ? (
          <Link className="btn primary m-0 mt-1" to={`/drive/${id}`}>
            Open folder
          </Link>
        ) : (
          <a className="btn primary m-0 mt-1" href={`/api/v1/drive/file/${name}?id=${id}`} download>
            Download
          </a>
        )}
      </div>
    </div>
  );
}
