import React, { useState } from "react";
import AppHeader from "../components/AppHeader";
import { createUseStyles } from "react-jss";
import { motion } from "framer-motion";
import { Search as SearchIcon } from "react-feather";
import useSongsManager from "../SongsManager/use-songs-manager";
import usePlaylists from "../PlaylistsManager/use-playlist-manager";
import { Song } from "../types";
import PlaylistTile from "../components/PlaylistTile";
import Loader from "../components/Loader";

const useStyle = createUseStyles({
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
});

export default function Search() {
  const classes = useStyle();
  const { songs } = useSongsManager();
  const { playlistsMap } = usePlaylists();
  const [result, setResult] = useState<Song[]>();

  const search = (query: string) => {
    if (query.trim() === "") {
      return setResult(undefined);
    }

    const regex = new RegExp(query, "gi");

    const finds = songs.filter(({ title, artist, album }) => {
      return regex.test(title as any);
    });

    setResult(finds);
  };

  return (
    <div className="Page">
      <AppHeader title="Search" />
      <main>
        <form className={classes.form}>
          <div className={classes.search}>
            <SearchIcon color="grey" />
            <motion.input
              type="search"
              placeholder="Search here"
              onChange={({ target }) => {
                search(target.value);
              }}
            />
          </div>
        </form>
        <Loader />
        <ul>
          {result &&
            result.map((result) => {
              return <PlaylistTile key={result.id} song={result} />;
            })}

          {result && result.length <= 0 && <p>No match found</p>}
        </ul>
      </main>
    </div>
  );
}
