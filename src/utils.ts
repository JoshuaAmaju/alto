import parser from "id3-parser/lib/universal";
import placeholder from "./assets/svg/placeholder.svg";
import { Song } from "./types";

export const routeConfig = [
  {
    path: "/",
    name: "Songs",
  },
  {
    path: "/playlists",
    name: "Playlists",
  },
];

export function randomRange(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shuffle<T>(array: T[]) {
  const arr = [...array];
  let counter = arr.length;

  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;

    let tmp = arr[counter];
    arr[counter] = arr[index];
    arr[index] = tmp;
  }

  return arr;
}

export function insertAt<T>(array: T[], insertion: T[], position: number) {
  const arr = [...array];
  arr.splice(position, 0, ...insertion);
  return arr;
}

export function createURL(object: any): string {
  return URL.createObjectURL(object);
}

export function bufferToURL(buffer: ArrayBuffer, type?: string) {
  const blob = new Blob([buffer], { type });
  return createURL(blob);
}

export function createSong(song: Song): Song {
  return {
    ...song,
    getURL() {
      return bufferToURL(this.buffer, this.type);
    },
    getImage() {
      const mime = this.image?.mime;
      const data = this.image?.data as Uint8Array;
      return bufferToURL(data, mime);
    },
  };
}

function formatFileName(fileName: string) {
  const typeIndex = fileName.indexOf(".mp3");
  return fileName.substr(0, typeIndex).split("_").join(" ").trim();
}

export async function extractSongsData(files: FileList): Promise<Song[]> {
  let songs: Song[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i] as any;
    const buffer = await file.arrayBuffer();

    let {
      year,
      title,
      album,
      image,
      genre,
      artist = "unknown artist",
    } = await parser(file);

    const { name, type } = file;

    if (!title) title = formatFileName(name);

    const song = {
      type,
      year,
      title,
      album,
      genre,
      image,
      artist,
      buffer,
    } as Song;

    songs.push(song);
  }

  return songs;
}

export function pad(value: any) {
  return value.toString().padStart(2, "0");
}

export function formatTime(value: number) {
  const hour = Math.floor(value / 3600);
  value %= 3600;

  const second = Math.floor(value % 60);
  const minute = Math.floor(value / 60);

  const time = [hour > 0 ? hour : null, minute, second];
  return time
    .filter((t) => t !== null)
    .map(pad)
    .join(":");
}

export function loadImage(url = ""): Promise<string> {
  const img = new Image();

  return new Promise((resolve, reject) => {
    img.onload = () => resolve(img.src);
    img.onerror = (e) => reject(e);
    img.src = url;
  });
}

export function findSongWithImage(songs: Song[] | undefined) {
  if (!songs) return placeholder;
  const song = songs.find(({ image }) => !!image);
  return song?.imageUrl ?? placeholder;
}
