import { Song, Playlist } from "./types";
import { WeBase, q } from "webase";

const { v4: uuidv4 } = require("uuid");

const db = new WeBase("alto", 1);

const Playlists = db.model<Playlist>("Playlist", {
  name: {
    type: "string",
    indexed: true,
    unique: true,
  },
});

const Songs = db.model<Song>("Song", {
  id: {
    indexed: true,
    type: "string",
    default: () => uuidv4(),
  },
  title: {
    type: "string",
    indexed: true,
  },
  artist: {
    type: "string",
    indexed: true,
  },
  album: {
    type: "string",
    indexed: true,
  },
});

db.onUpgrade(async ({ schema }) => {
  await schema.install();
});

export { q, db, Songs, Playlists };
