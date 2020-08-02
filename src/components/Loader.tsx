import { Frame, useAnimation, Variants } from "framer";
import React from "react";
import { useRafLoop } from "react-use";

const variants: Variants = {
  out: {
    scaleX: 1,
    x: "-100%",
    originX: "left",
  },
  intro: {
    x: 0,
  },
  outro: {
    scaleX: 0,
    originX: "right",
  },
};

export default function Loader({
  width = "100%",
}: {
  width?: number | string;
}) {
  const control = useAnimation();

  useRafLoop(async () => {
    await control.start("intro");
    await control.start("outro");
    control.set("out");
  }, true);

  return (
    <Frame height={3} width={width} position="relative">
      <Frame
        size="100%"
        initial="out"
        animate={control}
        variants={variants}
        position="relative"
        backgroundColor="blue"
        // transition={{
        //   damping: 15,
        //   stiffness: 50,
        //   type: "spring",
        // }}
      />
    </Frame>
  );
}
