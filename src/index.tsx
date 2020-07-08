import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { db } from "./database";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import SongsManager from "./SongsManager/SongsManager";
import PlaybackManager from "./PlaybackManager/PlaybackManager";

(async () => {
  await db.connect();

  ReactDOM.render(
    <React.StrictMode>
      <SongsManager>
        <PlaybackManager>
          <App />
        </PlaybackManager>
      </SongsManager>
    </React.StrictMode>,
    document.getElementById("root")
  );

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.unregister();
})();
