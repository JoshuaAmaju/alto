import { AnimateSharedLayout, AnimatePresence } from "framer-motion";
import React from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import BottomBar from "./components/BottomBar";
import BottomBarWrapper from "./components/BottomBarWrapper";
import NowPlayingCarousel from "./components/NowPlayingCarousel";
import AllSongs from "./screens/AllSongs";
import NowPlaying from "./screens/NowPlaying";
import Playlist from "./screens/Playlist";
import Playlists from "./screens/Playlists";
import Search from "./screens/Search";

function App() {
  const location = useLocation();
  const { state } = location as any;
  const nowPlaying = state && state.nowPlaying;

  return (
    <>
      <AnimateSharedLayout type="crossfade">
        <Switch location={nowPlaying ?? location}>
          <Route
            exact
            path="/"
            render={() => (
              <>
                <AllSongs />
                <BottomBarWrapper />
              </>
            )}
          />
          <Route
            path="/playlists"
            render={() => (
              <>
                <Playlists />
                <BottomBarWrapper />
              </>
            )}
          />

          <Route
            path="/playlist/:name"
            render={() => (
              <>
                <Playlist />
                <NowPlayingCarousel />
              </>
            )}
          />

          <Route
            path="/search"
            render={() => (
              <>
                <Search />
                <BottomBar />
              </>
            )}
          />

          <Route
            path={["/nowplaying", "/queue"]}
            render={() => (
              <AnimatePresence>
                <NowPlaying />
              </AnimatePresence>
            )}
          />
        </Switch>
      </AnimateSharedLayout>
    </>
  );
}

export default App;
