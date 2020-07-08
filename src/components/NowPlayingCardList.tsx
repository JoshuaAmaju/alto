import React from "react";
import { Frame, Page } from "framer";
import useValue from "../QueueService/use-value";
import { service } from "../QueueService/QueueService";
import { Events } from "../QueueService/types";
import NowPlayingCard from "./NowPlayingCard";
import useAudioManager from "../PlaybackManager/use-playback-manager";

export default function NowPlayingCardList() {
  const { getCurrentSong } = useAudioManager();
  const song = getCurrentSong();

  const queue = useValue(
    service.queue,
    Events.QUEUE_CHANGED,
    () => service.queue
  );

  return (
    <Frame position="relative">
      {queue.map((song) => {
        return (
          <Page key={song.id}>
            <NowPlayingCard song={song} />
          </Page>
        );
      })}
    </Frame>
  );
}
