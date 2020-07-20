import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { Playlists } from "../database";
import {
  addToPlaylist,
  createPlaylist,
  deletePlaylist,
  getAllPlaylist,
  getPlaylistsAndSongs,
  removeFromPlaylist,
} from "../services/playlist.service";
import { Playlist, Song } from "../types";
import { PlaylistsManagerProvider } from "./PlaylistsManagerContext";

export default function PlaylistsManager({
  children,
}: {
  children: ReactNode;
}) {
  const [playlists, setPlaylist] = useState<Playlist[]>([]);
  const [playlistsMap, setMap] = useState<Map<string, Song[]>>();

  const create = useCallback(createPlaylist, []);
  const _delete = useCallback(deletePlaylist, []);

  const addSong = useCallback(addToPlaylist, []);
  const removeSong = useCallback(removeFromPlaylist, []);

  const getSongs = useCallback(
    (name: string) => {
      return playlistsMap?.get(name);
    },
    [playlistsMap]
  );

  const getList = useCallback(async () => {
    const [playlist, playlistMap] = await Promise.all([
      getAllPlaylist(),
      getPlaylistsAndSongs(),
    ]);

    // const details = await Promise.all(
    //   list.map(async ({ name }) => {
    //     const songs = await getSongs(name);

    //     const songWithImage = songs
    //       .map(createSong)
    //       .find(({ image }) => !!image);

    //     return { name, song: songWithImage ?? songs[0], count: songs.length };
    //   })
    // );

    setMap(playlistMap);
    setPlaylist(playlist);

    // setDetails(details);
  }, []);

  useEffect(() => {
    getList();
    const unsubscribe = Playlists.subscribe("WRITE", getList);
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PlaylistsManagerProvider
      value={{
        create,
        addSong,
        getSongs,
        playlists,
        removeSong,
        playlistsMap,
        delete: _delete,
      }}
    >
      {children}
    </PlaylistsManagerProvider>
  );
}
