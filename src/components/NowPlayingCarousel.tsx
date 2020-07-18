import { AnimatePresence, Frame } from "framer";
import React from "react";
import { createUseStyles } from "react-jss";
import NowPlayingCardList from "./NowPlayingCardList";
import usePlaybackManager from "../PlaybackManager/use-playback-manager";

const useStyle = createUseStyles({
  nowPlayingBottom: {
    borderTop: "1px solid #ccc",
    backdropFilter: "blur(15px)",
  },
});

export default function NowPlayingCarousel() {
  const classes = useStyle();
  const { currentSong } = usePlaybackManager();

  return (
    <AnimatePresence>
      {currentSong && (
        <Frame
          bottom={0}
          width="100%"
          height="auto"
          position="sticky"
          overflow="hidden"
          exit={{ y: 100 }}
          animate={{ y: 0 }}
          initial={{ y: 100 }}
          backgroundColor="#ffffffa1"
          className={classes.nowPlayingBottom}
        >
          <NowPlayingCardList />
        </Frame>
      )}
    </AnimatePresence>
  );
}
