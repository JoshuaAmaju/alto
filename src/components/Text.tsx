import classNames from "classnames";
import { createElement, HTMLAttributes } from "react";
import { createUseStyles } from "react-jss";

interface Text extends HTMLAttributes<HTMLElement> {
  variant?: string;
}

const useStyle = createUseStyles({
  text: {
    margin: 0,
    overflow: "hidden",
    display: "-webkit-box",
    "-webkit-line-clamp": 1,
    "text-overflow": "ellipsis",
    "-webkit-box-orient": "vertical",
  },
});

export default function Text({
  children,
  variant = "p",
  className,
  ...props
}: Text) {
  const classes = useStyle();

  return createElement(
    variant,
    {
      ...props,
      className: classNames(classes.text, className),
    },
    children
  );
}
