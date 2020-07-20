import React from "react";
import ReactDOM from "react-dom";

// import {} from 'react-router'

import App from "./App";
import { db } from "./database";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import SongsManager from "./SongsManager/SongsManager";
import PlaybackManager from "./PlaybackManager/PlaybackManager";
import PlaylistsManager from "./PlaylistsManager/PlaylistsManager";
import { BrowserRouter } from "react-router-dom";
import SwatchManager from "./SwatchManager/SwatchManager";

// const { Router } = require("react-router");

(async () => {
  await db.connect();

  ReactDOM.render(
    <React.StrictMode>
      <SongsManager>
        <PlaylistsManager>
          <PlaybackManager>
            <SwatchManager>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </SwatchManager>
          </PlaybackManager>
        </PlaylistsManager>
      </SongsManager>
    </React.StrictMode>,
    document.getElementById("root")
  );

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.unregister();
})();
