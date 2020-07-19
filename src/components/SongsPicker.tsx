import React, { createRef, ChangeEvent } from "react";
import { extractSongsData } from "../utils";
import useSongsManager from "../SongsManager/use-songs-manager";
import Button from "./Button";

export default function SongsPicker() {
  const songsManager = useSongsManager();
  const ref = createRef<HTMLInputElement>();

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const songs = await extractSongsData(files);
    songsManager.addSongs(songs);
  };

  return (
    <div>
      <Button
        onClick={() => {
          ref.current?.click();
        }}
      >
        add songs
      </Button>
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
