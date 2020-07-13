import React, { useMemo } from "react";
import { Frame } from "framer";
import usePlaybackManager from "../PlaybackManager/use-playback-manager";
import { IonProgressBar } from "@ionic/react";

export default function SongProgress() {
  const { getDuration, currentSong, currentTime } = usePlaybackManager();

  const duration = useMemo(() => {
    return getDuration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong]);

  return <IonProgressBar mode="ios" value={currentTime / duration} />;
}
