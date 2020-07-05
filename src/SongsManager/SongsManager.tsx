/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, ReactNode } from "react";
import { useMachine } from "@xstate/react";
import { SongsProvider } from "./SongsManagerContext";
import songsMachine from "../machines/songs.machine";

export default function SongsManager({ children }: { children: ReactNode }) {
  const [state, send] = useMachine(songsMachine);
  const { songs } = state.context;

  const addSongs = useCallback((songs) => {
    send({ type: "ADD_SONGS", songs });
  }, []);

  const deleteSong = useCallback((song) => {
    send({ type: "REMOVE_SONG", song });
  }, []);

  return (
    <SongsProvider
      value={{
        songs,
        addSongs,
        deleteSong,
        loading: state.matches("loading"),
      }}
    >
      {children}
    </SongsProvider>
  );
}
