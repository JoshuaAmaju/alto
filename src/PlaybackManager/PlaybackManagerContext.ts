import { ShuffleMode } from "../QueueService/types";
import React from "react";
import { PlayStates, RepeatMode } from "./types";
import { Song } from "../types";

interface Manager {
  play(): void;
  pause(): void;
  state: PlayStates;
  getQueue(): Song[];
  currentTime: number;
  playNextSong(): void;
  toggleShuffle(): void;
  getCurrentSong(): Song;
  repeatMode: RepeatMode;
  cycleRepeatMode(): void;
  shuffleMode: ShuffleMode;
  playPreviousSong(): void;
  seekTo(time: number): void;
  enqueue(...songs: Song[]): void;
  getDuration(): number | undefined;
  playSongAt(position: number): void;
  setSong(song: Song): Promise<void>;
  setRepeatMode(repeat: RepeatMode): void;
  setShuffleMode(shuffle: ShuffleMode): void;
  enqueueAt(position: number, ...songs: Song[]): void;
  openQueue(songs: Song[], shuffleMode?: ShuffleMode): void;
}

const PlaybackManagerContext = React.createContext<Manager>({} as Manager);

export const PlaybackManagerProvider = PlaybackManagerContext.Provider;

export default PlaybackManagerContext;
