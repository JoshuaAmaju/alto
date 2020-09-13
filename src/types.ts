import { IID3Tag } from "id3-parser/lib/interface";

export type Song = Partial<IID3Tag> & {
  id: string;
  file: File;
  type: string;
  songUrl: string;
  imageUrl: string;
  getURL(): string;
  getImage(): string;
};

export type Playlist = { name: string };
