import { IonRippleEffect } from "@ionic/react";
import { Scroll } from "framer";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import { MoreVertical, Trash2, X } from "react-feather";
import { createUseStyles } from "react-jss";
import { useHistory } from "react-router-dom";
import usePlaybackManager from "../PlaybackManager/use-playback-manager";
import usePlaylists from "../PlaylistsManager/use-playlist-manager";
import useSongsManager from "../SongsManager/use-songs-manager";
import { Song } from "../types";
import BottomSheet from "./BottomSheet";
import Button from "./Button";
import FlatButton from "./FlatButton";
import PlaylistTile from "./PlaylistTile";
import SongTile from "./SongTile";
import Text from "./Text";

interface SongsList {
  songs: Song[];
  color?: string;
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
    zIndex: 10,
    width: "100%",
    display: "flex",
    position: "fixed",
    alignItems: "center",
    padding: "1.2rem 1rem",
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
      margin: { left: "1rem" },
    },
  },
  createPlaylist: {
    padding: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default function SongsList({ songs, color }: SongsList) {
  const classes = useStyle();
  const { push } = useHistory();
  const { deleteSong } = useSongsManager();
  const { addSong, playlists } = usePlaylists();
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

  const has = useCallback(
    (id: string) => {
      return Object.keys(selectedSongs).includes(id);
    },
    [selectedSongs]
  );

  const addSelected = useCallback(
    (song: Song) => {
      setSelectedSongs({ ...selectedSongs, [song.id]: song });
    },
    [selectedSongs]
  );

  const removeSelected = useCallback(
    (id: string) => {
      const songs = { ...selectedSongs };
      delete songs[id];
      setSelectedSongs(songs);
    },
    [selectedSongs]
  );

  const clearAllSelected = useCallback(() => {
    setSelectedSongs({});
  }, []);

  useEffect(() => {
    if (queueOpen) openQueue(songs);
  }, [songs, queueOpen, openQueue]);

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
              selectedColor={color}
              onActivate={() => {
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
                setShowActions(true);
              }}
            />
          );
        })}
      </ul>

      <AnimatePresence>
        {showBulkAction && (
          <motion.div
            animate={{ scale: 1 }}
            initial={{ scale: 0.9 }}
            className={classes.bulkAction}
            exit={{ scale: 0.95, opacity: 0 }}
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
          </motion.div>
        )}
      </AnimatePresence>

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
              deleteSong(...Object.keys(selectedSongs));
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
        {!playlists || playlists.length <= 0 ? (
          <div className={classes.createPlaylist}>
            <Button onClick={() => push("/playlists", { new: true })}>
              create playlist
            </Button>
          </div>
        ) : (
          <Scroll
            width="100%"
            height="40vh"
            position="relative"
            className={classes.lists}
          >
            {playlists.map((playlist: any) => {
              const { name } = playlist;

              return (
                <li
                  key={name}
                  className="ion-activatable"
                  onClick={() => {
                    addSong(playlist, ...getSelectedSongs());

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
        )}
      </BottomSheet>
    </>
  );
}
