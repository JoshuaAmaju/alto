import { Song } from "./../types";
import { q, db, Songs } from "../database";

export function addSong(song: Song) {
  const addQuery = q`CREATE``(song:Song ${song})``[]``()`;
  return db.exec(addQuery);
}

export function addSongs(songs: Song[]) {
  return Promise.all(songs.map(addSong));
}

export function getAll(): Promise<Song[]> {
  return Songs.getAll();
}
