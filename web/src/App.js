import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from "./screens/Home";
import DriveHelp from "./screens/DriveHelp";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/search">
          <Home tab="search" />
        </Route>
        <Route path="/drive/:folderId?">
          <Home tab="drive" />
        </Route>
        <Route exact path="/download">
          <Home tab="downloads" />
        </Route>
        <Route exact path="/drivehelp" component={DriveHelp} />
      </Switch>
    </Router>
  );
}

export default App;
