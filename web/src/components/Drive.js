import React, { useState, useEffect } from "react";
import DriveItem from "../components/DriveItem";

export default function Drive() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [folderId, setFolderId] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetch("/api/v1/drive/folder?id=" + folderId).then(res => res.json());
        setData(data);
      } catch (e) {
        setError(e.message || "An error occured");
      }
      setLoading(false);
    })();
  }, [folderId]);

  const home = () => setFolderId("");

  return (
    <>
      <h1 className="d-flex align-items-center">
        {folderId && (
          <i style={{ marginRight: 8, cursor: "pointer" }} className="d-flex align-items-center" onClick={home}>
            <ion-icon name="arrow-back-outline" />
          </i>
        )}
        Drive Index
      </h1>
      {loading && <div className="loading-div" />}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {!loading && data && data.map(item => <DriveItem key={item.id} item={item} setFolderId={setFolderId} />)}
    </>
  );
}
