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
        let songs = await getAll();

        songs = songs.map((s) => {
          const song = createSong(s);
          return {
            ...song,
            songUrl: song.getURL(),
            imageUrl: song.getImage(),
          };
        });

        for (const song of songs) {
          let { imageUrl } = song;

          if (imageUrl) {
            try {
              imageUrl = await loadImage(imageUrl);
            } catch (error) {
              imageUrl = placeholder;
            }
          } else {
            imageUrl = placeholder;
          }

          song.imageUrl = imageUrl;
        }

        return songs;
      },
      addSongs: (_ctx, { songs }) => addSongs(songs),
      removeSong: (_ctx, { songId }) => deleteSong(songId),
    },
  }
);

export default songsMachine;
