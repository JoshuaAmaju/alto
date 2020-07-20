import React from "react";
import { createUseStyles } from "react-jss";
import { useHistory } from "react-router";
import { Song } from "../types";
import PlayPauseButton from "./PlayPauseButton";
import SongTile from "./SongTile";

interface NowPlayingCard {
  song: Song;
  layoutId?: string;
}

const useStyle = createUseStyles({
  padding: {
    padding: "0.7rem",
  },
});

export default function NowPlayingCard({ song, layoutId }: NowPlayingCard) {
  const classes = useStyle();
  const { push } = useHistory();

  return (
    <SongTile
      song={song}
      layoutId={layoutId}
      className={classes.padding}
      trailing={<PlayPauseButton />}
      onClick={() => push("/nowplaying")}
    />
  );
}
