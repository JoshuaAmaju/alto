import React, {
  createRef,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { service } from "../MusicService/MusicService";
import { Events } from "../MusicService/types";
import useEvent from "../MusicService/use-event";
import useValue from "../MusicService/use-value";
import { AudioProvider } from "./AudioManagerContext";
import { PlayStates } from "./types";

export default function AudioManager({ children }: { children: ReactNode }) {
  const audioCtxRef = useRef(new AudioContext());
  const audioRef = createRef<HTMLAudioElement>();
  const gainRef = useRef(audioCtxRef.current.createGain());

  const [state, setState] = useState(PlayStates.SUSPENDED);

  const song = useValue(service.getCurrentSong(), Events.SONG_CHANGED, () => {
    return service.getCurrentSong();
  });

  const uri = song?.getURL();

  const getDuration = useCallback(() => {
    return audioRef.current?.duration;
  }, [audioRef]);

  useEffect(() => {
    const gain = gainRef.current;
    const audioCtx = audioCtxRef.current;
    const audio = audioRef.current as HTMLAudioElement;
    const source = audioCtx.createMediaElementSource(audio);

    gain.gain.value = 0.1;
    gain.connect(audioCtx.destination);

    source.connect(gain);
  }, [audioRef]);

  useEvent(Events.ACTION_PLAY, () => {
    audioRef.current?.play();
  });

  useEvent(Events.ACTION_PAUSE, () => {
    audioRef.current?.pause();
  });

  useEvent<number>(Events.ACTION_SEEK, (value) => {
    (audioRef.current as HTMLAudioElement).currentTime = value;
  });

  return (
    <>
      <audio
        src={uri}
        ref={audioRef}
        style={{ display: "none" }}
        onEnded={() => {
          setState(PlayStates.SUSPENDED);
          service.sendEvent(Events.SONG_ENDED);
        }}
        onTimeUpdate={() => service.sendEvent(Events.TIME_UPDATE)}
        onPlay={() => {
          setState(PlayStates.PLAYING);
          service.sendEvent(Events.PLAY_STATE_CHANGED);
        }}
        onPause={() => {
          setState(PlayStates.SUSPENDED);
          service.sendEvent(Events.PLAY_STATE_CHANGED);
        }}
      />
      <AudioProvider
        value={{
          song,
          state,
          getDuration,
        }}
      >
        {children}
      </AudioProvider>
    </>
  );
}
