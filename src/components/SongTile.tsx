import React from "react";
import { Song } from "../types";

interface SongTile {
  song: Song;
}

export default function SongTile({ song }: SongTile) {
  const { title, artist, getImage } = song;
  const description = `${artist} - ${title}`;

  return (
    <div>
      <img src={getImage()} alt={description} />
      <div>
        <h2>{title}</h2>
        <h3>{artist}</h3>
      </div>
    </div>
  );
}
