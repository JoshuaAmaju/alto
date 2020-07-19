import classNames from "classnames";
import { motion, HTMLMotionProps } from "framer-motion";
import React from "react";
import { createUseStyles } from "react-jss";

interface FlatButton extends HTMLMotionProps<"button"> {}

const useStyle = createUseStyles({
  button: {
    padding: 0,
    border: "none",
    background: "none",
  },
});

function FlatButton({
  children,
  className,
  type = "button",
  ...props
}: FlatButton) {
  const classes = useStyle();

  return (
    <motion.button
      type={type}
      {...props}
      className={classNames(classes.button, className)}
    >
      {children}
    </motion.button>
  );
}

export default FlatButton;
