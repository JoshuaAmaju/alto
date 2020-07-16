import { AnimatePresence, Frame, motion } from "framer";
import React, { createRef, memo, ReactNode } from "react";

interface Drawer {
  open: boolean;
  children?: ReactNode;
  onClose?: () => void;
}

function Drawer({ open, onClose, children }: Drawer) {
  const ref = createRef<HTMLDivElement>();

  return (
    <Frame
      top={0}
      left={0}
      size="100%"
      position="fixed"
      background="none"
      style={{ zIndex: 10000 }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            onClick={onClose}
            exit={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            style={{
              top: 0,
              left: 0,
              zIndex: 1,
              width: "100%",
              height: "100%",
              position: "fixed",
              backgroundColor: "rgba(0, 0, 0, 0.4)",
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {open && (
          <motion.nav
            drag="x"
            ref={ref}
            style={{
              top: 0,
              left: 0,
              zIndex: 2,
              width: "60%",
              height: "100%",
              position: "relative",
              backgroundColor: "white",
            }}
            dragElastic={0.5}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            initial={{ x: "-100%" }}
            transition={{
              damping: 15,
              type: "spring",
            }}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_e, { offset }) => {
              const rect = ref.current?.getBoundingClientRect() as DOMRect;
              const distance = offset.x / rect.width;
              if (distance < -0.6) onClose?.();
            }}
          >
            {children}
          </motion.nav>
        )}
      </AnimatePresence>
    </Frame>
  );
}

export default memo(Drawer);
