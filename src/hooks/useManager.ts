import { useContext } from "react";
import AudioManagerContext from "../context/audio-manager.context";

export default function useManager() {
  return useContext(AudioManagerContext);
}
