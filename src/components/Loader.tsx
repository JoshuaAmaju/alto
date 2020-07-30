import { Frame } from "framer";
import React from "react";

export default function Loader() {
  return (
    <Frame
      size={30}
      position="relative"
      backgroundColor="blue"
      transition={{ yoyo: Infinity }}
      animate={{ scale: 2, radius: 10 }}
      initial={{ scale: 0.7, radius: 100 }}
    />
  );
}
