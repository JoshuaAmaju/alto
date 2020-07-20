import React from "react";
import { Home } from "react-feather";
import { createUseStyles } from "react-jss";
import { Link, Route } from "react-router-dom";
import NowPlayingCarousel from "./NowPlayingCarousel";

export const routeConfig = [
  {
    path: "/",
    name: "Songs",
    icon: (match: any) => (
      <Home fill={match ? "black" : "none"} stroke={match ? "none" : "black"} />
    ),
  },
  {
    path: "/playlists",
    name: "Playlists",
    icon: (match: any) => (
      <Home fill={match ? "black" : "none"} stroke={match ? "none" : "black"} />
    ),
  },
];

const useStyle = createUseStyles({
  wrapper: {
    bottom: 0,
    position: "sticky",
  },
  container: {
    display: "flex",
    padding: "0.7rem",
    alignItems: "center",
    backgroundColor: "white",
    borderTop: "1px solid #ccc",
    justifyContent: "space-evenly",
  },
});

export default function BottomBar() {
  const classes = useStyle();

  return (
    <div className={classes.wrapper}>
      <NowPlayingCarousel />
      <div className={classes.container}>
        {routeConfig.map(({ icon, path }) => {
          return (
            <Route
              exact
              path={path}
              children={({ match }) => {
                return <Link to={path}>{icon(match)}</Link>;
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
