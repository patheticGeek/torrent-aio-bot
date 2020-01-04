import React, { Component } from "react";

class Search extends Component {
  static getServerProps = ({ query: { term } }) => ({ term: term });

  state = { site: "piratebay", query: this.props.term ? this.props.term : "" };

  render() {
    return (
      <main>
        <div className="content">Search</div>
      </main>
    );
  }
}

export default Search;
