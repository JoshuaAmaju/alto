import React from "react";
import NowPlayingCarousel from "./components/NowPlayingCarousel";
import usePlaybackManager from "./PlaybackManager/use-playback-manager";
import AllSongs from "./screens/AllSongs";
import Playlists from "./screens/Playlists";
import AppHeader from "./components/AppHeader";

const { Link, Route, BrowserRouter } = require("react-router-dom");

function App() {
  const { currentSong } = usePlaybackManager();

  return (
    <>
      <BrowserRouter>
        <AppHeader title="Song" />
        <Route exact path="/">
          <AllSongs />
        </Route>
        <Route path="/playlists">
          <Playlists />
        </Route>
      </BrowserRouter>
      {currentSong && <NowPlayingCarousel />}
    </>
  );
}

export default App;
