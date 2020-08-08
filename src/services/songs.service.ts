import { db, q } from "../database";
import { Song } from "./../types";

export async function getAll(): Promise<Song[]> {
  const query = q`MATCH``(song:Song)``[]``()`;
  const res = await db.exec(query, { return: "song" });
  return (res as Record<string, unknown>[]).map(({ song }) => song) as Song[];
}

export function addSongs(songs: Song[]) {
  return db.batch(songs.map((song) => q`CREATE``(song:Song ${song})``[]``()`));
}

export function deleteSong(...songIds: Song["id"][]) {
  return db.batch(
    songIds.map((id) => q`MATCH``(s:Song ${{ id }})``[]``()`),
    { delete: ["s"] }
  );
}
