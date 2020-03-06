import React, { Component } from "react";
import Input from "./Input";
import SearchItem from "./SearchItem";
import Router from "next/router";

class Search extends Component {
  state = {
    term: "",
    site: "piratebay",
    loading: false,
    error: false,
    errorMessage: "",
    results: []
  };

  componentDidMount = () => {
    if (this.props.searchProps) {
      this.setState({ ...this.props.searchProps }, this.search);
    }
  };

  search = async e => {
    if (e) e.preventDefault();
    let { term, site } = this.state;
    this.setState({ loading: true, results: [] });
    term = term.trim();

    if (term !== "") {
      Router.replace(`/?site=${site}&term=${term}`);
      const res = await fetch("/api/v1/search/" + site + "?query=" + term);
      if (res.status !== 200) {
        this.setState({
          error: true,
          errorMessage: "Cannot connect to site"
        });
      } else {
        const response = await res.json();
        this.setState({ ...response });
      }
    }
    this.setState({ loading: false });
  };

  handleSelect = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    const { term, loading, results, site, error, errorMessage } = this.state;

    return (
      <>
        <h1>Search</h1>
        <form onSubmit={this.search}>
          <div className="form-group">
            <label htmlFor="site">Site</label>
            <select
              className="form-control"
              id="site"
              name="site"
              onChange={this.handleSelect}
            >
              <option value="piratebay">Piratebay</option>
              <option value="limetorrent">Limetorrents</option>
              <option value="1337x">1337x</option>
            </select>
          </div>
          <Input
            id="term"
            name="term"
            label="Search Term"
            placeholder="The forgotten army, Flames..."
            value={term}
            onChange={term => this.setState({ term })}
            required
          />
          <button
            disabled={loading}
            className={`btn primary${loading ? " loading" : ""}`}
            type="submit"
          >
            Search
          </button>
        </form>
        <div className="d-flex-column mv-1">
          {error && <div className="text-danger">{errorMessage}</div>}
          {results &&
            results.length > 0 &&
            results.map(result => (
              <SearchItem site={site} result={result} key={result.link} />
            ))}
        </div>
      </>
    );
  }
}

export default Search;
