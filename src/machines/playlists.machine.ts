import { assign, Machine } from "xstate";
import {
  addToPlaylist,
  createPlaylist,
  deletePlaylist,
  getAllPlaylist,
  getPlaylistsAndSongs,
  removeFromPlaylist,
} from "../services/playlist.service";
import { Playlist, Song } from "../types";

interface Context {
  names: string[];
  playlists: Playlist[];
  nameAndSongsMap: Map<string, Song["id"][]>;
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
      names: [],
      playlists: [],
      nameAndSongsMap: new Map(),
    },
    states: {
      idle: {
        on: {
          ADD_SONG: {
            target: "addSong",
            cond: "notAlreadyAdded",
          },
          REMOVE_SONG: "removeSong",
          DELETE_PLAYLIST: "deleting",
          CREATE_PLAYLIST: {
            cond: "notCreated",
            target: "newPlaylist",
          },
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
              return {
                playlists,
                nameAndSongsMap,
                names: (playlists as Playlist[]).map(({ name }) => name),
              };
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
    guards: {
      notCreated: ({ names }, { name }: any) => {
        return !names.includes(name);
      },
      notAlreadyAdded: ({ nameAndSongsMap }, { song, playlist }: any) => {
        const songIds = nameAndSongsMap.get(playlist.name);
        return !songIds?.includes(song.id);
      },
    },
    services: {
      getData: async () => {
        const [playlist, res] = await Promise.all([
          getAllPlaylist(),
          getPlaylistsAndSongs(),
        ]);

        const group = new Map<string, Song["id"][]>();

        for (const { p, songId } of res) {
          const { name } = p as any;
          const songs = group.get(name) ?? [];
          group.set(name, songs.concat(songId as string));
        }

        return [playlist, group];
      },
      createPlaylist: ({ names }, { name }) => {
        return createPlaylist(name);
      },
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
