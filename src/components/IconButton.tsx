import React from "react";
import classNames from "classnames";
import { createUseStyles } from "react-jss";

import FlatButton from "./FlatButton";
import { IonRippleEffect } from "@ionic/react";

const useStyle = createUseStyles({
  menuButton: {
    position: "relative",
  },
  ripple: {
    padding: "0.5rem",
    borderRadius: 100,
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
      className={classNames(classes.menuButton, "ion-activatable", className)}
      {...props}
    >
      {children}
      <IonRippleEffect className={classes.ripple} />
    </FlatButton>
  );
}
