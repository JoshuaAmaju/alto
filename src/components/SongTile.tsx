import React, { ReactNode, ReactEventHandler } from "react";
import { Song } from "../types";
import AlbumArt from "./AlbumArt";
import Text from "./Text";
import { createUseStyles } from "react-jss";
import classNames from "classnames";

interface SongTile {
  song: Song;
  trailing?: ReactNode;
  onClick?: ReactEventHandler;
}

const useStyle = createUseStyles({
  cover: {
    // borderRadius: 7,
    width: "3.5rem",
    height: "3.5rem",
    flex: "0 0 3.5rem",
    overflow: "hidden",
  },
  row: {
    display: "flex",
    alignItems: "center",
    "& > * + *": {
      margin: {
        left: "1rem",
      },
    },
  },
  container: {
    padding: "1rem",
    justifyContent: "space-between",
    "& h4": {
      color: "#6d6d6d",
      margin: { top: "0.5rem" },
    },
  },
});

export default function SongTile({ song, onClick, trailing }: SongTile) {
  const classes = useStyle();
  const { id, title, artist } = song;

  return (
    <div className={classNames(classes.row, classes.container)}>
      <div className={classes.row} onClick={onClick}>
        <AlbumArt
          song={song}
          className={classes.cover}
          layoutId={`${title}-${id}`}
        />
        <div>
          <Text variant="h3">{title}</Text>
          <Text variant="h4">{artist}</Text>
        </div>
      </div>
      {trailing}
    </div>
  );
}
