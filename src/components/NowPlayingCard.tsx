import { Frame } from "framer";
import React from "react";
import { PlayStates } from "../PlaybackManager/types";
import usePlaybackManager from "../PlaybackManager/use-playback-manager";
import { Song } from "../types";

interface NowPlayingCard {
  song: Song;
  type?: "full" | "mini";
}

export default function NowPlayingCard({
  song,
  type = "full",
}: NowPlayingCard) {
  const { title, artist } = song;
  const { state, play, pause } = usePlaybackManager();

  return (
    <Frame>
      <div>
        <h2>{title}</h2>
        {type === "full" && <h3>{artist}</h3>}
      </div>
      <button
        onClick={() => {
          if (state === PlayStates.PLAYING) pause();
          if (state === PlayStates.SUSPENDED) play();
        }}
      >
        {state === PlayStates.PLAYING ? "Pause" : "Play"}
      </button>
    </Frame>
  );
}
