import React, { useState, useEffect } from "react";
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

export default function AlbumArt({ song = {} as Song }: { song: Song }) {
  const classes = useStyle();
  let { artist, title } = song;
  const description = `${artist} - ${title}`;
  const [image, setImage] = useState<string>();

  useEffect(() => {
    const img = new Image();
    const url = song.getImage();
    img.onload = () => setImage(img.src);
    img.onerror = () => setImage(undefined);
    img.src = url ?? "";
  }, [song]);

  return image ? (
    <img src={image} alt={description} className={classes.cover} />
  ) : (
    <div className={classNames(classes.cover, classes.placeholder)}>
      <h3>alto</h3>
    </div>
  );
}
