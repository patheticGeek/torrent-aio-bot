import React, { Component } from "react";
import Search from "../components/Search";
import Downloads from "../components/Downloads";
import Router from "next/router";

class Index extends Component {
  state = { nav: "search", searchProps: null };

  static getInitialProps = async ({ query: { term, site } }) => {
    if (process.browser || !term || !site) return {};
    return { searchProps: { term, site } };
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
                className={`cursor-pointer p-0 ph-1 height-100 d-flex align-items-center${nav === "search" ? " border-bottom-1" : ""}`}
              >
                <i className="ion ion-md-search h2 m-0" />
                <span className="tablet-desktop-only ml-05">Search</span>
              </li>
              <li
                onClick={() => {
                  Router.push("/");
                  this.setState({ nav: "downloads" });
                }}
                className={`cursor-pointer p-0 ph-1 height-100 d-flex align-items-center${nav === "downloads" ? " border-bottom-1" : ""}`}
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
