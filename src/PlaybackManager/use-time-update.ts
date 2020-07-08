import { useEffect, useState } from "react";
import AudioPlayer from "../AudioPlayer";

export function useTimeUpdate(player: AudioPlayer) {
  const [state, setState] = useState(0);

  useEffect(() => {
    const onTimeUpdate = () => setState(player.getCurrentTime());

    player.addListener("timeupdate", onTimeUpdate);

    return () => {
      player.removeListener("timeupdate", onTimeUpdate);
    };
  }, [player]);

  return state;
}
