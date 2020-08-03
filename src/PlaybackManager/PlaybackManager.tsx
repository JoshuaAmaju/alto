import React, { ReactNode, useCallback, useEffect, useState } from "react";
import useAudioPlayer from "../AudioPlayer/use-audio-player";
import { service } from "../QueueService/QueueService";
import useSongsManager from "../SongsManager/use-songs-manager";
import { Song } from "../types";
import { PlaybackManagerProvider } from "./PlaybackManagerContext";
import { RepeatMode, ShuffleMode } from "./types";

const { Helmet } = require("react-helmet");

export default function PlaybackManager({ children }: { children: ReactNode }) {
  const { songs } = useSongsManager();
  const [currentSong, setCurrentSong] = useState<Song>();

  const { title, album } = (currentSong ?? {}) as Song;

  const {
    play,
    pause,
    seekTo,
    onEvent,
    duration,
    currentTime,
    setMediaSource,
    audioState: state,
  } = useAudioPlayer();

  const getQueue = useCallback(() => service.queue, []);

  const getRepeatMode = useCallback(() => service.repeatMode, []);

  const getShuffleMode = useCallback(() => service.shuffleMode, []);

  const setSong = useCallback(
    (song: Song) => {
      return setMediaSource(song.songUrl);
    },
    [setMediaSource]
  );

  const setRepeatMode = useCallback((mode: RepeatMode) => {
    service.setRepeatMode(mode);
  }, []);

  const setShuffleMode = useCallback((mode: ShuffleMode) => {
    service.setShuffleMode(mode);
  }, []);

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
    window.addEventListener("beforeunload", () => {
      const { queue, position, shuffleMode, repeatMode } = service;

      const state = {
        position,
        repeatMode,
        currentTime,
        shuffleMode,
        queue: queue.map(({ id }) => id),
        currentSong: (currentSong as Song).id,
      };

      localStorage.setItem("state", JSON.stringify(state));
    });
  }, [currentSong, currentTime]);

  useEffect(() => {
    const state = localStorage.getItem("state");

    if (state) {
      const {
        queue,
        position,
        repeatMode,
        currentTime,
        currentSong,
        shuffleMode,
      } = JSON.parse(state);

      if (position) service.position = parseFloat(position);
      if (repeatMode) service.setRepeatMode(parseFloat(repeatMode));
      if (shuffleMode) service.setShuffleMode(shuffleMode as ShuffleMode);

      const song = songs?.find(({ id }) => id === currentSong);

      if (song) {
        setSong(song);
        setCurrentSong(song);
      }

      if (queue) {
        const _songs = queue as string[];
        const _queue = songs?.filter(({ id }) => _songs.includes(id));
        openQueue(_queue);
      }

      if (currentTime) seekTo(parseFloat(currentTime));
    }
  }, [openQueue, seekTo, setSong, songs]);

  onEvent("ended", () => playNextSong());

  const pageTitle = [title, album].filter((title) => !!title);

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
        duration,
        playSong,
        enqueueAt,
        openQueue,
        playSongAt,
        currentSong,
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
        <title>{pageTitle.join(" - ")}</title>
      </Helmet>
      {children}
    </PlaybackManagerProvider>
  );
}
