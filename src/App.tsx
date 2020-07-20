import { AnimateSharedLayout, motion } from "framer-motion";
import React from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import BottomBar from "./components/BottomBar";
import AllSongs from "./screens/AllSongs";
import NowPlaying from "./screens/NowPlaying";
import Playlist from "./screens/Playlist";
import Playlists from "./screens/Playlists";
import NowPlayingCarousel from "./components/NowPlayingCarousel";

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
                <BottomBar />
              </>
            )}
          />
          <Route
            path="/playlists"
            render={() => (
              <>
                <Playlists />
                <BottomBar />
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
