import React from "react";
import { Playlist, Song } from "../types";

export interface PlaylistDetails {
  name: string;
  songs: Song[];
  label: string;
  coverUrl: string;
}

interface Manager {
  playlists: Playlist[];
  playlistsMap: Record<string, PlaylistDetails>;

  create(name: Playlist["name"]): void;
  delete(...names: Playlist["name"][]): void;
  addSong(playlist: Playlist, ...songs: Song[]): void;
  removeSong(name: Playlist["name"], ...songIds: Song["id"][]): void;
}

const PlaylistsManagerContext = React.createContext<Manager>({} as Manager);

export const PlaylistsManagerProvider = PlaylistsManagerContext.Provider;

export default PlaylistsManagerContext;
