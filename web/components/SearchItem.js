import React, { Component } from "react";

class SearchItem extends Component {
  state = { loading: false, loaded: false, torrent: null };

  loadDetails = async () => {
    this.setState({ loading: true });
    const { result, site } = this.props;
    const res = await fetch("/api/v1/details/" + site + "?query=" + result.link);
    if (res.status !== 200) {
      this.setState({ error: true, errorMessage: "Cannot connect to site" });
    } else {
      const response = await res.json();
      this.setState({ ...response });
    }
    this.setState({ loading: false, loaded: true });
  };

  copyToClipboard = () => {
    const str = this.state.torrent.downloadLink;
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

  render() {
    const { result } = this.props;
    const { loading, loaded, torrent } = this.state;

    return (
      <div className="card">
        <div className="card-body">
          <h2>{result.name}</h2>
          <div className="text-primary text-400">Seeds: {result.seeds}</div>
          <div className="text-400">{result.details}</div>
          {!loaded && (
            <button onClick={this.loadDetails} disabled={loading} className={`btn primary${loading ? " loading" : ""}`}>
              Load details
            </button>
          )}
          {torrent && (
            <div className="mt-1">
              {torrent.details.map(({ infoText, infoTitle }, i) => (
                <div className="d-flex space-between" key={i}>
                  <div className="text-400">{infoTitle}</div>
                  <div className="text-300">{infoText}</div>
                </div>
              ))}
              <a href={torrent.downloadLink} className="btn warning m-0 mt-1">
                Download
              </a>
              <a onClick={this.copyToClipboard} className="btn primary m-0 ml-1 mt-1">
                Copy link
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default SearchItem;
