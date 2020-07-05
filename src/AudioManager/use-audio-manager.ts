import { useContext } from "react";
import AudioManagerContext from "./AudioManagerContext";

export default function useManager() {
  return useContext(AudioManagerContext);
}
