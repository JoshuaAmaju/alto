import React from "react";
import { Play, Pause } from "react-feather";
import { PlayStates } from "../PlaybackManager/types";
import usePlaybackManager from "../PlaybackManager/use-playback-manager";
import { Song } from "../types";
import SongProgress from "./Progress";
import SongTile from "./SongTile";
import FlatButton from "./FlatButton";
import { useHistory, useLocation } from "react-router";

interface NowPlayingCard {
  song: Song;
  layoutId?: string;
  type?: "full" | "mini";
}

export default function NowPlayingCard({
  song,
  layoutId,
  type = "full",
}: NowPlayingCard) {
  const history = useHistory();
  const location = useLocation();
  const { state, play, pause } = usePlaybackManager();

  return (
    <div>
      <SongProgress />
      <SongTile
        song={song}
        layoutId={layoutId}
        onClick={() => {
          history.push("/nowplaying", { nowPlaying: location });
        }}
        trailing={
          <FlatButton
            onClick={() => {
              if (state === PlayStates.PLAYING) pause();
              if (state === PlayStates.SUSPENDED) play();
            }}
          >
            {state === PlayStates.PLAYING ? (
              <Pause size={25} />
            ) : (
              <Play size={25} />
            )}
          </FlatButton>
        }
      />
    </div>
  );
}
