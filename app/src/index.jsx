import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import ApiService from "./common/api.service";
import { StoreProvider } from "./common/AppStore";

ApiService.init();

ReactDOM.render(
  <StoreProvider>
    <App />
  </StoreProvider>,
  document.getElementById("root")
);
