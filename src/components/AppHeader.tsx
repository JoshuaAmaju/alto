import classNames from "classnames";
import React, { memo, ReactElement, ReactNode } from "react";
import { Menu, MoreVertical } from "react-feather";
import { createUseStyles } from "react-jss";
import { Link } from "react-router-dom";
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
    // borderBottom: "1px solid #ccc",
    justifyContent: "space-between",
    // boxShadow: "0px 0px 9px 0px #0000001c",
  },
  gap: {
    display: "flex",
    alignItems: "center",
    "& > * + *": {
      margin: { left: "1rem" },
    },
  },
});

function AppHeader({ title, leading, children }: AppHeader) {
  const classes = useStyle();

  return (
    <>
      <header className={classNames(classes.gap, classes.header)}>
        <div className={classes.gap}>
          {leading ? (
            leading
          ) : (
            <Link to={{ pathname: "/drawer", state: { modal: true } }}>
              <Menu size={20} />
            </Link>
          )}
          <Text variant="h2">{title}</Text>
        </div>
        <div className={classes.gap}>
          {children}
          <MoreVertical size={25} />
        </div>
      </header>
    </>
  );
}

export default memo(AppHeader);
