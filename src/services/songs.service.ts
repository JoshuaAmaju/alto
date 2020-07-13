import { Song } from "./../types";
import { q, db, Songs } from "../database";

export function getAll() {
  return Songs.getAll();
}

export function addSong(song: Song) {
  const addQuery = q`CREATE``(song:Song ${song})``[]``()`;
  return db.exec(addQuery);
}

export function addSongs(songs: Song[]) {
  return Promise.all(songs.map(addSong));
}
