import React from "react";
import { HTMLMotionProps, motion } from "framer-motion";

interface Page extends HTMLMotionProps<"div"> {}

export default function Page({ children, ...props }: Page) {
  return (
    <motion.div style={{ height: "100vh" }} {...props}>
      {children}
    </motion.div>
  );
}
