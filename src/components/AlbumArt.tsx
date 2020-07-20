import classNames from "classnames";
import { HTMLMotionProps, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { Song } from "../types";

import placeholder from "../assets/svg/placeholder.svg";

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
  let { artist, title, imageUrl } = song;
  const description = `${artist} - ${title}`;
  const [image, setImage] = useState(placeholder);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImage(img.src);
    img.src = imageUrl;
  }, [imageUrl]);

  return (
    <motion.img
      {...props}
      src={image}
      alt={description}
      className={classNames(classes.cover, className)}
    />
  );
}
