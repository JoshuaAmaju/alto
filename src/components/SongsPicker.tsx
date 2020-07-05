import React, { createRef } from "react";
import { extractSongData } from "../utils";
import useSongsManager from "../SongsManager/use-songs-manager";

export default function SongsPicker() {
  const songsManager = useSongsManager();
  const ref = createRef<HTMLInputElement>();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files === null) return;
    const songs = await extractSongData(files);
    songsManager.addSongs(songs);
  };

  return (
    <div>
      <input
        multiple
        ref={ref}
        type="file"
        onChange={handleChange}
        style={{ display: "none" }}
      />
    </div>
  );
}
