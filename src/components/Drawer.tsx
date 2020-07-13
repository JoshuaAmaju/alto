import { AnimatePresence, Frame, useMotionValue, Animatable } from "framer";
import React, {
  ReactEventHandler,
  ReactNode,
  ReactText,
  useRef,
  createRef,
} from "react";

interface Drawer {
  open: boolean;
  children?: ReactNode;
  onClose?: ReactEventHandler;
}

export default function Drawer({ open, onClose, children }: Drawer) {
  const ref = createRef<HTMLDivElement>();
  const motionX = useMotionValue<ReactText>(0);

  return (
    <>
      {open && (
        <Frame
          top={0}
          left={0}
          width="100%"
          height="100%"
          position="fixed"
          onClick={onClose}
          backgroundColor="rgba(0, 0, 0, 0.4)"
        />
      )}
      <AnimatePresence>
        {open && (
          <Frame
            top={0}
            left={0}
            drag="x"
            ref={ref}
            x={motionX}
            width="40%"
            height="100%"
            position="fixed"
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            backgroundColor="white"
            initial={{ x: "-100%" }}
            dragConstraints={{ right: 0 }}
            onDragEnd={(_e, { point }) => {
              const { width } = ref.current?.getBoundingClientRect() as DOMRect;
              // console.log(width);

              //   const anim = Animatable
              //   motionX.start();

              if (Math.abs(point.x) < width / 2) {
                motionX.set("-100%");
              } else {
                motionX.set(0);
              }
              //   console.log(info);
            }}
          >
            {children}
          </Frame>
        )}
      </AnimatePresence>
    </>
  );
}
