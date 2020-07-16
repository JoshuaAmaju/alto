import { IonRippleEffect } from "@ionic/react";
import { Scroll } from "framer";
import React, { useState } from "react";
import { createUseStyles } from "react-jss";
import BottomSheet from "../components/BottomSheet";
import FlatButton from "../components/FlatButton";
import SongTile from "../components/SongTile";
import { Overflow } from "../icons";
import usePlaybackManager from "../PlaybackManager/use-playback-manager";
import usePlaylists from "../PlaylistsManager/use-playlist-manager";
import useSongsManager from "../SongsManager/use-songs-manager";
import { Song } from "../types";

const useStyle = createUseStyles({
  lists: {
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
});

export default function AllSongs() {
  const classes = useStyle();
  const { songs, loading } = useSongsManager();
  const { playlists, addSong } = usePlaylists();
  const [queueOpen, setQueueOpen] = useState(false);
  const [target, setTarget] = useState<Song | null>();
  const { openQueue, playSong } = usePlaybackManager();
  const [showPlaylistMenu, setShowPlaylist] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);

  const handleOpenQueue = (position: number) => {
    if (!queueOpen) {
      openQueue(songs);
      setQueueOpen(true);
    }

    playSong(songs[position]);
  };

  return (
    <div>
      {/* <Drawer>
        <ul>
          <li>
            <Link to="/">Songs</Link>
          </li>
        </ul>
      </Drawer> */}
      {/* <SongsPicker /> */}
      {/* <IonLoading isOpen={loading} /> */}
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
                    setShowActionSheet(true);
                    setTarget(song);
                  }}
                >
                  <Overflow width={25} height={25} />
                </FlatButton>
              }
            />
          );
        })}
      </ul>

      <BottomSheet
        open={showActionSheet}
        onClose={() => setShowActionSheet(false)}
      >
        <ul className={classes.lists}>
          <li
            key="add-to-playlist"
            className="ion-activatable"
            onClick={() => {
              setShowActionSheet(false);
              setShowPlaylist(true);
            }}
          >
            <span>Add to playlist</span>
            <IonRippleEffect />
          </li>
        </ul>
      </BottomSheet>

      {/* <IonActionSheet
        isOpen={showActionSheet}
        onDidDismiss={() => setShowActionSheet(false)}
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
              setShowActionSheet(false);
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
      /> */}
      <BottomSheet
        open={showPlaylistMenu}
        onClose={() => setShowPlaylist(false)}
      >
        {target && <SongTile song={target} />}
        <Scroll
          width="100%"
          height="40vh"
          position="relative"
          className={classes.lists}
        >
          {playlists.map((playlist) => {
            const { name } = playlist;

            return (
              <li
                key={name}
                className="ion-activatable"
                onClick={() => {
                  addSong(playlist, target as Song);
                  setShowPlaylist(false);
                }}
              >
                <span>{name}</span>
                <IonRippleEffect />
              </li>
            );
          })}
        </Scroll>
      </BottomSheet>
    </div>
  );
}
