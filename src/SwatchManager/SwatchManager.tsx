import React, { ReactNode, createContext } from "react";
import usePlaybackManager from "../PlaybackManager/use-playback-manager";
import { Song } from "../types";
import { usePalette } from "react-palette";

const Context = createContext({});

export default function SwatchManager({ children }: { children: ReactNode }) {
  const { currentSong } = usePlaybackManager();

  const { imageUrl } = currentSong ?? ({} as Song);

  const palette = usePalette(imageUrl);

  console.log(palette);

  return <Context.Provider value={{}}>{children}</Context.Provider>;
}
