import {
  IonActionSheet,
  IonLoading,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
} from "@ionic/react";
import React, { useState } from "react";
import { createUseStyles } from "react-jss";
import BottomSheet from "../components/BottomSheet";
import FlatButton from "../components/FlatButton";
import NowPlayingCarousel from "../components/NowPlayingCarousel";
import SongSlider from "../components/SongSlider";
import SongTile from "../components/SongTile";
import { Overflow } from "../icons";
import usePlaybackManager from "../PlaybackManager/use-playback-manager";
import usePlaylists from "../PlaylistsManager/use-playlist-manager";
import useSongsManager from "../SongsManager/use-songs-manager";
import { Song } from "../types";
import AppHeader from "../components/AppHeader";

const useStyle = createUseStyles({
  menu: {
    padding: "1.5rem",
  },
});

export default function AllSongs() {
  const { playlists } = usePlaylists();
  const [showMenu, setShow] = useState(false);
  const { songs, loading } = useSongsManager();
  const [queueOpen, setQueueOpen] = useState(false);
  const [menuTarget, setTarget] = useState<Song | null>();
  const [showPlaylistMenu, setShowPlaylist] = useState(false);
  const { openQueue, playSong, currentSong } = usePlaybackManager();

  const handleOpenQueue = (position: number) => {
    if (!queueOpen) {
      openQueue(songs);
      setQueueOpen(true);
    }

    playSong(songs[position]);
  };

  return (
    <IonPage id="main">
      {/* <AppHeader title="Song" /> */}
      {/* <SongsPicker /> */}
      {/* <NowPlayingCardList /> */}
      <IonLoading isOpen={loading} />
      <SongSlider />
      <ul>
        {songs.map((song, i) => {
          return (
            <SongTile
              song={song}
              key={song.id}
              onClick={() => handleOpenQueue(i)}
              trailing={
                <FlatButton
                  onClick={() => {
                    setShow(true);
                    setTarget(song);
                  }}
                >
                  <Overflow width={25} />
                </FlatButton>
              }
            />
          );
        })}
      </ul>
      {currentSong && <NowPlayingCarousel />}

      <IonActionSheet
        isOpen={showMenu}
        onDidDismiss={() => setShow(false)}
        buttons={[
          {
            text: "Play next",
            handler: () => {},
          },
          {
            text: "Play at end",
            handler: () => {},
          },
          {
            text: "Add to playlist",
            handler: () => {
              setShow(false);
              setShowPlaylist(true);
            },
          },
          {
            text: "Go to artiste",
            handler: () => {},
          },
          {
            text: "Go to album",
            handler: () => {},
          },
          {
            text: "Share",
            handler: () => {},
          },
          {
            text: "Details",
            handler: () => {},
          },
          {
            text: "Delete",
            role: "destructive",
            handler: () => {},
          },
        ]}
      />
      <BottomSheet
        open={showPlaylistMenu}
        onClose={() => setShowPlaylist(false)}
      >
        <ul>
          {playlists.map(({ name }) => (
            <li>{name}</li>
          ))}
        </ul>
      </BottomSheet>
    </IonPage>
  );
}
