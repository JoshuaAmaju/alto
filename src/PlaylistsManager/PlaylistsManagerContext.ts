import React from "react";
import { Playlist, Song } from "../types";

interface Manager {
  playlists: Playlist[];
  create(name: Playlist["name"]): Promise<unknown>;
  delete(name: Playlist["name"]): Promise<unknown>;
  addSong(name: Playlist["name"], songId: Song["id"]): Promise<unknown>;
  removeSong(name: Playlist["name"], songId: Song["id"]): Promise<unknown>;
}

const PlaylistsManagerContext = React.createContext<Manager>({} as Manager);

export const PlaylistsManagerProvider = PlaylistsManagerContext.Provider;

export default PlaylistsManagerContext;
