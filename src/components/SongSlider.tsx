import React from "react";
import { createUseStyles } from "react-jss";
import usePlaybackManager from "../PlaybackManager/use-playback-manager";
import { formatTime } from "../utils";

const useStyle = createUseStyles({
  slider: {
    width: "100%",
  },
  timeWrapper: {
    display: "flex",
    margin: { top: "1rem" },
    justifyContent: "space-between",
  },
  time: {
    color: "white",
    fontWeight: "bold",
  },
  container: {
    padding: "1rem",
  },
});

const Time = ({ time }: { time: number }) => {
  const classes = useStyle();
  return <span className={classes.time}>{formatTime(time)}</span>;
};

export default function SongSlider() {
  const { seekTo, duration, currentTime } = usePlaybackManager();

  const classes = useStyle();

  return (
    <div className={classes.container}>
      <input
        type="range"
        min={0}
        max={duration}
        value={currentTime}
        style={{ width: "100%" }}
        onChange={(e) => seekTo(parseFloat(e.target.value as any))}
      />
      <div className={classes.timeWrapper}>
        <Time time={currentTime} />
        <Time time={duration} />
      </div>
    </div>
  );
}
