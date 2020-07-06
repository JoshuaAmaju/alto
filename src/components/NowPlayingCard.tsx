import { Frame } from "framer";
import React from "react";
import { PlayStates } from "../AudioManager/types";
import useAudioManager from "../AudioManager/use-audio-manager";
import { Song } from "../types";
import { togglePlayState } from "../utils";

interface NowPlayingCard {
  song: Song;
  type?: "full" | "mini";
}

export default function NowPlayingCard({
  type = "full",
  song,
}: NowPlayingCard) {
  const { title, artist } = song;
  const { state } = useAudioManager();

  return (
    <Frame>
      <div>
        <h2>{title}</h2>
        {type === "full" && <h3>{artist}</h3>}
      </div>
      <button onClick={() => togglePlayState(state)}>
        {state === PlayStates.PLAYING ? "Pause" : "Play"}
      </button>
    </Frame>
  );
}
