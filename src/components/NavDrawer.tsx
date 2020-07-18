import React from "react";
import { Route } from "react-router";
import Drawer from "./Drawer";
import { routeConfig } from "../utils";
import { NavLink, useHistory } from "react-router-dom";

import { createUseStyles } from "react-jss";

const useStyle = createUseStyles({
  nav: {
    padding: "1rem",
    "& > * + *": {
      margin: { top: "1rem" },
    },
  },
  navLink: {
    padding: "1rem",
    color: "inherit",
    display: "block",
    borderRadius: 12,
    fontWeight: "bold",
    textDecoration: "none",
    "&:hover": {
      backgroundColor: "#ccc",
    },
  },
  navLinkActive: {
    fontWeight: "bolder",
    backgroundColor: "#ccc",
  },
});

export default function NavDrawer() {
  const classes = useStyle();
  const history = useHistory();

  return (
    <Route path="/drawer">
      <Drawer open={true} onClose={history.goBack}>
        <ul className={classes.nav}>
          {routeConfig.map(({ name, path }) => {
            return (
              <li key={name}>
                <NavLink
                  exact
                  to={path}
                  className={classes.navLink}
                  activeClassName={classes.navLinkActive}
                >
                  {name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </Drawer>
    </Route>
  );
}
