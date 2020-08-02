import React from "react";
import { Song } from "../types";

interface Manager {
  songs: Song[];
  loading: boolean;
  addSongs(song: Song[]): void;
  deleteSong(songId: Song["id"]): void;
}

const SongsManagerContext = React.createContext<Manager>({} as Manager);

export const SongsProvider = SongsManagerContext.Provider;

export default SongsManagerContext;
