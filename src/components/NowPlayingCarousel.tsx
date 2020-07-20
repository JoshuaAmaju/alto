import { AnimatePresence, Frame } from "framer";
import React from "react";
import { createUseStyles } from "react-jss";
import usePlaybackManager from "../PlaybackManager/use-playback-manager";
import NowPlayingCardList from "./NowPlayingCardList";
import SongProgress from "./SongProgress";

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
          // bottom={0}
          width="100%"
          height="auto"
          // position="sticky"
          overflow="hidden"
          exit={{ y: 100 }}
          animate={{ y: 0 }}
          position="relative"
          initial={{ y: 100 }}
          layoutId="nowplaying"
          backgroundColor="#ffffffa1"
          className={classes.nowPlayingBottom}
        >
          <SongProgress />
          <NowPlayingCardList />
        </Frame>
      )}
    </AnimatePresence>
  );
}
