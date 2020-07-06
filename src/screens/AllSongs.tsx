import { AnimatePresence, motion } from "framer";
import React, { useState } from "react";
import SongsPicker from "../components/SongsPicker";
import SongTile from "../components/SongTile";
import useSongsManager from "../SongsManager/use-songs-manager";
import NowPlayingCardList from "../components/NowPlayingCardList";
import { service } from "../MusicService/MusicService";

export default function AllSongs() {
  const { songs, loading } = useSongsManager();
  const [queueOpen, setQueueOpen] = useState(false);

  const openQueue = (position: number) => {
    if (!queueOpen) {
      service.openQueue(songs, position);
      setQueueOpen(true);
    } else {
      service.playSongAt(position);
    }
  };

  return (
    <div>
      {loading && <h1>loading</h1>}
      {/* <SongsPicker /> */}
      {/* <NowPlayingCardList /> */}
      <ul>
        {songs.map((song, i) => {
          return (
            <AnimatePresence key={song.id}>
              <motion.li animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
                <SongTile song={song} onClick={() => openQueue(i)} />
              </motion.li>
            </AnimatePresence>
          );
        })}
      </ul>
    </div>
  );
}
