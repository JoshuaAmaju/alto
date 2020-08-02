import { IonRippleEffect } from "@ionic/react";
import { Scroll } from "framer";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { createUseStyles } from "react-jss";
import usePlaybackManager from "../PlaybackManager/use-playback-manager";
import usePlaylists from "../PlaylistsManager/use-playlist-manager";
import useSongsManager from "../SongsManager/use-songs-manager";
import { Song } from "../types";
import BottomSheet from "./BottomSheet";
import PlaylistTile from "./PlaylistTile";
import SongTile from "./SongTile";

interface SongsList {
  songs: Song[];
}

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

export default function SongsList({ songs }: SongsList) {
  const classes = useStyle();
  const { deleteSong } = useSongsManager();
  const { playlists, addSong } = usePlaylists();
  const [queueOpen, setQueueOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const { openQueue, playSong, enqueue, enqueueNext } = usePlaybackManager();
  const [showPlaylistsAction, setShowPlaylistsAction] = useState(false);
  const [selectedSongsIndexes, setSelectedSongsIndexes] = useState<number[]>(
    []
  );

  const handleOpenQueue = (song: Song) => {
    if (!queueOpen) {
      openQueue(songs);
      setQueueOpen(true);
    }

    playSong(song);
  };

  const getSelectedSongs = () => {
    return selectedSongsIndexes.map((i) => songs[i]);
  };

  return (
    <>
      <ul>
        {songs.map((song, i) => {
          const { id } = song;

          return (
            <PlaylistTile
              key={id}
              song={song}
              onClick={() => handleOpenQueue(song)}
              selected={selectedSongsIndexes.includes(i)}
              onMenuClick={() => {
                setShowPlaylistsAction(true);
                setSelectedSongsIndexes([...selectedSongsIndexes, i]);
              }}
            />
          );
        })}
      </ul>

      <BottomSheet
        open={showActions}
        onClose={() => {
          setShowActions(false);
          setSelectedSongsIndexes([]);
        }}
      >
        <ul className={classes.lists}>
          <li
            key="play-next"
            onClick={() => {
              enqueueNext(...getSelectedSongs());
              setSelectedSongsIndexes([]);
              setShowActions(false);
            }}
          >
            <span>Play next</span>
          </li>
          <li
            key="play-next"
            onClick={() => {
              enqueue(...getSelectedSongs());
              setSelectedSongsIndexes([]);
              setShowActions(false);
            }}
          >
            <span>Play at end</span>
          </li>
          <li
            key="add-to-playlist"
            className="ion-activatable"
            onClick={() => {
              setShowActions(false);
              setShowPlaylistsAction(true);
            }}
          >
            <span>Add to playlist</span>
          </li>
          <li key="go-to-artist" className="ion-activatable">
            <span>Go to artist</span>
          </li>
          <li
            key="delete"
            onClick={() => {
              getSelectedSongs().forEach((song) => deleteSong(song.id));
              setSelectedSongsIndexes([]);
              setShowActions(false);
            }}
          >
            <span>Delete</span>
          </li>
        </ul>
      </BottomSheet>

      <BottomSheet
        open={showPlaylistsAction}
        onClose={() => {
          setSelectedSongsIndexes([]);
          setShowPlaylistsAction(false);
        }}
      >
        {selectedSongsIndexes.length === 1 && (
          <SongTile song={songs[selectedSongsIndexes[0]]} />
        )}
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
                  getSelectedSongs().forEach((song) => {
                    addSong(playlist, song);
                  });

                  setSelectedSongsIndexes([]);
                  setShowPlaylistsAction(false);
                }}
              >
                <span>{name}</span>
                <IonRippleEffect />
              </li>
            );
          })}
        </Scroll>
      </BottomSheet>
    </>
  );
}
