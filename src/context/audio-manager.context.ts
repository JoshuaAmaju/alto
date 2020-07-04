import React from "react";

interface Manager {
  getDuration(): number | undefined;
}

const AudioManagerContext = React.createContext<Manager>({} as Manager);

export const AudioProvider = AudioManagerContext.Provider;

export default AudioManagerContext;
