import classNames from "classnames";
import React, { ReactEventHandler, ReactNode } from "react";
import { createUseStyles } from "react-jss";
import { useLongPress } from "react-use";
import { Song } from "../types";
import AlbumArt from "./AlbumArt";
import Text from "./Text";

interface SongTile {
  song: Song;
  layoutId?: string;
  className?: string;
  selected?: boolean;
  trailing?: ReactNode;
  selectedColor?: string;
  onClick?: ReactEventHandler;
  onActivate?: ReactEventHandler;
}

const useStyle = createUseStyles({
  cover: {
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
    transition: "background 0.5s",
    justifyContent: "space-between",
    "& h4": {
      color: "#6d6d6d",
      margin: { top: "0.5rem" },
    },
  },
  wrapper: {
    flex: 1,
  },
});

function SongTile({
  song,
  onClick,
  trailing,
  layoutId,
  selected,
  className,
  onActivate,
  selectedColor = "blue",
}: SongTile) {
  const classes = useStyle();
  const { title, artist, imageUrl } = song;

  return (
    <div
      style={{ background: selected ? selectedColor : "none" }}
      className={classNames(classes.row, classes.container, className)}
    >
      <div
        onClick={onClick}
        onDoubleClick={onActivate}
        className={classNames(classes.row, classes.wrapper)}
      >
        <AlbumArt
          url={imageUrl}
          layoutId={layoutId}
          className={classes.cover}
        />
        <div>
          <Text variant="h3" style={{ color: selected ? "white" : "initial" }}>
            {title}
          </Text>
          <Text
            variant="h4"
            style={{ color: selected ? "#d6d6d6" : "initial" }}
          >
            {artist}
          </Text>
        </div>
      </div>
      {trailing}
    </div>
  );
}

export default SongTile;
