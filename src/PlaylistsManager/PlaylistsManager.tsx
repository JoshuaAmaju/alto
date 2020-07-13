import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { Playlists } from "../database";
import {
  addToPlaylist,
  createPlaylist,
  deletePlaylist,
  getAllPlaylist,
  removeFromPlaylist,
} from "../services/playlist.service";
import { Playlist } from "../types";
import { PlaylistsManagerProvider } from "./PlaylistsManagerContext";

export default function PlaylistsManager({
  children,
}: {
  children: ReactNode;
}) {
  const [playlists, setList] = useState<Playlist[]>([]);

  const create = useCallback(createPlaylist, []);
  const _delete = useCallback(deletePlaylist, []);

  const addSong = useCallback(addToPlaylist, []);
  const removeSong = useCallback(removeFromPlaylist, []);

  const getList = useCallback(async () => {
    const list = await getAllPlaylist();
    setList(list);
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
        playlists,
        removeSong,
        delete: _delete,
      }}
    >
      {children}
    </PlaylistsManagerProvider>
  );
}
