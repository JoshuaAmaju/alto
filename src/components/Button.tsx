import classNames from "classnames";
import React from "react";
import { createUseStyles } from "react-jss";
import FlatButton from "./FlatButton";

interface Button extends FlatButton {
  color?: string;
  radius?: number;
  backgroundColor?: string;
}

const useStyle = createUseStyles({
  button: {
    fontWeight: "bold",
    padding: "1rem 1.7rem",
    letterSpacing: "0.1rem",
    textTransform: "uppercase",
    color: ({ color }) => color,
    borderRadius: ({ radius }) => radius,
    backgroundColor: ({ backgroundColor }) => backgroundColor,
  },
});

function Button({
  children,
  className,
  radius = 12,
  color = "white",
  backgroundColor = "blue",
  ...props
}: Button) {
  const classes = useStyle({ color, radius, backgroundColor });

  return (
    <FlatButton
      {...props}
      whileTap={{ scale: 0.9 }}
      className={classNames(classes.button, className)}
    >
      {children}
    </FlatButton>
  );
}

export default Button;
