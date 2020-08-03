import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import AudioPlayer from "../AudioPlayer";
import { service } from "../QueueService/QueueService";
import { Song } from "../types";
import { PlaybackManagerProvider } from "./PlaybackManagerContext";
import { RepeatMode, ShuffleMode } from "./types";
import { useAudioState } from "./use-audio-state";
import { useTimeUpdate } from "./use-time-update";
import useSongsManager from "../SongsManager/use-songs-manager";

const { Helmet } = require("react-helmet");

export default function PlaybackManager({ children }: { children: ReactNode }) {
  const { songs } = useSongsManager();
  const player = useRef(new AudioPlayer());
  const state = useAudioState(player.current);
  const currentTime = useTimeUpdate(player.current);
  const [currentSong, setCurrentSong] = useState<Song>();

  const { title, album } = (currentSong ?? {}) as Song;

  const play = useCallback(() => {
    player.current.play();
  }, []);

  const pause = useCallback(() => {
    player.current.pause();
  }, []);

  const getQueue = useCallback(() => service.queue, []);

  const getRepeatMode = useCallback(() => service.repeatMode, []);

  const getShuffleMode = useCallback(() => service.shuffleMode, []);

  const seekTo = useCallback((time: number) => {
    player.current.seekTo(time);
  }, []);

  const setSong = useCallback((song: Song) => {
    return player.current.setMediaSource(song.songUrl);
  }, []);

  const setRepeatMode = useCallback((mode: RepeatMode) => {
    service.setRepeatMode(mode);
  }, []);

  const setShuffleMode = useCallback((mode: ShuffleMode) => {
    service.setShuffleMode(mode);
  }, []);

  const getDuration = () => {
    const duration = player.current.getDuration();
    return isNaN(duration) ? 0 : duration;
  };

  const openQueue = useCallback(
    (songs: Song[], shuffleMode?: ShuffleMode) => {
      service.openQueue(songs);
      if (shuffleMode) setShuffleMode(shuffleMode);
    },
    [setShuffleMode]
  );

  const enqueue = useCallback((...songs: Song[]) => {
    service.enqueue(songs);
  }, []);

  const enqueueAt = useCallback((position: number, ...songs: Song[]) => {
    if (!position) return;
    service.enqueueAt(position, songs);
  }, []);

  const enqueueNext = useCallback((...songs: Song[]) => {
    enqueueAt((service.position as any) + 1, ...songs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffleMode(
      getShuffleMode() === ShuffleMode.NONE
        ? ShuffleMode.SHUFFLE
        : ShuffleMode.NONE
    );
  }, [getShuffleMode, setShuffleMode]);

  const cycleRepeatMode = useCallback(() => {
    const get = () => {
      switch (getRepeatMode()) {
        case RepeatMode.ALL:
          return RepeatMode.CURRENT;
        case RepeatMode.CURRENT:
          return RepeatMode.NONE;
        case RepeatMode.NONE:
          return RepeatMode.ALL;
      }
    };

    setRepeatMode(get());
  }, [getRepeatMode, setRepeatMode]);

  const playSongAt = useCallback(
    async (pos: number | undefined | null) => {
      const song = getQueue()[pos as number];

      if (!song) return;

      service.position = pos;

      await setSong(song);
      play();

      setCurrentSong(song);
    },
    [getQueue, play, setSong]
  );

  const playSong = useCallback(
    async (song: Song) => {
      const position = getQueue().findIndex((s) => {
        return s.id === song.id;
      });

      playSongAt(position);
    },
    [getQueue, playSongAt]
  );

  const playNextSong = useCallback(
    (force = false) => {
      const newPos = service.getNextPosition(force);
      playSongAt(newPos);
    },
    [playSongAt]
  );

  const playPreviousSong = useCallback(
    (force = false) => {
      const newPos = service.getPreviousPosition(force);
      playSongAt(newPos);
    },
    [playSongAt]
  );

  useEffect(() => {
    const _player = player.current;
    _player.init();

    const onEnded = () => playNextSong();
    _player.addListener("ended", onEnded);

    return () => {
      _player.removeListener("ended", onEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      const { queue, position, shuffleMode, repeatMode } = service;

      localStorage.setItem("currentTime", currentTime.toString());
      localStorage.setItem("currentSong", (currentSong as Song).id);

      localStorage.setItem("shuffle", shuffleMode);
      localStorage.setItem("repeat", repeatMode.toString());
      localStorage.setItem("position", (position as any).toString());
      localStorage.setItem("queue", JSON.stringify(queue.map(({ id }) => id)));
    });
  }, [currentSong, currentTime]);

  useEffect(() => {
    const repeat = localStorage.getItem("repeat");
    const shuffle = localStorage.getItem("shuffle");
    const position = localStorage.getItem("position");

    if (position) service.position = parseFloat(position);
    if (repeat) service.setRepeatMode(parseFloat(repeat));
    if (shuffle) service.setShuffleMode(shuffle as ShuffleMode);
  }, []);

  useEffect(() => {
    const currSong = localStorage.getItem("currentSong");

    if (currSong) {
      const song = songs?.find(({ id }) => id === currSong);

      if (song) {
        setSong(song);
        setCurrentSong(song);
      }
    }
  }, [songs, openQueue, setSong]);

  useEffect(() => {
    const json = localStorage.getItem("queue");
    const currTime = localStorage.getItem("currentTime");
    const currSong = localStorage.getItem("currentSong");

    if (currSong) {
      const song = songs?.find(({ id }) => id === currSong);

      if (song) {
        setSong(song);
        setCurrentSong(song);
      }
    }

    if (json) {
      const _songs = JSON.parse(json) as string[];
      const queue = songs?.filter(({ id }) => _songs.includes(id));
      openQueue(queue);
    }

    if (currTime) seekTo(parseFloat(currTime));
  }, [songs, openQueue, seekTo, setSong]);

  const helmetTitle = [title, album].filter((title) => !!title);

  return (
    <PlaybackManagerProvider
      value={{
        play,
        pause,
        state,
        seekTo,
        enqueue,
        setSong,
        getQueue,
        playSong,
        enqueueAt,
        openQueue,
        playSongAt,
        currentSong,
        getDuration,
        enqueueNext,
        currentTime,
        playNextSong,
        setRepeatMode,
        toggleShuffle,
        setShuffleMode,
        cycleRepeatMode,
        playPreviousSong,
      }}
    >
      <Helmet>
        <title>{helmetTitle.join(" - ")}</title>
      </Helmet>
      {children}
    </PlaybackManagerProvider>
  );
}
