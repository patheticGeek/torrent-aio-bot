import React, { useState } from "react";
import useSWR from "swr";
import Input from "../components/Input";
import DownloadItem from "../components/DownloadItem";

function Downloads() {
  const fetcher = (...args) => fetch(...args).then(res => res.json());
  const { data, error } = useSWR("/api/v1/torrent/list", fetcher, { refreshInterval: 3500 });
  const [link, setLink] = useState("");
  const [adding, setAdding] = useState(false);
  const [addingError, setAddingError] = useState("");

  const add = async e => {
    if (e) e.preventDefault();
    setAdding(true);

    if (link.indexOf("magnet:") !== 0) {
      setAddingError("Link is not a magnet link");
    } else {
      setAddingError("");
      const resp = await fetch(`/api/v1/torrent/download?link=${link}`);

      if (resp.status === 200) {
        setLink("");
      } else {
        setAddingError("An error occured");
      }
    }

    setAdding(false);
  };

  return (
    <>
      <h1>Downloads</h1>

      <form onSubmit={add}>
        <Input
          id="link"
          name="link"
          label="Magnet Link"
          placeholder="magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10"
          value={link}
          onChange={setLink}
          required
        />
        {addingError !== "" && <div className="text-danger">{addingError}</div>}
        <button disabled={adding} className={`btn primary${adding ? " loading" : ""}`} type="submit">
          Add
        </button>
      </form>
      {error && <div className="text-danger mt-1">An error occured. Check your internet.</div>}
      {data && (
        <div className="d-flex-column mt-1">
          {data.torrents.map(torrent => (
            <DownloadItem torrent={torrent} key={torrent.magnetURI} />
          ))}
        </div>
      )}
    </>
  );
}

export default Downloads;
