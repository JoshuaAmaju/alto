import classNames from "classnames";
import React, { ButtonHTMLAttributes } from "react";
import { createUseStyles } from "react-jss";

interface FlatButton extends ButtonHTMLAttributes<HTMLButtonElement> {}

const useStyle = createUseStyles({
  button: {
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
    <button
      type={type}
      className={classNames(classes.button, className)}
      {...props}
    >
      {children}
    </button>
  );
}

export default FlatButton;
