import classNames from "classnames";
import { HTMLMotionProps, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { Song } from "../types";

const useStyle = createUseStyles({
  cover: {
    width: "100%",
    height: "100%",
    display: "block",
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

interface AlbumArt extends HTMLMotionProps<"div"> {
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

  console.log(song);

  useEffect(() => {
    const img = new Image();
    const url = song.getImage?.();
    img.onload = () => setImage(img.src);
    img.onerror = () => setImage(undefined);
    img.src = url ?? "";
  }, [song]);

  return image ? (
    <motion.img
      {...props}
      src={image}
      alt={description}
      className={classNames(classes.cover, className)}
    />
  ) : (
    <motion.div
      {...props}
      className={classNames(classes.cover, classes.placeholder, className)}
    >
      <h3>alto</h3>
    </motion.div>
  );
}
