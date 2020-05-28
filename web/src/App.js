import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from "./screens/Home";
import DriveHelp from "./screens/DriveHelp";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/drivehelp" component={DriveHelp} />
      </Switch>
    </Router>
  );
}

export default App;
