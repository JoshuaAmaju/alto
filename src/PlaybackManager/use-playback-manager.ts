import { useContext } from "react";
import PlaybackManagerContext from "./PlaybackManagerContext";

export default function usePlaybackManager() {
  return useContext(PlaybackManagerContext);
}
