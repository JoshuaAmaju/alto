import React from "react";
import { PlayStates } from "../PlaybackManager/types";
import usePlaybackManager from "../PlaybackManager/use-playback-manager";
import { Song } from "../types";
import SongProgress from "./Progress";
import SongTile from "./SongTile";

interface NowPlayingCard {
  song: Song;
  type?: "full" | "mini";
}

export default function NowPlayingCard({
  song,
  type = "full",
}: NowPlayingCard) {
  const { state, play, pause } = usePlaybackManager();

  return (
    <div>
      <SongProgress />
      <SongTile
        song={song}
        trailing={
          <button
            onClick={() => {
              if (state === PlayStates.PLAYING) pause();
              if (state === PlayStates.SUSPENDED) play();
            }}
          >
            {state === PlayStates.PLAYING ? "Pause" : "Play"}
          </button>
        }
      />
    </div>
  );
}
