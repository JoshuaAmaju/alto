import { useMachine } from "@xstate/react";
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { useHistory } from "react-router";
import { Search as SearchIcon } from "react-feather";
import { createUseStyles } from "react-jss";
import AppHeader from "../components/AppHeader";
import PlaylistTile from "../components/PlaylistTile";
import searchMachine from "../machines/search.machine";
import usePlaylists from "../PlaylistsManager/use-playlist-manager";
import useSongsManager from "../SongsManager/use-songs-manager";
import SongTile from "../components/SongTile";
import { Song } from "../types";
import Text from "../components/Text";
import classNames from "classnames";

import List_Is_Empty from "../assets/png/List_Is_Empty_-_Light.png";

const useStyle = createUseStyles({
  page: {
    display: "flex",
    flexDirection: "column",
  },
  formWrapper: {
    top: 0,
    position: "sticky",
    backgroundColor: "whitesmoke",
  },
  form: {
    width: "85%",
    margin: "auto",
    padding: "3rem 0",
  },
  search: {
    display: "flex",
    borderRadius: 100,
    alignItems: "center",
    padding: "0.5rem 1rem",
    // justifyContent: "center",
    backgroundColor: "white",
    boxShadow: "0px 0px 20px #0000000d",
    // "&:focus-within": {
    //   justifyContent: "flex-start",
    // },
    "& input": {
      flex: 1,
      border: "none",
      padding: "0.7rem",
      background: "none",
    },
    "& > * + *": {
      margin: { left: "0.5rem" },
    },
  },
  sectionTitle: {
    padding: "1rem",
    backgroundColor: "#eaeaea",
  },
  empty: {
    flex: 1,
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundImage: `url(${List_Is_Empty})`,
  },
});

export default function Search() {
  const classes = useStyle();
  const { push } = useHistory();
  const { songs } = useSongsManager();
  const { playlistsMap: playlists } = usePlaylists();

  const [state, send] = useMachine(
    searchMachine.withContext({
      songs,
      playlists,
    })
  );

  const { foundSongs, foundPlaylists } = state.context;

  useEffect(() => {
    send({ type: "SET_CONTEXT", songs, playlists });
  }, [send, songs, playlists]);

  return (
    <div className={classNames("Page", classes.page)}>
      <AppHeader title="Search" />
      <div className={classes.formWrapper}>
        <form className={classes.form}>
          <div className={classes.search}>
            <SearchIcon color="grey" />
            <motion.input
              type="search"
              placeholder="Search here"
              onChange={({ target }) => {
                send({ type: "SEARCH", query: target.value });
              }}
            />
          </div>
        </form>
      </div>
      {state.matches("idle") && foundSongs && (
        <ul>
          {foundSongs.map((result) => {
            return <PlaylistTile key={result.id} song={result} />;
          })}

          {/* Just re-purposing SongTile component since it has similar layout
            for the playlist ui */}
          {foundPlaylists && foundPlaylists.length > 0 && (
            <section>
              <Text variant="h3" className={classes.sectionTitle}>
                Found in playlists
              </Text>
              {foundPlaylists.map(({ name, label, coverUrl }) => {
                const song = {
                  title: name,
                  artist: label,
                  imageUrl: coverUrl,
                } as Song;

                return (
                  <SongTile
                    song={song}
                    onClick={() => push(`/playlist/${name}`)}
                  />
                );
              })}
            </section>
          )}
        </ul>
      )}
      {state.matches("no_result") && <div className={classes.empty} />}
    </div>
  );
}
