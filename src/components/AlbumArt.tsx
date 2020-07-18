import React, { useState, useEffect, HTMLAttributes } from "react";
import { Song } from "../types";
import { createUseStyles } from "react-jss";
import classNames from "classnames";

const useStyle = createUseStyles({
  cover: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  placeholder: {
    display: "flex",
    color: "#656565",
    alignItems: "center",
    backgroundColor: "#333",
    justifyContent: "center",
  },
});

interface AlbumArt extends HTMLAttributes<HTMLElement> {
  song?: Song;
}

export default function AlbumArt({
  song = {} as Song,
  className,
  ...props
}: AlbumArt) {
  const classes = useStyle();
  let { artist, title } = song;
  const description = `${artist} - ${title}`;
  const [image, setImage] = useState<string>();

  useEffect(() => {
    const img = new Image();
    const url = song.getImage?.();
    img.onload = () => setImage(img.src);
    img.onerror = () => setImage(undefined);
    img.src = url ?? "";
  }, [song]);

  return image ? (
    <img
      {...props}
      src={image}
      alt={description}
      className={classNames(classes.cover, className)}
    />
  ) : (
    <div
      {...props}
      className={classNames(classes.cover, classes.placeholder, className)}
    >
      <h3>alto</h3>
    </div>
  );
}
