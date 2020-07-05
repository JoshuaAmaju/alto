import { useContext } from "react";
import AudioManagerContext from "./AudioManagerContext";

export default function useAudioManager() {
  return useContext(AudioManagerContext);
}
