import { Song } from "./../types";
import React from "react";

interface Manager {
  song?: Song;
  getDuration(): number | undefined;
}

const AudioManagerContext = React.createContext<Manager>({} as Manager);

export const AudioProvider = AudioManagerContext.Provider;

export default AudioManagerContext;
