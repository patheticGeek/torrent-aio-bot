import React, { Component } from "react";

class Search extends Component {
  static getServerProps = ({ query: { term, site } }) => ({ term, site });

  state = {
    site: this.props.site || "piratebay",
    q: this.props.q ? this.props.q : ""
  };

  render() {
    return (
      <main>
        <div className="content">Search</div>
      </main>
    );
  }
}

export default Search;
