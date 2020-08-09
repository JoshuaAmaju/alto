/* eslint-disable react-hooks/exhaustive-deps */
import { useMachine } from "@xstate/react";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Snackbar from "../components/Snackbar";
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

  const [message, setMessage] = useState<string>();

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
    setMessage(`${name} playlist created`);
    send({ type: "CREATE_PLAYLIST", name });
  }, []);

  const deletePlaylist = useCallback((name) => {
    setMessage(`${name} playlist deleted`);
    send({ type: "DELETE_PLAYLIST", name });
  }, []);

  const addSong = useCallback((playlist, _songs) => {
    const songs = [].concat(_songs);
    setMessage(`${songs.length} song(s) added to ${playlist.name} playlist`);
    send({ type: "ADD_SONG", playlist, songs });
  }, []);

  const removeSong = useCallback((name, ids) => {
    const songIds = [].concat(ids);
    setMessage(`${songIds.length} song(s) removed from ${name} playlist`);
    send({ type: "REMOVE_SONG", name, songIds });
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
      <Snackbar
        visible={message ? true : false}
        onDismiss={() => setMessage(undefined)}
      >
        {message}
      </Snackbar>
    </PlaylistsManagerProvider>
  );
}
