import React, { useState, useEffect, useRef } from "react";
import { Route, Switch } from "react-router";
import { useHistory } from "react-router-dom";
import AllSongs from "./AllSongs";
import Playlist from "./Playlist";
import Playlists from "./Playlists";

import NavDrawer from "../components/NavDrawer";

export default function Main() {
  const history = useHistory();

  const { location } = history;
  const { state } = location as any;

  let previousLocation = useRef(location);

  const isModal = state && state.modal && previousLocation.current !== location;

  useEffect(() => {
    if (!(state && state.modal)) {
      previousLocation.current = location;
    }
  }, [state, location]);

  console.log(isModal);

  return (
    <>
      <Switch location={isModal ? previousLocation.current : location}>
        <Route exact path="/">
          <AllSongs />
        </Route>
        <Route exact path="/playlists">
          <Playlists />
        </Route>
        <Route exact path="/playlist/:name">
          <Playlist />
        </Route>
      </Switch>
      {isModal && <NavDrawer />}
    </>
  );
}
