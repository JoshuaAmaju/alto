import { Frame } from "framer";
import React from "react";
import FlatButton from "./FlatButton";
import { createUseStyles } from "react-jss";
import classNames from "classnames";

interface Button extends FlatButton {
  color?: string;
  textColor?: string;
  innerClassName?: string;
}

const useStyle = createUseStyles({
  button: {
    fontWeight: "bold",
    padding: "1rem 1.7rem",
    letterSpacing: "0.1rem",
    textTransform: "uppercase",
    color: ({ color }) => color,
  },
});

function Button({
  children,
  className,
  color = "blue",
  innerClassName,
  textColor = "white",
  ...props
}: Button) {
  const classes = useStyle({ color: textColor });

  return (
    <Frame
      radius={12}
      width="auto"
      height="auto"
      position="relative"
      backgroundColor={color}
      whileTap={{ scale: 0.8 }}
      className={classNames(className)}
    >
      <FlatButton
        {...props}
        className={classNames(classes.button, innerClassName)}
      >
        {children}
      </FlatButton>
    </Frame>
  );
}

export default Button;
