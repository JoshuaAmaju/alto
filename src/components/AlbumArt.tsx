import React, { useState, useEffect } from "react";
import { Song } from "../types";

export default function AlbumArt({ song }: { song: Song }) {
  let { artist, title } = song;
  const description = `${artist} - ${title}`;
  const [image, setImage] = useState<string>();

  useEffect(() => {
    const img = new Image();
    const url = song.getImage();
    img.onload = () => setImage(img.src);
    img.onerror = () => setImage(undefined);
    img.src = url ?? "";
  }, [song]);

  return image ? (
    <img src={image} alt={description} />
  ) : (
    <div>{/* <MusicNote className={style.music_note} /> */}</div>
  );
}
