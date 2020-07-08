import { AnimatePresence, motion } from "framer";
import React, { useState } from "react";
import useAudioManager from "../PlaybackManager/use-playback-manager";
import SongTile from "../components/SongTile";
import useSongsManager from "../SongsManager/use-songs-manager";

export default function AllSongs() {
  const { songs, loading } = useSongsManager();
  const [queueOpen, setQueueOpen] = useState(false);
  const { openQueue, playSongAt } = useAudioManager();

  const handleOpenQueue = (position: number) => {
    if (!queueOpen) {
      openQueue(songs);
      setQueueOpen(true);
    }

    playSongAt(position);
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
                <SongTile song={song} onClick={() => handleOpenQueue(i)} />
              </motion.li>
            </AnimatePresence>
          );
        })}
      </ul>
    </div>
  );
}
