import React from "react";
import { Playlist, Song } from "../types";

export interface ExtraPlaylistDetails {
  song: Song;
  name: string;
  count: number;
}

interface Manager {
  playlists: Playlist[];
  details: ExtraPlaylistDetails[];
  create(name: Playlist["name"]): Promise<unknown>;
  delete(name: Playlist["name"]): Promise<unknown>;
  addSong(playlist: Playlist, song: Song): Promise<unknown>;
  removeSong(name: Playlist["name"], songId: Song["id"]): Promise<unknown>;
}

const PlaylistsManagerContext = React.createContext<Manager>({} as Manager);

export const PlaylistsManagerProvider = PlaylistsManagerContext.Provider;

export default PlaylistsManagerContext;
