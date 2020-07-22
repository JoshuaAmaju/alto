/* eslint-disable react-hooks/exhaustive-deps */
import { useMachine } from "@xstate/react";
import React, { ReactNode, useCallback } from "react";
import songsMachine from "../machines/songs.machine";
import { SongsProvider } from "./SongsManagerContext";

export default function SongsManager({ children }: { children: ReactNode }) {
  const [state, send] = useMachine(songsMachine);
  const { songs, error } = state.context;

  const addSongs = useCallback((songs) => {
    send({ type: "ADD_SONGS", songs });
  }, []);

  const deleteSong = useCallback((song) => {
    send({ type: "REMOVE_SONG", song });
  }, []);

  console.log(state.value, error);

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
