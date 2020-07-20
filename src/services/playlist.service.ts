import { q, db, Playlists } from "../database";
import { Song, Playlist } from "../types";
import { createSong } from "../utils";

type PlaylistName = Playlist["name"];

export function getAllPlaylist() {
  return Playlists.getAll();
}

export async function getPlaylistsAndSongs() {
  const query = q`MATCH``(p:Playlist)``[:HAS]``(s:Song)`;
  const res = (await db.exec(query, { return: ["p", "s"] })) as any[];

  const group = new Map<PlaylistName, Song[]>();

  for (const item of res) {
    const { p, s } = item;

    const song = createSong(s);

    const g = group.get(p.name) ?? [];

    group.set(
      p.name,
      g.concat({
        ...song,
        songUrl: song.getURL(),
        imageUrl: song.getImage(),
      })
    );
  }

  return group;
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
  const query = q`MATCH``(playlist:Playlist ${{ name }})``[]``()`;
  return db.exec(query, { delete: ["playlist"] });
}

export function removeFromPlaylist(id: Song["id"]) {
  const query = q`MATCH``(:Playlist)``[has:HAS]``(:Song ${{ id }})`;
  return db.exec(query, { delete: ["has"] });
}
