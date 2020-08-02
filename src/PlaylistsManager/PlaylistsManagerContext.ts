import React from "react";
import { Playlist, Song } from "../types";

export interface ExtraPlaylistDetails {
  song: Song;
  name: string;
  count: number;
}

interface Manager {
  playlists: Playlist[];
  playlistsMap: Record<string, Song[]>;

  create(name: Playlist["name"]): void;
  delete(name: Playlist["name"]): void;
  addSong(playlist: Playlist, song: Song): void;
  removeSong(name: Playlist["name"], songId: Song["id"]): void;
}

const PlaylistsManagerContext = React.createContext<Manager>({} as Manager);

export const PlaylistsManagerProvider = PlaylistsManagerContext.Provider;

export default PlaylistsManagerContext;
