/* eslint-disable react-hooks/exhaustive-deps */
import { useMachine } from "@xstate/react";
import React, { ReactNode, useCallback, useEffect, useMemo } from "react";
import { Playlists } from "../database";
import playlistsMachine from "../machines/playlists.machine";
import { PlaylistsManagerProvider } from "./PlaylistsManagerContext";
import useSongsManager from "../SongsManager/use-songs-manager";
import { Song } from "../types";

export default function PlaylistsManager({
  children,
}: {
  children: ReactNode;
}) {
  const { songs } = useSongsManager();
  const [state, send] = useMachine(playlistsMachine);

  const { playlists, nameAndSongsMap } = state.context;

  const playlistsMap = useMemo(() => {
    const map = new Map<string, Song[]>();

    nameAndSongsMap.forEach((ids, key) => {
      const _songs = songs.filter(({ id }) => ids.includes(id));
      map.set(key, _songs);
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

  const getSongs = useCallback(
    (name: string) => {
      return playlistsMap?.get(name);
    },
    [playlistsMap]
  );

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
        create: createPlaylist,
        addSong,
        getSongs,
        playlists,
        removeSong,
        playlistsMap,
        delete: deletePlaylist,
      }}
    >
      {children}
    </PlaylistsManagerProvider>
  );
}
