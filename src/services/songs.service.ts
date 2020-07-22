import { db, q } from "../database";
import { Song } from "./../types";

export async function getAll(): Promise<Song[]> {
  const query = q`MATCH``(song:Song)``[]``()`;
  const res = await db.exec(query, { return: "song" });
  return (res as Record<string, unknown>[]).map(({ song }) => song) as Song[];
}

export function addSong(song: Song) {
  const addQuery = q`CREATE``(song:Song ${song})``[]``()`;
  return db.exec(addQuery);
}

export function addSongs(songs: Song[]) {
  return Promise.all(songs.map(addSong));
}
