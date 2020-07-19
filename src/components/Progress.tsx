import { IonProgressBar } from "@ionic/react";
import React, { useMemo } from "react";
import usePlaybackManager from "../PlaybackManager/use-playback-manager";

export default function SongProgress() {
  const { getDuration, currentSong, currentTime } = usePlaybackManager();

  const duration = useMemo(() => {
    return getDuration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong]);

  return <IonProgressBar mode="ios" value={currentTime / duration} />;
}
