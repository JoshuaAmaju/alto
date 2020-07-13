import React, { useMemo } from "react";
import Slick from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import usePlaybackManager from "../PlaybackManager/use-playback-manager";
import { service } from "../QueueService/QueueService";
import { Events } from "../QueueService/types";
import useValue from "../QueueService/use-value";
import NowPlayingCard from "./NowPlayingCard";

export default function NowPlayingCardList() {
  const { currentSong, playSongAt } = usePlaybackManager();

  const queue = useValue(
    service.queue,
    Events.QUEUE_CHANGED,
    () => service.queue
  );

  const position = useMemo(() => {
    if (!currentSong) return 0;

    const newPosition = queue.findIndex((s) => {
      return s.id === currentSong.id;
    });

    return newPosition;
  }, [queue, currentSong]);

  return (
    <Slick
      dots={false}
      arrows={false}
      slidesToShow={1}
      slidesToScroll={1}
      lazyLoad="ondemand"
      initialSlide={position}
      afterChange={(index) => playSongAt(index)}
    >
      {queue.map((song) => {
        return <NowPlayingCard key={song.id} song={song} />;
      })}
    </Slick>
  );
}
