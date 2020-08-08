import React from "react";
import { createUseStyles } from "react-jss";
import NowPlayingCarousel from "./NowPlayingCarousel";
import BottomBar from "./BottomBar";

const useStyle = createUseStyles({
  wrapper: {
    bottom: 0,
    position: "sticky",
  },
});

export default function BottomBarWrapper() {
  const classes = useStyle();
  return (
    <div className={classes.wrapper}>
      <NowPlayingCarousel />
      <BottomBar />
    </div>
  );
}
