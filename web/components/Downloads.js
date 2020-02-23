import React, { Component } from "react";
import Input from "./Input";

class Downloads extends Component {
  state = {
    torrents: [],
    link: "",
    adding: false,
    addingError: "",
    error: false,
    errorMessage: ""
  };

  componentDidMount = () => {
    this.load();
    this.downloadLoader = setInterval(this.load, 1500);
  };

  componentWillUnmount = () => {
    if (this.downloadLoader) this.downloadLoader === null;
  };

  load = async () => {
    const resp = await fetch("/api/v1/torrent/list");
    if (resp.status === 200 && !resp.error) {
      const data = await resp.json();
      this.setState({ ...data });
    } else {
      this.setState({
        torrents: [],
        error: true,
        errorMessage: "Cannot connect to server"
      });
      this.downloadLoader = null;
    }
  };

  add = async e => {
    if (e) e.preventDefault();
    const { link } = this.state;
    this.setState({ adding: true, addingError: "" });
    if (link.indexOf("magnet:") !== 0) {
      this.setState({
        adding: false,
        addingError: "Link is not a magnet link"
      });
    } else {
      const resp = await fetch(`/api/v1/torrent/download?link=${link}`);
      if (resp.status === 200) {
        this.setState({ adding: false, link: "" });
      } else {
        console.log("resp", resp);
        this.setState({
          adding: false,
          addingError: "Cannot connect to server"
        });
      }
    }
  };

  render() {
    const {
      link,
      adding,
      addingError,
      torrents,
      error,
      errorMessage
    } = this.state;

    return (
      <>
        <h1>Downloads</h1>

        <form onSubmit={this.add}>
          <Input
            id="link"
            name="link"
            label="Magnet Link"
            placeholder="magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10"
            value={link}
            onChange={link => this.setState({ link })}
            required
          />
          {addingError !== "" && (
            <div className="text-danger">{addingError}</div>
          )}
          <button
            disabled={adding}
            className={`btn primary${adding ? " loading" : ""}`}
            type="submit"
          >
            Add
          </button>
        </form>

        {error && <div className="text-danger">{errorMessage}</div>}
        {torrents && (
          <div className="d-flex-column mt-1">
            {torrents.map(torr => (
              <div className="card" key={torr.magnetURI}>
                <div className="card-header compact d-flex space-between">
                  <h3 style={{ lineBreak: "anywhere", marginRight: "8px" }}>
                    {torr.name}
                  </h3>
                  <div className="text-400 text-primary">
                    {torr.done ? "Done" : torr.redableTimeRemaining}
                  </div>
                </div>
                {torr.progress !== 100 && (
                  <div
                    style={{
                      height: "4px",
                      width: `${torr.progress}%`,
                      backgroundColor: "var(--primary)"
                    }}
                  />
                )}
                <div className="card-body compact">
                  <div className="d-flex space-between">
                    <div className="text-400">Status: </div>
                    <div>{torr.status}</div>
                  </div>
                  <div className="d-flex space-between">
                    <div className="text-400">Size: </div>
                    <div>{torr.total}</div>
                  </div>
                  <div className="d-flex space-between">
                    <div className="text-400">Downloaded: </div>
                    <div>{torr.downloaded}</div>
                  </div>
                  <div className="d-flex space-between">
                    <div className="text-400">Speed: </div>
                    <div>{torr.speed}</div>
                  </div>
                  {torr.done && (
                    <a href={torr.downloadLink} className="btn success">
                      Open
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    );
  }
}

export default Downloads;
