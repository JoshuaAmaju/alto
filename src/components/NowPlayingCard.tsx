import { Frame } from "framer";
import React from "react";
import { PlayStates } from "../AudioManager/types";
import useAudioManager from "../AudioManager/use-audio-manager";
import { service } from "../MusicService/MusicService";
import { Events } from "../MusicService/types";
import { Song } from "../types";

interface NowPlayingCard {
  song: Song;
  type: "full" | "mini";
}

export default function NowPlayingCard({ type, song }: NowPlayingCard) {
  const { title, artist, getImage } = song;
  const { state } = useAudioManager();

  return (
    <Frame background={getImage()}>
      <div>
        <h2>{title}</h2>
        {type === "full" && <h3>{artist}</h3>}
      </div>
      <button
        onClick={() => {
          if (state === PlayStates.PLAYING) {
            service.sendEvent(Events.ACTION_PAUSE);
          }

          if (state === PlayStates.SUSPENDED) {
            service.sendEvent(Events.ACTION_PLAY);
          }
        }}
      >
        {state === PlayStates.PLAYING ? "Pause" : "Play"}
      </button>
    </Frame>
  );
}
