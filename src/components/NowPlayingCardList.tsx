import React from "react";
import { Frame, Page } from "framer";
import useValue from "../MusicService/use-value";
import { service } from "../MusicService/MusicService";
import { Events } from "../MusicService/types";
import NowPlayingCard from "./NowPlayingCard";

export default function NowPlayingCardList() {
  const song = useValue(service.getCurrentSong(), Events.SONG_CHANGED, () => {
    return service.getCurrentSong();
  });

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
