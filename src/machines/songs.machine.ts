import { assign, Machine } from "xstate";
import { Song } from "../types";

interface Context {
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
          REMOVE_SONG: "removing",
          ADD_SONGS: {
            target: "inserting",
            actions: assign({
              songs: (ctx, { songs }) => [...ctx.songs, ...songs],
            }),
          },
        },
      },
      inserting: {
        invoke: {
          src: "addSongs",
          onDone: "idle",
        },
      },
      loading: {
        invoke: {
          src: "getSongs",
          onDone: {
            target: "idle",
            // actions: assign({ songs: (_ctx, { data }) => data }),
          },
          onError: "error",
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
        const songs = await Promise.resolve();
        return songs;
      },
      addSongs: (ctx) => Promise.resolve(),
      removeSong(ctx, { song }) {
        return Promise.resolve();
      },
    },
  }
);

export default songsMachine;
