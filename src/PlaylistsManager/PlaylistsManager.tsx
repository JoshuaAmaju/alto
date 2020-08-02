/* eslint-disable react-hooks/exhaustive-deps */
import { useMachine } from "@xstate/react";
import React, { ReactNode, useCallback, useEffect, useMemo } from "react";
import { Playlists } from "../database";
import playlistsMachine from "../machines/playlists.machine";
import useSongsManager from "../SongsManager/use-songs-manager";
import { findSongWithImage } from "../utils";
import {
  PlaylistDetails,
  PlaylistsManagerProvider,
} from "./PlaylistsManagerContext";

export default function PlaylistsManager({
  children,
}: {
  children: ReactNode;
}) {
  const { songs } = useSongsManager();
  const [state, send] = useMachine(playlistsMachine);

  const { playlists, nameAndSongsMap } = state.context;

  const playlistsMap = useMemo(() => {
    const map = {} as Record<string, PlaylistDetails>;

    nameAndSongsMap.forEach((ids, key) => {
      const _songs = songs.filter(({ id }) => ids.includes(id));

      const count = _songs?.length ?? 0;
      const coverUrl = findSongWithImage(_songs);
      const label = `${count} song${count > 1 || count === 0 ? "s" : ""}`;

      map[key] = {
        label,
        coverUrl,
        name: key,
        songs: _songs,
      };
    });

    return map;
  }, [songs]);

  const createPlaylist = useCallback((name) => {
    send({ type: "CREATE_PLAYLIST", name });
  }, []);

  const deletePlaylist = useCallback((name) => {
    send({ type: "DELETE_PLAYLIST", name });
  }, []);

  const addSong = useCallback((playlist, song) => {
    send({ type: "ADD_SONG", playlist, song });
  }, []);

  const removeSong = useCallback((name, songId) => {
    send({ type: "REMOVE_SONG", name, songId });
  }, []);

  useEffect(() => {
    const unsubscribe = Playlists.subscribe("WRITE", () => {
      send("LOAD");
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PlaylistsManagerProvider
      value={{
        addSong,
        playlists,
        removeSong,
        playlistsMap,
        create: createPlaylist,
        delete: deletePlaylist,
      }}
    >
      {children}
    </PlaylistsManagerProvider>
  );
}
