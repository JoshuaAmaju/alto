import { IonApp } from "@ionic/react";
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import React from "react";
import AllSongs from "./screens/AllSongs";

function App() {
  return (
    <div className="App">
      {/* <Drawer open={true}>hello</Drawer> */}
      <IonApp>
        {/* <IonSplitPane contentId="main">
          <IonMenu>
            <IonNav>
              <ul>
                <li>Playlist</li>
              </ul>
            </IonNav>
          </IonMenu>
          <AllSongs />
        </IonSplitPane> */}
        {/* <Playlists /> */}
        <AllSongs />
      </IonApp>
    </div>
  );
}

export default App;
