import React from "react";
import { useHistory, useLocation } from "react-router";
import { Song } from "../types";
import PlayPauseButton from "./PlayPauseButton";
import SongProgress from "./Progress";
import SongTile from "./SongTile";

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

  return (
    <div>
      <SongProgress />
      <SongTile
        song={song}
        layoutId={layoutId}
        trailing={<PlayPauseButton />}
        onClick={() => {
          history.push("/nowplaying", { nowPlaying: location });
        }}
      />
    </div>
  );
}
