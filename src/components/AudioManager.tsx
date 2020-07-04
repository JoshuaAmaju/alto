import React, {
  createRef,
  ReactChildren,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { AudioProvider } from "../context/audio-manager.context";
import { useEventValue, useServiceCallback } from "../hooks/music-service";
import { service } from "../services/MusicService/MusicService";
import { Events } from "../services/MusicService/types";

export default function AudioManager({
  children,
}: {
  children: ReactChildren;
}) {
  const audioCtxRef = useRef(new AudioContext());
  const audioRef = createRef<HTMLAudioElement>();
  const uri = useEventValue<string>(Events.SET_SONG);
  const gainRef = useRef(audioCtxRef.current.createGain());

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

  useServiceCallback(Events.ACTION_PLAY, () => {
    audioRef.current?.play();
  });

  useServiceCallback(Events.ACTION_PAUSE, () => {
    audioRef.current?.pause();
  });

  return (
    <AudioProvider
      value={{
        getDuration,
      }}
    >
      <audio
        src={uri}
        ref={audioRef}
        style={{ display: "none" }}
        onEnded={() => service.sendEvent(Events.SONG_ENDED)}
        onTimeUpdate={() => service.sendEvent(Events.TIME_UPDATE)}
        onPlay={() => service.sendEvent(Events.PLAY_STATE_CHANGED)}
        onPause={() => service.sendEvent(Events.PLAY_STATE_CHANGED)}
      />
      {children}
    </AudioProvider>
  );
}
