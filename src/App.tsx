import React from "react";

import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";

import {
  IonApp,
  IonPage,
  IonSplitPane,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonNav,
  IonContent,
} from "@ionic/react";

import AllSongs from "./screens/AllSongs";
import Drawer from "./components/Drawer";
import Playlists from "./screens/Playlists";

function App() {
  return (
    <div className="App">
      {/* <Drawer open={true}>hello</Drawer> */}
      <IonApp>
        <IonSplitPane contentId="main">
          <IonMenu>
            <IonNav>
              <ul>
                <li>Playlist</li>
              </ul>
            </IonNav>
          </IonMenu>
          <AllSongs />
        </IonSplitPane>
        {/* <Playlists /> */}
      </IonApp>
    </div>
  );
}

export default App;
