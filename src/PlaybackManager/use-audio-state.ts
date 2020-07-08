import { useState, useEffect } from "react";
import AudioPlayer from "../AudioPlayer";
import { PlayStates } from "./types";

export function useAudioState(player: AudioPlayer) {
  const [state, setState] = useState(PlayStates.SUSPENDED);

  useEffect(() => {
    const onPlay = () => setState(PlayStates.PLAYING);
    const onPause = () => setState(PlayStates.SUSPENDED);

    player.addListener("play", onPlay);
    player.addListener("pause", onPause);

    return () => {
      player.removeListener("play", onPlay);
      player.removeListener("pause", onPause);
    };
  }, [player]);

  return state;
}
