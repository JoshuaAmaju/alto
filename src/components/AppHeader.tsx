import classNames from "classnames";
import React, { memo, ReactElement, ReactNode } from "react";
import { createUseStyles } from "react-jss";
import Text from "./Text";

interface AppHeader {
  children?: ReactNode;
  title: string | ReactElement;
}

const useStyle = createUseStyles({
  header: {
    // top: 0,
    // zIndex: 2,
    // position: "sticky",
    // background: "#ffffffc2",
    padding: "2rem 1rem 1rem 1rem",
    // backdropFilter: "blur(20px)",
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

function AppHeader({ title, children }: AppHeader) {
  const classes = useStyle();

  return (
    <>
      <header className={classNames(classes.gap, classes.header)}>
        {typeof title === "string" ? <Text variant="h1">{title}</Text> : title}
        <div className={classes.gap}>{children}</div>
      </header>
    </>
  );
}

export default memo(AppHeader);
