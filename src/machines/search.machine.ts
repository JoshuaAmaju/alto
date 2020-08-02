import { assign, Machine } from "xstate";
import { Song } from "../types";
import { PlaylistDetails } from "../PlaylistsManager/PlaylistsManagerContext";

interface Context {
  songs: Song[];
  foundSongs?: Song[];
  foundPlaylists?: PlaylistDetails[];
  playlists: Record<string, PlaylistDetails>;
}

type Events =
  | { type: "SEARCH"; query: string }
  | {
      type: "SET_CONTEXT";
      songs: Song[];
      playlists: Record<string, PlaylistDetails>;
    };

const searchMachine = Machine<Context, Events>(
  {
    initial: "idle",
    on: {
      SET_CONTEXT: {
        actions: assign((_ctx, { songs, playlists }) => ({ songs, playlists })),
      },
    },
    states: {
      idle: {
        on: {
          SEARCH: {
            target: "searching",
            cond: "isNotEmpty",
          },
        },
      },
      searching: {
        invoke: {
          src: "search",
          onError: "no_result",
          onDone: {
            target: "idle",
            actions: assign(
              (_ctx, { data: { foundSongs, foundPlaylists } }) => ({
                foundSongs,
                foundPlaylists,
              })
            ),
          },
        },
      },
      no_result: {
        on: {
          SEARCH: {
            target: "searching",
            cond: "isNotEmpty",
          },
        },
      },
    },
  },
  {
    guards: {
      isNotEmpty: (_ctx, { query }: any) => query.trim() !== "",
    },
    services: {
      search({ songs, playlists }, { query }) {
        return new Promise((resolve, reject) => {
          if (query.trim() === "") reject();

          const regex = new RegExp(query, "gi");

          const foundPlaylists: Map<string, PlaylistDetails> = new Map();

          const foundSongs = songs.filter(({ title, artist, album }) => {
            return regex.test(title as any);
          });

          if (foundSongs.length <= 0) reject();

          const songIds = foundSongs.map(({ id }) => id);

          for (const key in playlists) {
            const playlist = playlists[key];
            const { name, songs } = playlist;

            songs.forEach(({ id }) => {
              if (songIds.includes(id)) {
                foundPlaylists.set(name, playlist);
              }
            });
          }

          resolve({
            foundSongs,
            foundPlaylists: Array.from(foundPlaylists.values()),
          });
        });
      },
    },
  }
);

export default searchMachine;
