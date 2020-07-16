import classNames from "classnames";
import React, { ReactElement, ReactNode, memo, useState } from "react";
import { createUseStyles } from "react-jss";
import { NavLink } from "react-router-dom";
import { Menu, Overflow } from "../icons";
import Drawer from "./Drawer";
import Text from "./Text";

interface AppHeader {
  title: string;
  children?: ReactNode;
  leading?: ReactElement;
}

const useStyle = createUseStyles({
  header: {
    top: 0,
    zIndex: 2,
    padding: "1rem",
    position: "sticky",
    background: "#ffffffc2",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid #ccc",
    justifyContent: "space-between",
  },
  gap: {
    display: "flex",
    alignItems: "center",
    "& > * + *": {
      margin: { left: "1rem" },
    },
  },
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

const routeConfig = [
  {
    path: "/",
    name: "Song",
  },
  {
    path: "/playlists",
    name: "Playlists",
  },
];

function AppHeader({ title, leading, children }: AppHeader) {
  const classes = useStyle();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className={classNames(classes.gap, classes.header)}>
        <div className={classes.gap}>
          {leading ? (
            leading
          ) : (
            <Menu width={20} height={20} onClick={() => setOpen(true)} />
          )}
          <Text variant="h2">{title}</Text>
        </div>
        <div className={classes.gap}>
          {children}
          <Overflow width={20} height={20} />
        </div>
      </header>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <ul className={classes.nav}>
          {routeConfig.map(({ name, path }) => {
            return (
              <li key={name} onClick={() => setOpen(false)}>
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
    </>
  );
}

export default memo(AppHeader);
