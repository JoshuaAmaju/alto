import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { Playlists } from "../database";
import {
  getSongs,
  addToPlaylist,
  createPlaylist,
  deletePlaylist,
  getAllPlaylist,
  removeFromPlaylist,
  getPlaylistsAndSongs,
} from "../services/playlist.service";
import { Playlist } from "../types";
import {
  ExtraPlaylistDetails,
  PlaylistsManagerProvider,
} from "./PlaylistsManagerContext";
import { createSong } from "../utils";

export default function PlaylistsManager({
  children,
}: {
  children: ReactNode;
}) {
  const [playlists, setList] = useState<Playlist[]>([]);
  const [details, setDetails] = useState<ExtraPlaylistDetails[]>([]);

  const create = useCallback(createPlaylist, []);
  const _delete = useCallback(deletePlaylist, []);

  const addSong = useCallback(addToPlaylist, []);
  const removeSong = useCallback(removeFromPlaylist, []);

  const getList = useCallback(async () => {
    const list = await getAllPlaylist();
    const res = await getPlaylistsAndSongs();

    console.log(res);

    const details = await Promise.all(
      list.map(async ({ name }) => {
        const songs = await getSongs(name);

        const songWithImage = songs
          .map(createSong)
          .find(({ image }) => !!image);

        return { name, song: songWithImage ?? songs[0], count: songs.length };
      })
    );

    setList(list);
    setDetails(details);
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
        details,
        playlists,
        removeSong,
        delete: _delete,
      }}
    >
      {children}
    </PlaylistsManagerProvider>
  );
}
