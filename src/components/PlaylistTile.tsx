import React, { ReactEventHandler } from "react";
import { Song } from "../types";
import SongTile from "./SongTile";
import FlatButton from "./FlatButton";
import { Overflow } from "../icons";

interface PlaylistTile {
  song: Song;
  onClick?: ReactEventHandler;
  onMenuClick?: ReactEventHandler;
}

export default function PlaylistTile({
  song,
  onClick,
  onMenuClick,
}: PlaylistTile) {
  return (
    <SongTile
      song={song}
      key={song.id}
      onClick={onClick}
      trailing={
        <FlatButton onClick={onMenuClick}>
          <Overflow width={25} height={25} />
        </FlatButton>
      }
    />
  );
}
