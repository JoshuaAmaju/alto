import React, { ReactNode, useCallback, useEffect, useRef } from "react";
import { Events } from "../MusicService/types";
import useEvent from "../MusicService/use-event";
import useEventValue from "../MusicService/use-event-value";
import useValue from "../MusicService/use-value";
import { Song } from "../types";
import { AudioProvider } from "./AudioManagerContext";
import AudioPlayer from "./AudioPlayer";

export default function AudioManager({ children }: { children: ReactNode }) {
  const audioPlayer = useRef(new AudioPlayer());

  const song = useEventValue<Song>(Events.SET_SONG);

  const state = useValue(
    audioPlayer.current.playState,
    Events.PLAY_STATE_CHANGED,
    () => audioPlayer.current.playState
  );

  const getDuration = useCallback(() => {
    return audioPlayer.current.getDuration();
  }, []);

  useEvent(Events.ACTION_PLAY, () => {
    audioPlayer.current.play();
  });

  useEvent(Events.ACTION_PAUSE, () => {
    audioPlayer.current.pause();
  });

  useEvent<number>(Events.ACTION_SEEK, (value) => {
    audioPlayer.current.seekTo(value);
  });

  useEffect(() => {
    const player = audioPlayer.current;
    player.init();

    return () => player.dispose();
  }, []);

  useEffect(() => {
    if (song) audioPlayer.current.setMediaSource(song.getURL());
  }, [song]);

  return (
    <>
      <AudioProvider
        value={{
          song,
          state,
          getDuration,
          play: () => audioPlayer.current?.play(),
          pause: () => audioPlayer.current?.pause(),
        }}
      >
        {children}
      </AudioProvider>
    </>
  );
}
