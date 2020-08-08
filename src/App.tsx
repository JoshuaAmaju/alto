import { AnimateSharedLayout } from "framer-motion";
import React from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import BottomBar from "./components/BottomBar";
import NowPlayingCarousel from "./components/NowPlayingCarousel";
import AllSongs from "./screens/AllSongs";
import NowPlaying from "./screens/NowPlaying";
import Playlist from "./screens/Playlist";
import Playlists from "./screens/Playlists";
import Search from "./screens/Search";
import BottomBarWrapper from "./components/BottomBarWrapper";

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

          <Route path="/nowplaying" render={() => <NowPlaying />} />
        </Switch>
        {/* {nowPlaying && (
          <Route
            path="/nowplaying"
            children={
              <motion.div
                layoutId="nowplaying"
                style={{
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  position: "fixed",
                  backgroundColor: "white",
                }}
              >
                <NowPlaying />
              </motion.div>
            }
          />
        )} */}
      </AnimateSharedLayout>
    </>
  );
}

export default App;
