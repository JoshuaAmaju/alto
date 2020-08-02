import { db, Playlists, q } from "../database";
import { Playlist, Song } from "../types";

type PlaylistName = Playlist["name"];

export function getAllPlaylist() {
  return Playlists.getAll();
}

export async function getPlaylistsAndSongs() {
  const query = q`MATCH``(p:Playlist)``[:HAS]``(s:Song)`;
  const res = await db.exec(query, { return: ["p", "s.id AS songId"] });
  return res as Record<string, unknown>[];
}

export async function getSongs(name: PlaylistName): Promise<Song[]> {
  const query = q`MATCH``(:Playlist ${{ name }})``[:HAS]``(song:Song)`;
  const res = await db.exec(query, { return: "song" });
  return (res as any[]).map((r) => r.song) as Song[];
}

export async function getSongCount(name: PlaylistName) {
  const res = await getSongs(name);
  return res.length;
}

export function addToPlaylist(playlist: Playlist, song: Song) {
  const query = q`RELATE``(:Playlist ${playlist})``[:HAS]``(:Song ${song})`;
  return db.exec(query);
}

export function createPlaylist(name: PlaylistName) {
  const query = q`CREATE``(:Playlist ${{ name }})``[]``()`;
  return db.exec(query);
}

export function deletePlaylist(name: PlaylistName) {
  const query = q`MATCH``(p:Playlist ${{ name }})``[]``()`;
  return db.exec(query, { delete: ["p"] });
}

export function removeFromPlaylist(name: PlaylistName, id: Song["id"]) {
  const query = q`MATCH``(:Playlist ${{ name }})``[h:HAS]``(:Song ${{ id }})`;
  return db.exec(query, { delete: ["h"] });
}
