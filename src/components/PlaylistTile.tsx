import React, { ReactEventHandler } from "react";
import { MoreVertical } from "react-feather";
import FlatButton from "./FlatButton";
import SongTile from "./SongTile";

interface PlaylistTile extends SongTile {
  onMenuClick?: ReactEventHandler;
}

export default function PlaylistTile({ onMenuClick, ...props }: PlaylistTile) {
  return (
    <SongTile
      {...props}
      trailing={
        <FlatButton onClick={onMenuClick}>
          <MoreVertical size={25} />
        </FlatButton>
      }
    />
  );
}
