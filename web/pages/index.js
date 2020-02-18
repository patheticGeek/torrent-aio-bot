import React, { Component } from "react";
import axios from "axios";
import Search from "../components/Search";
import Downloads from "../components/Downloads";

class Index extends Component {
  state = { nav: "downloads", searchProps: null };

  static getInitialProps = async ({ query }) => {
    if (!query.term || !query.site || process.browser) return {};
    let searchProps;
    const api = process.env.SITE || "https://torrent-aio-bot.herokuapp.com/";
    const res = await axios(
      `${api}api/v1/search/${query.site}?query=${query.term}`
    );
    if (res.status !== 200) {
      searchProps = {
        query,
        error: true,
        errorMessage: "An error occured"
      };
    } else {
      const data = res.data;
      searchProps = { site: query.site, term: query.term, ...data };
    }
    return { searchProps };
  };

  render() {
    const { nav } = this.state;
    const { searchProps } = this.props;

    return (
      <>
        <div className="nav nav-horiz">
          <div className="content">
            <ul className="d-flex align-items-center space-around width-100 m-0">
              <li
                onClick={() => this.setState({ nav: "search" })}
                className={`cursor-pointer p-0 ph-1 height-100 d-flex align-items-center${
                  nav === "search" ? " border-bottom-1" : ""
                }`}
              >
                <i className="ion ion-md-search h2 m-0" />
                <span className="tablet-desktop-only ml-05">Search</span>
              </li>
              <li
                onClick={() => this.setState({ nav: "downloads" })}
                className={`cursor-pointer p-0 ph-1 height-100 d-flex align-items-center${
                  nav === "downloads" ? " border-bottom-1" : ""
                }`}
              >
                <i className="ion ion-md-download h2 m-0" />
                <span className="tablet-desktop-only ml-05">Downloads</span>
              </li>
            </ul>
          </div>
        </div>
        <main>
          <div className="content">
            {nav === "search" && <Search searchProps={searchProps} />}
            {nav === "downloads" && <Downloads />}
          </div>
        </main>
      </>
    );
  }
}

export default Index;
