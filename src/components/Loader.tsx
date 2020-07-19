import { Frame } from "framer";
import React from "react";

const variants = {
  x1: {},
};

export default function Loader() {
  return (
    <Frame
      size={50}
      position="relative"
      backgroundColor="blue"
      transition={{ yoyo: true }}
      animate={{ scale: 2, transition: { flip: true } }}
    />
  );
}
