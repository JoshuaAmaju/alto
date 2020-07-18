import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import NowPlayingCarousel from "./components/NowPlayingCarousel";
import AllSongs from "./screens/AllSongs";
import Playlist from "./screens/Playlist";
import Playlists from "./screens/Playlists";

function App() {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <AllSongs />
          </Route>
          <Route exact path="/playlists">
            <Playlists />
          </Route>
          <Route exact path="/playlist/:name">
            <Playlist />
          </Route>
        </Switch>
      </BrowserRouter>
      <NowPlayingCarousel />
    </>
  );
}

export default App;
