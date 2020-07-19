import React, { ReactEventHandler } from "react";
import { Song } from "../types";
import SongTile from "./SongTile";
import FlatButton from "./FlatButton";
import { MoreVertical } from "react-feather";

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
          <MoreVertical size={25} />
        </FlatButton>
      }
    />
  );
}
