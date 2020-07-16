import { AnimatePresence, Frame, motion } from "framer";
import React, { createRef, memo, ReactNode } from "react";

interface Drawer {
  open: boolean;
  children?: ReactNode;
  onClose?: () => void;
}

function Drawer({ open, onClose, children }: Drawer) {
  const ref = createRef<HTMLDivElement>();

  console.log(open);

  return (
    <Frame
      top={0}
      left={0}
      size="100%"
      position="fixed"
      background="none"
      style={{ zIndex: 10000 }}
    >
      {open && (
        <motion.div
          onClick={onClose}
          style={{
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            position: "fixed",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          }}
        />
      )}
      <AnimatePresence>
        {open && (
          <Frame
            top={0}
            left={0}
            drag="x"
            ref={ref}
            width="40%"
            height="100%"
            dragElastic={0.5}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            backgroundColor="white"
            initial={{ x: "-100%" }}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_e, { offset }) => {
              const { width } = ref.current?.getBoundingClientRect() as DOMRect;
              const distance = offset.x / width;
              if (distance < -0.6) onClose?.();
            }}
          >
            {children}
          </Frame>
        )}
      </AnimatePresence>
    </Frame>
  );
}

export default memo(Drawer);
