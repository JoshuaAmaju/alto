import { assign, Machine } from "xstate";
import { Song } from "../types";
import { getAll, addSongs, deleteSong } from "../services/songs.service";
import { createSong, loadImage } from "../utils";
import { log } from "xstate/lib/actions";
import placeholder from "../assets/svg/placeholder.svg";

interface Context {
  error?: Error;
  songs: Song[];
}

type Events =
  | { type: "ADD_SONGS"; songs: Song[] }
  | { type: "DELETE_SONG"; songId: Song["id"] };

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
          DELETE_SONG: "deleting",
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
      deleting: {
        invoke: {
          src: "removeSong",
          onDone: "loading",
          onError: {
            target: "error",
            actions: log((_ctx, { data }) => data),
          },
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
        let res = await getAll();

        let songs: Song[] = [];

        for (const s of res) {
          let imageUrl: string;
          const song = createSong(s);
          const rawUrl = song.getImage();

          if (rawUrl) {
            try {
              imageUrl = await loadImage(rawUrl);
            } catch (error) {
              imageUrl = placeholder;
            }
          } else {
            imageUrl = placeholder;
          }

          songs.push({
            ...song,
            imageUrl,
            songUrl: song.getURL(),
          });
        }

        return songs;
      },
      addSongs: (_ctx, { songs }) => addSongs(songs),
      removeSong: (_ctx, { songId }) => deleteSong(songId),
    },
  }
);

export default songsMachine;
