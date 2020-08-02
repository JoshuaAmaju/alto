import React, { ReactEventHandler } from "react";
import { MoreVertical } from "react-feather";
import FlatButton from "./FlatButton";
import SongTile from "./SongTile";

interface PlaylistTile extends SongTile {
  onMenuClick?: ReactEventHandler;
}

export default function PlaylistTile({
  selected,
  onMenuClick,
  ...props
}: PlaylistTile) {
  return (
    <SongTile
      {...props}
      selected={selected}
      trailing={
        <FlatButton onClick={onMenuClick}>
          <MoreVertical size={25} color={selected ? "white" : "initial"} />
        </FlatButton>
      }
    />
  );
}
