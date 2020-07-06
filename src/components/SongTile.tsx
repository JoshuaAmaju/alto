import React from "react";
import { Song } from "../types";
import AlbumArt from "./AlbumArt";

interface SongTile {
  song: Song;
  onClick?: React.ReactEventHandler;
}

export default function SongTile({ song, onClick }: SongTile) {
  const { title, artist } = song;

  return (
    <div onClick={onClick}>
      <AlbumArt song={song} />
      <div>
        <h2>{title}</h2>
        <h3>{artist}</h3>
      </div>
    </div>
  );
}
