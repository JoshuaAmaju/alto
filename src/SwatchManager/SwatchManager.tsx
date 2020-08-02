import React, { useContext, createContext, ReactNode } from "react";
import { PaletteColors, usePalette } from "react-palette";
import usePlaybackManager from "../PlaybackManager/use-playback-manager";
import { Song } from "../types";

const Context = createContext<PaletteColors>({});

export function useSwatch() {
  return useContext(Context);
}

function SwatchManager({ children }: { children: ReactNode }) {
  const { currentSong } = usePlaybackManager();

  const { imageUrl } = currentSong ?? ({} as Song);

  const { data } = usePalette(imageUrl);

  return <Context.Provider value={data}>{children}</Context.Provider>;
}

export default SwatchManager;
