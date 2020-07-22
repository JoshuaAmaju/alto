import { assign, Machine } from "xstate";
import { Song } from "../types";
import { getAll, addSongs } from "../services/songs.service";
import { createSong } from "../utils";

interface Context {
  error?: Error;
  songs: Song[];
}

type Events =
  | { type: "ADD_SONGS"; songs: Song[] }
  | { type: "REMOVE_SONG"; song: Song };

const songsMachine = Machine<Context, Events>(
  {
    initial: "loading",
    context: {
      songs: [],
    },
    states: {
      idle: {
        on: {
          ADD_SONGS: "inserting",
          REMOVE_SONG: "removing",
        },
      },
      inserting: {
        invoke: {
          src: "addSongs",
          onError: "error",
          onDone: "loading",
        },
      },
      loading: {
        invoke: {
          src: "getSongs",
          onDone: {
            target: "idle",
            actions: assign({ songs: (_ctx, { data }) => data }),
          },
          onError: {
            target: "error",
            actions: assign({ error: (_ctx, { data }) => data }),
          },
        },
      },
      removing: {
        invoke: {
          src: "removeSong",
          onDone: "loading",
          onError: "error",
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
      getSongs: async () => {
        const songs = await getAll();
        return songs.map((s) => {
          const song = createSong(s);

          return {
            ...song,
            songUrl: song.getURL(),
            imageUrl: song.getImage(),
          };
        });
      },
      addSongs: (_ctx, { songs }) => addSongs(songs),
      removeSong(ctx, { song }) {
        return Promise.resolve();
      },
    },
  }
);

export default songsMachine;
