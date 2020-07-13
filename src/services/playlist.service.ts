import { q, db, Playlists } from "../database";
import { Song, Playlist } from "../types";

type PlaylistName = Playlist["name"];

export function getAllPlaylist() {
  return Playlists.getAll();
}

export async function getSongs(name: PlaylistName): Promise<Song[]> {
  const query = q`MATCH``(:Playlist ${{ name }})``[:HAS]``(song:Song)`;
  const res = await db.exec(query, { return: "song" });
  return res as Song[];
}

export async function getSongCount(name: PlaylistName) {
  const res = await getSongs(name);
  return res.length;
}

export function addToPlaylist(id: Song["id"]) {
  const query = q`RELATE``(:Playlist)``[:HAS]``(:Song ${{ id }})`;
  return db.exec(query);
}

export function createPlaylist(name: PlaylistName) {
  const query = q`CREATE``(:Playlist ${{ name }})``[]``()`;
  return db.exec(query);
}

export function deletePlaylist(name: PlaylistName) {
  const query = q`MATCH``(playlist:Playlist ${{ name }})``[]``()`;
  return db.exec(query, { delete: ["playlist"] });
}

export function removeFromPlaylist(id: Song["id"]) {
  const query = q`MATCH``(:Playlist)``[has:HAS]``(:Song ${{ id }})`;
  return db.exec(query, { delete: ["has"] });
}
