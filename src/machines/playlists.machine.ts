import { assign, Machine } from "xstate";
import {
  createPlaylist,
  deletePlaylist,
  getAllPlaylist,
  getPlaylistsAndSongs,
  removeFromPlaylist,
  addToPlaylist,
} from "../services/playlist.service";
import { Song } from "../types";
import { createSong } from "../utils";
import { Playlist } from "./../types";

interface Context {
  playlists: Playlist[];
  nameAndSongsMap: Map<string, Song[]>;
}

type Events =
  | { type: "LOAD" }
  | { type: "CREATE_PLAYLIST"; name: string }
  | { type: "DELETE_PLAYLIST"; name: string }
  | { type: "ADD_SONG"; playlist: Playlist; song: Song }
  | { type: "REMOVE_SONG"; name: string; songId: string };

const playlistsMachine = Machine<Context, Events>(
  {
    initial: "loading",
    context: {
      playlists: [],
      nameAndSongsMap: new Map(),
    },
    states: {
      idle: {
        on: {
          ADD_SONG: "addSong",
          REMOVE_SONG: "removeSong",
          DELETE_PLAYLIST: "deleting",
          CREATE_PLAYLIST: "newPlaylist",
        },
      },
      newPlaylist: {
        invoke: {
          onError: "error",
          onDone: "loading",
          src: "createPlaylist",
        },
      },
      addSong: {
        invoke: {
          onError: "error",
          onDone: "loading",
          src: "addToPlaylist",
        },
      },
      loading: {
        invoke: {
          src: "getData",
          onError: "error",
          onDone: {
            target: "idle",
            actions: assign((_ctx, { data }) => {
              const [playlists, nameAndSongsMap] = data;
              return { playlists, nameAndSongsMap };
            }),
          },
        },
      },
      deleting: {
        invoke: {
          onError: "error",
          onDone: "loading",
          src: "deletePlaylist",
        },
      },
      removeSong: {
        invoke: {
          onError: "error",
          onDone: "loading",
          src: "removeFromPlaylist",
        },
      },
      error: {
        after: {
          2000: "idle",
        },
      },
    },
  },
  {
    services: {
      getData: async () => {
        const [playlist, res] = await Promise.all([
          getAllPlaylist(),
          getPlaylistsAndSongs(),
        ]);

        const group = new Map<string, Song[]>();

        for (const item of res) {
          const { p, s } = item;
          const { name } = p as any;

          const _song = createSong(s as Song);
          const songs = group.get(name) ?? [];

          const song = {
            ..._song,
            songUrl: _song.getURL(),
            imageUrl: _song.getImage(),
          };

          group.set(name, songs.concat(song));
        }

        return [playlist, group];
      },
      createPlaylist: (_ctx, { name }) => createPlaylist(name),
      deletePlaylist: (_ctx, { name }) => deletePlaylist(name),
      addToPlaylist: (_ctx, { song, playlist }) => {
        return addToPlaylist(playlist, song);
      },
      removeFromPlaylist: (_ctx, { name, songId }) => {
        return removeFromPlaylist(name, songId);
      },
    },
  }
);

export default playlistsMachine;
