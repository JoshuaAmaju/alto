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
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundImage: ({ image }) => `url(${image})`,
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
  let { imageUrl } = song;
  const [image, setImage] = useState(placeholder);

  const classes = useStyle({ image });

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImage(img.src);
    img.src = imageUrl;
  }, [imageUrl]);

  return (
    <motion.div {...props} className={classNames(classes.cover, className)} />
  );
}
