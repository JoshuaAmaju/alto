import { Song } from "./types";
import parser from "id3-parser/lib/universal";
import { PlayStates } from "./PlaybackManager/types";
import { service } from "./QueueService/QueueService";
import { Events } from "./QueueService/types";

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
  const top = arr.slice(0, position);
  const bottom = arr.slice(position);
  arr.splice(0, arr.length, ...([] as T[]).concat(top, insertion, bottom));
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
      artist = "unknown artiste",
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
