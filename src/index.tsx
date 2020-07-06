import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import SongsManager from "./SongsManager/SongsManager";
import AudioManager from "./AudioManager/AudioManager";
import { db } from "./database";

(async () => {
  await db.connect();

  ReactDOM.render(
    <React.StrictMode>
      <SongsManager>
        <AudioManager>
          <App />
        </AudioManager>
      </SongsManager>
    </React.StrictMode>,
    document.getElementById("root")
  );

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.unregister();
})();
