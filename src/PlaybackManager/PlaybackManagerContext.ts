import { ShuffleMode } from "../QueueService/types";
import React from "react";
import { PlayStates, RepeatMode } from "./types";
import { Song } from "../types";

interface Manager {
  play(): void;
  pause(): void;
  duration: number;
  state: PlayStates;
  getQueue(): Song[];
  currentTime: number;
  toggleShuffle(): void;
  cycleRepeatMode(): void;
  seekTo(time: number): void;
  playSong(song: Song): void;
  currentSong: Song | undefined;
  enqueue(...songs: Song[]): void;
  playNextSong(force: boolean): void;
  playSongAt(position: number): void;
  enqueueNext(...songs: Song[]): void;
  setSong(song: Song): Promise<void>;
  playPreviousSong(force: boolean): void;
  setRepeatMode(repeat: RepeatMode): void;
  setShuffleMode(shuffle: ShuffleMode): void;
  enqueueAt(position: number, ...songs: Song[]): void;
  openQueue(songs: Song[], shuffleMode?: ShuffleMode): void;
}

const PlaybackManagerContext = React.createContext<Manager>({} as Manager);

export const PlaybackManagerProvider = PlaybackManagerContext.Provider;

export default PlaybackManagerContext;
