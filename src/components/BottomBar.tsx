import React, { ReactElement } from "react";
import { createUseStyles } from "react-jss";
import classNames from "classnames";
import { motion } from "framer-motion";

type Config = { title: string; route: string; icon?: ReactElement };

interface BottomBar {
  config: Config[];
}

const useStyle = createUseStyles({
  container: {
    padding: "0.5rem",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "white",
    justifyContent: "space-evenly",
    "& > * + *": {
      margin: { left: "1rem" },
    },
  },
  flex: {
    display: "flex",
    alignItems: "center",
  },
  radio: {
    color: "inherit",
    textDecoration: "none",
    "& input": {
      display: "none",
      position: "absolute",
    },
    "& input:checked + label": {
      fontWeight: "bold",
      backgroundColor: "lightblue",
    },
    "& label": {
      display: "block",
      borderRadius: 100,
      padding: "1rem 1.5rem",
      backgroundColor: "aliceblue",
    },
  },
});

export default function BottomBar({ config }: BottomBar) {
  const classes = useStyle();

  return (
    <div className={classNames(classes.flex, classes.container)}>
      {config.map(({ icon, title, route }) => {
        return (
          <a href={route} className={classNames(classes.flex, classes.radio)}>
            <input type="radio" name="route" id={title} />
            <motion.label htmlFor={title}>{title}</motion.label>
          </a>
        );
      })}
    </div>
  );
}
