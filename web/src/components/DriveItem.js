import React from "react";

export default function DriveItem({ item: { id, name, modifiedTime, iconLink, mimeType }, setFolderId }) {
  const isFolder = mimeType === "application/vnd.google-apps.folder";
  const open = () => setFolderId(id);

  return (
    <div className="card">
      <div className="card-body">
        <h2>{name}</h2>
        <span>Modified: {modifiedTime}</span>
        {isFolder ? (
          <button className="btn primary m-0 mt-1" onClick={open}>
            Open folder
          </button>
        ) : (
          <a className="btn primary m-0 mt-1" href={`/api/v1/drive/file/${name}?id=${id}`} download>
            Download
          </a>
        )}
      </div>
    </div>
  );
}
