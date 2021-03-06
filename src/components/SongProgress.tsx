import { IonProgressBar } from "@ionic/react";
import React from "react";
import usePlaybackManager from "../PlaybackManager/use-playback-manager";

export default function SongProgress() {
  const { duration, currentTime } = usePlaybackManager();
  return <IonProgressBar mode="ios" value={currentTime / duration} />;
}
