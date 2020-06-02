import React, { useState } from "react";

function SearchItem({ result, site, api }) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({});

  const loadDetails = async () => {
    setLoading(true);

    const res = await fetch(api + "api/v1/details/" + site + "?query=" + result.link);
    if (res.status !== 200) {
      setResponse({ error: true, errorMessage: "Cannot connect to site" });
    } else {
      const response = await res.json();
      setResponse({ ...response });
    }

    setLoading(false);
  };

  const copyToClipboard = () => {
    const str = response.torrent.downloadLink;
    const el = document.createElement("textarea");
    el.value = str;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  };

  return (
    <div className="card">
      <div className="card-body">
        <h2>{result.name}</h2>
        <div className="text-primary text-400">Seeds: {result.seeds}</div>
        <div className="text-400">{result.details}</div>
        {!response.torrent && (
          <button onClick={loadDetails} disabled={loading} className={`btn primary${loading ? " loading" : ""}`}>
            Load details
          </button>
        )}
        {response.error && <div className="text-danger">{response.errorMessage}</div>}
        {response.torrent && (
          <div className="mt-1">
            {response.torrent.details.map(({ infoText, infoTitle }, i) => (
              <div className="d-flex space-between" key={i}>
                <div className="text-400">{infoTitle}</div>
                <div className="text-300">{infoText}</div>
              </div>
            ))}
            <a href={response.torrent.downloadLink} className="btn warning m-0 mt-1">
              Download
            </a>
            <button onClick={copyToClipboard} className="btn primary m-0 ml-1 mt-1">
              Copy link
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchItem;
