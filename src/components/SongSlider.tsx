import { IonRange } from "@ionic/react";
import React, { useMemo } from "react";
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
  const {
    seekTo,
    currentTime,
    currentSong,
    getDuration,
  } = usePlaybackManager();

  const classes = useStyle();

  const duration = useMemo(() => {
    return getDuration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong]);

  return (
    <div className={classes.container}>
      <IonRange
        min={0}
        mode="ios"
        max={duration}
        value={currentTime}
        onIonChange={(e) => seekTo(parseFloat(e.detail.value as any))}
      />
      <div className={classes.timeWrapper}>
        <Time time={currentTime} />
        <Time time={duration} />
      </div>
    </div>
  );
}