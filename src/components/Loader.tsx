import { Frame, Color } from "framer";
import React, { useMemo, createRef, useLayoutEffect } from "react";

export default function Loader({
  width = "100%",
  color = "blue",
}: {
  color?: string;
  width?: number | string;
}) {
  const ref = createRef<HTMLDivElement>();

  const mColor = useMemo(() => {
    return Color.alpha(Color(color), 0.2);
  }, [color]);

  useLayoutEffect(() => {
    const { current } = ref;

    current?.animate(
      [
        {
          transformOrigin: "left",
          transform: "translate3d(-100%, 0, 0) scaleX(1)",
        },
        {
          transformOrigin: "right",
          transform: "translate3d(0, 0, 0) scaleX(1)",
        },
        {
          transformOrigin: "right",
          transform: "translate3d(0, 0, 0) scaleX(0)",
        },
      ],
      {
        duration: 1000,
        iterations: Infinity,
        easing: "ease-in-out",
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Frame
      height={3}
      width={width}
      position="relative"
      backgroundColor={mColor.toValue()}
    >
      <Frame
        ref={ref}
        size="100%"
        initial="out"
        position="relative"
        backgroundColor={color}
      />
    </Frame>
  );
}
