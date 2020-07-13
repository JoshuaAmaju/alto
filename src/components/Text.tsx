import { JssStyle } from "jss";
import { createElement, ReactNode } from "react";
import { createUseStyles } from "react-jss";

interface Text {
  variant?: string;
  className?: string;
  children: ReactNode;
  style?: JssStyle | JssStyle[];
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

export default function Text({ style, children, variant = "p" }: Text) {
  const classes = useStyle();

  return createElement(
    variant,
    {
      style,
      className: classes.text,
    },
    children
  );
}
