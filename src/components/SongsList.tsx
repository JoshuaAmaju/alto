import { IonRippleEffect } from "@ionic/react";
import { AnimatePresence, Scroll } from "framer";
import { motion } from "framer-motion";
import React, { useState, useEffect, useCallback } from "react";
import { Trash2, X, MoreVertical } from "react-feather";
import { createUseStyles } from "react-jss";
import usePlaybackManager from "../PlaybackManager/use-playback-manager";
import usePlaylists from "../PlaylistsManager/use-playlist-manager";
import useSongsManager from "../SongsManager/use-songs-manager";
import { Song } from "../types";
import BottomSheet from "./BottomSheet";
import FlatButton from "./FlatButton";
import PlaylistTile from "./PlaylistTile";
import SongTile from "./SongTile";
import Text from "./Text";
import { insertAt } from "../utils";

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
  bulkAction: {
    left: 0,
    bottom: 0,
    width: "100%",
    padding: "1rem",
    display: "flex",
    position: "fixed",
    alignItems: "center",
    backgroundColor: "white",
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
    justifyContent: "space-between",
    boxShadow: "0px 4px 11px #00000030",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    "& * + *": {
      margin: { left: "0.5rem" },
    },
  },
  // action: {
  //   color: "black",
  //   display: "flex",
  //   padding: "0.3rem",
  //   background: "none",
  //   alignItems: "center",
  //   "& * + *": {
  //     margin: { left: "0.5rem" },
  //   },
  // },
});

export default function SongsList({ songs }: SongsList) {
  const classes = useStyle();
  const { deleteSong } = useSongsManager();
  const { playlists, addSong } = usePlaylists();
  const [queueOpen, setQueueOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showBulkAction, setShowBulkAction] = useState(false);
  const [showPlaylistsAction, setShowPlaylistsAction] = useState(false);
  const { openQueue, playSong, enqueue, enqueueNext } = usePlaybackManager();
  const [selectedSongs, setSelectedSongs] = useState<Record<string, Song>>({});

  const handleOpenQueue = (song: Song) => {
    if (!queueOpen) {
      openQueue(songs);
      setQueueOpen(true);
    }

    playSong(song);
  };

  const getSelectedSongs = useCallback(() => {
    return Object.values(selectedSongs);
  }, [selectedSongs]);

  const length = useCallback(() => {
    return Object.keys(selectedSongs).length;
  }, [selectedSongs]);

  const has = (id: string) => {
    return Object.keys(selectedSongs).includes(id);
  };

  const addSelected = (song: Song) => {
    setSelectedSongs({ ...selectedSongs, [song.id]: song });
  };

  const removeSelected = (id: string) => {
    const songs = { ...selectedSongs };
    delete songs[id];
    setSelectedSongs(songs);
  };

  const clearAllSelected = () => {
    setSelectedSongs({});
  };

  useEffect(() => {
    if (length() <= 0) setShowBulkAction(false);
  }, [length, selectedSongs]);

  return (
    <>
      <ul>
        {songs.map((song, i) => {
          const { id } = song;
          const selected = has(id);

          return (
            <PlaylistTile
              key={id}
              song={song}
              onLongPress={(e) => {
                addSelected(song);
                setShowBulkAction(true);
              }}
              onClick={() => {
                if (showBulkAction) {
                  if (selected) {
                    removeSelected(id);
                  } else {
                    addSelected(song);
                  }
                } else {
                  handleOpenQueue(song);
                }
              }}
              selected={selected}
              onMenuClick={() => {
                addSelected(song);
                setShowPlaylistsAction(true);
              }}
            />
          );
        })}
      </ul>

      {/* <AnimatePresence> */}
      {showBulkAction && (
        <div
          // initial={{ scale: 0.9 }}
          // animate={{ scale: 1 }}
          className={classes.bulkAction}
        >
          <Text>{length()} selected</Text>
          <div className={classes.actions}>
            <FlatButton>
              <Trash2 />
            </FlatButton>
            <FlatButton onClick={() => setShowActions(true)}>
              <MoreVertical size={25} />
            </FlatButton>
            <FlatButton onClick={clearAllSelected}>
              <X />
            </FlatButton>
          </div>
        </div>
      )}
      {/* </AnimatePresence> */}

      <BottomSheet
        open={showActions}
        onClose={() => {
          setShowActions(false);
          clearAllSelected();
        }}
      >
        <ul className={classes.lists}>
          <li
            key="play-next"
            onClick={() => {
              enqueueNext(...getSelectedSongs());
              clearAllSelected();
              setShowActions(false);
            }}
          >
            <span>Play next</span>
          </li>
          <li
            key="play-next"
            onClick={() => {
              enqueue(...getSelectedSongs());
              clearAllSelected();
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
              clearAllSelected();
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
          clearAllSelected();
          setShowPlaylistsAction(false);
        }}
      >
        {length() === 1 && <SongTile song={getSelectedSongs()[0]} />}
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

                  clearAllSelected();
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
