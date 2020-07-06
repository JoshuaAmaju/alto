import { Song } from "./../types";
import React from "react";
import { PlayStates } from "./types";

interface Manager {
  song?: Song;
  play(): void;
  pause(): void;
  state: PlayStates;
  getDuration(): number | undefined;
}

const AudioManagerContext = React.createContext<Manager>({} as Manager);

export const AudioProvider = AudioManagerContext.Provider;

export default AudioManagerContext;
