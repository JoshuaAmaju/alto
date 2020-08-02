import classNames from "classnames";
import { HTMLMotionProps, motion } from "framer-motion";
import React from "react";
import { createUseStyles } from "react-jss";

interface AlbumArt extends HTMLMotionProps<"div"> {
  url?: string;
}

const useStyle = createUseStyles({
  cover: {
    width: "100%",
    height: "100%",
    display: "block",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundImage: ({ url }) => `url(${url})`,
  },
  placeholder: {
    display: "flex",
    color: "#656565",
    alignItems: "center",
    backgroundColor: "#333",
    justifyContent: "center",
  },
});

export default function AlbumArt({ url = "", className, ...props }: AlbumArt) {
  const classes = useStyle({ url });

  return (
    <motion.div {...props} className={classNames(classes.cover, className)} />
  );
}
