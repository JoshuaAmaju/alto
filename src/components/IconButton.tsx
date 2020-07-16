import classNames from "classnames";
import React from "react";
import { createUseStyles } from "react-jss";
import FlatButton from "./FlatButton";

const useStyle = createUseStyles({
  menuButton: {
    position: "relative",
    "&::before": {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0,
      content: '""',
      borderRadius: 100,
      background: "#ccc",
      transition: "0.25s",
      position: "absolute",
      transform: "scale(0.5)",
    },
    "&:focus::before": {
      transform: "scale(1.5)",
    },
  },
});

export default function IconButton({
  children,
  className,
  ...props
}: FlatButton) {
  const classes = useStyle();

  return (
    <FlatButton
      className={classNames(classes.menuButton, className)}
      {...props}
    >
      {children}
    </FlatButton>
  );
}
