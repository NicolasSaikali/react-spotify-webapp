import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { GlobalStateProvider, defaultGlobalState } from "./Context";

//styles
import "./App.css";
import Landing from "./views/Landing";

function App() {
  return (
    <GlobalStateProvider value={defaultGlobalState}>
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/" component={Landing} />
          </Switch>
        </Router>
      </div>
    </GlobalStateProvider>
  );
}

export default App;
