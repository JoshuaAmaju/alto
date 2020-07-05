import React from "react";
import useSongsManager from "../SongsManager/use-songs-manager";
import SongTile from "../components/SongTile";
import { motion, Frame, AnimatePresence } from "framer";
import SongsPicker from "../components/SongsPicker";

export default function AllSongs() {
  const { songs, loading } = useSongsManager();

  return (
    <div>
      {loading && <h1>loading</h1>}
      <SongsPicker />
      <ul>
        {songs.map((song) => {
          return (
            <AnimatePresence>
              <motion.li animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
                <SongTile key={song.id} song={song} />
              </motion.li>
            </AnimatePresence>
          );
        })}
      </ul>
    </div>
  );
}
