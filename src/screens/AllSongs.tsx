import React from "react";
import AppHeader from "../components/AppHeader";
import SongsList from "../components/SongsList";
import SongsPicker from "../components/SongsPicker";
import useSongsManager from "../SongsManager/use-songs-manager";
import { useSwatch } from "../SwatchManager/SwatchManager";
import Loader from "../components/Loader";

export default function AllSongs() {
  const { muted } = useSwatch();
  const { songs, loading } = useSongsManager();

  return (
    <div className="Page">
      {loading && <Loader color={muted} />}
      <AppHeader title="Songs">
        <SongsPicker />
      </AppHeader>
      <SongsList songs={songs} color={muted} />
    </div>
  );
}
