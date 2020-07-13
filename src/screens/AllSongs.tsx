import {
  IonActionSheet,
  IonLoading,
  IonPage,
  IonRippleEffect,
} from "@ionic/react";
import React, { useState } from "react";
import { createUseStyles } from "react-jss";
import AppHeader from "../components/AppHeader";
import BottomSheet from "../components/BottomSheet";
import FlatButton from "../components/FlatButton";
import NowPlayingCarousel from "../components/NowPlayingCarousel";
import SongTile from "../components/SongTile";
import { Overflow } from "../icons";
import usePlaybackManager from "../PlaybackManager/use-playback-manager";
import usePlaylists from "../PlaylistsManager/use-playlist-manager";
import useSongsManager from "../SongsManager/use-songs-manager";
import { Song } from "../types";
import { Scroll } from "framer";
import classNames from "classnames";

const useStyle = createUseStyles({
  playlists: {
    "& li": {
      padding: "1.5rem",
      listStyle: "none",
      fontWeight: "bold",
      position: "relative",
      textTransform: "capitalize",
    },
    "& *:not(:first-child)": {
      borderTop: "1px solid #ccc",
    },
  },
  menuButton: {
    padding: "0.5rem",
    position: "relative",
  },
  ripple: {
    borderRadius: 100,
  },
});

export default function AllSongs() {
  const classes = useStyle();
  const [showMenu, setShow] = useState(false);
  const { songs, loading } = useSongsManager();
  const { playlists, addSong } = usePlaylists();
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
      <AppHeader title="Song" />
      {/* <SongsPicker /> */}
      <IonLoading isOpen={loading} />
      <ul>
        {songs.map((song, i) => {
          return (
            <SongTile
              song={song}
              key={song.id}
              onClick={() => handleOpenQueue(i)}
              trailing={
                <FlatButton
                  className={classNames(classes.menuButton, "ion-activatable")}
                  onClick={() => {
                    // setShow(true);
                    // setTarget(song);
                  }}
                >
                  <Overflow width={25} height={25} />
                  <IonRippleEffect className={classes.ripple} />
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
        {menuTarget && <SongTile song={menuTarget} />}
        <Scroll
          width="100%"
          height="40vh"
          position="relative"
          className={classes.playlists}
        >
          {playlists.map(({ name }) => (
            <li
              key={name}
              className="ion-activatable"
              onClick={() => {
                addSong(name, (menuTarget as Song).id);
                setShowPlaylist(false);
              }}
            >
              <span>{name}</span>
              <IonRippleEffect />
            </li>
          ))}
        </Scroll>
      </BottomSheet>
    </IonPage>
  );
}
