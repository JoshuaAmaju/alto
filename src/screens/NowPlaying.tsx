import classNames from "classnames";
import { Color, Frame } from "framer";
import { motion } from "framer-motion";
import React from "react";
import {
  ChevronDown,
  Heart,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from "react-feather";
import { createUseStyles } from "react-jss";
import { useHistory } from "react-router-dom";
import AlbumArt from "../components/AlbumArt";
import FlatButton from "../components/FlatButton";
import PlayPauseButton from "../components/PlayPauseButton";
import SongSlider from "../components/SongSlider";
import Text from "../components/Text";
import { RepeatMode, ShuffleMode } from "../PlaybackManager/types";
import usePlaybackManager from "../PlaybackManager/use-playback-manager";
import { service } from "../QueueService/QueueService";
import { Events } from "../QueueService/types";
import useEventValue from "../QueueService/use-event-value";
import { Song } from "../types";

const useStyle = createUseStyles({
  wrapper: {
    color: "white",
    flexDirection: "column",
  },
  container: {
    padding: "1rem",
    "& > * + *": {
      margin: { top: "1rem" },
    },
  },
  cover: {
    top: 0,
    left: 0,
    zIndex: -1,
    position: "absolute",
  },
  buttons: {
    padding: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "& > * + *": {
      margin: { left: "1rem" },
    },
  },
  header: {
    padding: "1rem",
  },
  rowSpaced: {
    display: "flex",
    justifyContent: "space-between",
  },
});

export default function NowPlaying() {
  const classes = useStyle();
  const { goBack } = useHistory();
  const {
    currentSong,
    playNextSong,
    toggleShuffle,
    cycleRepeatMode,
    playPreviousSong,
  } = usePlaybackManager();

  const { id, title, artist } = (currentSong ?? {}) as Song;

  const repeatMode = useEventValue(
    Events.REPEAT_MODE_CHANGED,
    service.repeatMode
  );

  const shuffleMode = useEventValue(
    Events.SHUFFLE_MODE_CHANGED,
    service.shuffleMode
  );

  const color = Color("black");
  const color50 = Color.alpha(color, 0.7);
  const color60 = Color.alpha(color, 0.8);
  const color70 = Color.alpha(color, 0.95);

  return (
    <motion.div
      layoutId="nowplaying"
      className={classNames(classes.wrapper, classes.rowSpaced, "Page")}
    >
      <header className={classNames(classes.header, classes.rowSpaced)}>
        <FlatButton onClick={goBack}>
          <ChevronDown size={30} color="white" />
        </FlatButton>
      </header>
      <AlbumArt layoutId={id} song={currentSong} className={classes.cover} />
      <Frame
        size="100%"
        style={{ zIndex: -1 }}
        background="linear-gradient(transparent, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0.8) 60%, rgba(0, 0, 0, 0.95) 70%, black 80%)"
      />
      <div className={classes.container}>
        <div className={classes.rowSpaced}>
          <div style={{ marginRight: "1rem" }}>
            <Text variant="h2">{title}</Text>
            <Text variant="h3" style={{ marginTop: "0.5rem" }}>
              {artist}
            </Text>
          </div>
          <PlayPauseButton size={35} color="white" />
        </div>
        <SongSlider />
        <div className={classes.buttons}>
          <Volume2 />
          <Heart />
          <FlatButton
            onClick={cycleRepeatMode}
            style={{ position: "relative" }}
          >
            <Repeat
              color={
                repeatMode === RepeatMode.ALL ||
                repeatMode === RepeatMode.CURRENT
                  ? "white"
                  : "grey"
              }
            />
            {repeatMode === RepeatMode.CURRENT && (
              <Frame
                radius={100}
                size="0.7rem"
                top="-0.2rem"
                right="-0.3rem"
                backgroundColor="white"
                style={{ padding: "0.6rem" }}
              >
                1
              </Frame>
            )}
          </FlatButton>
          <FlatButton onClick={toggleShuffle}>
            <Shuffle
              color={shuffleMode === ShuffleMode.SHUFFLE ? "white" : "grey"}
            />
          </FlatButton>
          <FlatButton onClick={() => playPreviousSong(true)}>
            <SkipBack color="white" />
          </FlatButton>
          <FlatButton onClick={() => playNextSong(true)}>
            <SkipForward color="white" />
          </FlatButton>
        </div>
      </div>
    </motion.div>
  );
}
