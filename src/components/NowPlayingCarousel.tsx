import { AnimatePresence } from "framer";
import { motion } from "framer-motion";
import React from "react";
import { createUseStyles } from "react-jss";
import usePlaybackManager from "../PlaybackManager/use-playback-manager";
import NowPlayingCardList from "./NowPlayingCardList";
import SongProgress from "./SongProgress";

const useStyle = createUseStyles({
  nowPlayingBottom: {
    bottom: 0,
    position: "sticky",
    overflow: "hidden",
    borderTop: "1px solid #ccc",
    backdropFilter: "blur(15px)",
    backgroundColor: "#ffffffa1",
  },
});

export default function NowPlayingCarousel() {
  const classes = useStyle();
  const { currentSong } = usePlaybackManager();

  return (
    <AnimatePresence>
      {currentSong && (
        <motion.div
          exit={{ y: 100 }}
          animate={{ y: 0 }}
          initial={{ y: 100 }}
          layoutId="nowplaying"
          className={classes.nowPlayingBottom}
        >
          <SongProgress />
          <NowPlayingCardList />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
