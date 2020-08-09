import React from "react";
import { Color } from "framer";
import { Home, Search } from "react-feather";
import { createUseStyles } from "react-jss";
import { Link, Route } from "react-router-dom";
import { useSwatch } from "../SwatchManager/SwatchManager";

export const routeConfig = [
  {
    path: "/",
    name: "Songs",
    icon: (match: any, fill: string, stroke: string) => (
      <Home fill={match ? fill : "none"} stroke={match ? "none" : stroke} />
    ),
  },
  {
    path: "/playlists",
    name: "Playlists",
    icon: (match: any, fill: string, stroke: string) => (
      <Home fill={match ? fill : "none"} stroke={match ? "none" : stroke} />
    ),
  },
  {
    path: "/search",
    name: "Search",
    icon: (match: any, fill: string, stroke: string) => (
      <Search stroke={match ? fill : stroke} />
    ),
  },
];

const useStyle = createUseStyles({
  container: {
    display: "flex",
    padding: "1rem",
    alignItems: "center",
    backgroundColor: "white",
    borderTop: "1px solid #ccc",
    justifyContent: "space-evenly",
  },
  // link: {
  //   fill: "none",
  //   stroke: ({ stroke }) => stroke,
  //   "&:active": {
  //     stroke: "none",
  //     fill: ({ fill }: any) => fill,
  //   },
  // },
});

export default function BottomBar() {
  const classes = useStyle();
  const { muted = "black" } = useSwatch();

  const color = Color.lighten(Color(muted), 30);

  return (
    <div className={classes.container}>
      {routeConfig.map(({ icon, path }) => {
        return (
          <Route
            exact
            key={path}
            path={path}
            children={({ match }) => {
              return (
                <Link to={path}>{icon(match, muted, color.toValue())}</Link>
              );
            }}
          />
        );
      })}
    </div>
  );
}
