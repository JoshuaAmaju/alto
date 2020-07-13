import { AnimatePresence, Frame } from "framer";
import React, { CSSProperties } from "react";
import FlatButton from "./FlatButton";
import { createUseStyles } from "react-jss";

interface Fab extends FlatButton {
  top?: CSSProperties["top"];
  left?: CSSProperties["left"];
  right?: CSSProperties["right"];
  bottom?: CSSProperties["bottom"];
  position?: CSSProperties["position"];
}

export const useStyle = createUseStyles({
  frame: {
    padding: "1rem",
  },
  fab: {
    color: "white",
    padding: "1rem",
    display: "flex",
    width: "3.5rem",
    height: "3.5rem",
    alignItems: "center",
    borderRadius: "100px",
    backgroundColor: "blue",
    justifyContent: "center",
    boxShadow: "0px 4px 10px 0px #00000070",
  },
});

export function Fab({
  children,
  right = 0,
  bottom = 0,
  top = "auto",
  left = "auto",
  position = "absolute",
  ...props
}: Fab) {
  const classes = useStyle();

  return (
    <AnimatePresence>
      <Frame
        top={top}
        left={left}
        width="auto"
        height="auto"
        right={right}
        bottom={bottom}
        background="none"
        position={position}
        className={classes.frame}
        whileTap={{ scale: 0.8 }}
        exit={{ scale: 0.4, rotate: 90 }}
        animate={{ scale: 1, rotate: 0 }}
        initial={{ scale: 0.4, rotate: 90 }}
        {...(props as any)}
      >
        <FlatButton {...props} className={classes.fab}>
          {children}
        </FlatButton>
      </Frame>
    </AnimatePresence>
  );
}
