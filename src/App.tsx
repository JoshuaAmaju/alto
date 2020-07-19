import { AnimateSharedLayout, motion } from "framer-motion";
import React from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import NowPlayingCarousel from "./components/NowPlayingCarousel";
import AllSongs from "./screens/AllSongs";
import NowPlaying from "./screens/NowPlaying";
import Playlist from "./screens/Playlist";
import Playlists from "./screens/Playlists";

function App() {
  const location = useLocation();

  const { state } = location as any;
  const nowPlaying = state && state.nowPlaying;

  return (
    <>
      <AnimateSharedLayout type="crossfade">
        <Switch location={nowPlaying ?? location}>
          <Route exact path="/" render={() => <AllSongs />} />
          <Route path="/playlists" render={() => <Playlists />} />
          <Route path="/playlist/:name" render={() => <Playlist />} />
          {/* <Route path="/nowplaying" render={() => <NowPlaying />} /> */}
        </Switch>
        <NowPlayingCarousel />
        {nowPlaying && (
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
        )}
      </AnimateSharedLayout>
    </>
  );
}

export default App;
