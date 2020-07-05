import { IID3Tag } from "id3-parser/lib/interface";

export type Song = Partial<IID3Tag> & {
  id: string;
  type: string;
  getURL(): string;
  getImage(): string;
  buffer: ArrayBuffer;
};
