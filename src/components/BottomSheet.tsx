import { AnimatePresence, Frame } from "framer";
import React, { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { createUseStyles } from "react-jss";

interface BottomSheet {
  open: boolean;
  children: ReactNode;
  onClose?: () => void;
}

const variants = {
  visible: { y: 0 },
  hidden: { y: "100%" },
};

const useStyle = createUseStyles({
  sheet: {
    margin: { top: 10 },
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backdropFilter: "blur(20px)",
  },
});

export default function BottomSheet({ open, onClose, children }: BottomSheet) {
  const classes = useStyle();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) ref.current?.focus();
  }, [open]);

  return createPortal(
    <>
      <AnimatePresence>
        {open && (
          <Frame
            top={0}
            left={0}
            width="100%"
            height="100%"
            position="fixed"
            onClick={onClose}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            backgroundColor="rgba(0, 0, 0, 0.4)"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {open && (
          <Frame
            drag="y"
            left={0}
            ref={ref}
            bottom={0}
            width="100%"
            height="auto"
            exit="hidden"
            tabIndex={-1}
            initial="hidden"
            position="fixed"
            animate="visible"
            overflow="hidden"
            dragElastic={0.6}
            variants={variants}
            transition={{
              damping: 15,
              type: "spring",
            }}
            dragMomentum={false}
            className={classes.sheet}
            backgroundColor="#ffffffc2"
            onDragEnd={(_e, { offset }) => {
              const {
                height,
              } = ref.current?.getBoundingClientRect() as DOMRect;
              const distance = offset.y / height;
              if (distance > 0.6) onClose?.();
            }}
            dragConstraints={{ top: 0, bottom: 0 }}
          >
            {children}
          </Frame>
        )}
      </AnimatePresence>
    </>,
    document.body
  );

  // return createPortal(
  //   <Frame
  //     left={0}
  //     ref={ref}
  //     bottom={0}
  //     width="100%"
  //     position="fixed"
  //     height={height}
  //     backgroundColor="none"
  //   >
  //     {open && (
  //       <Frame
  //         top={0}
  //         left={0}
  //         width="100%"
  //         height="100%"
  //         position="fixed"
  //         onClick={onClose}
  //         backgroundColor="rgba(0, 0, 0, 0.4)"
  //       />
  //     )}
  //     <AnimatePresence>
  //       {open && (
  //         <Frame
  //           y={y}
  //           width="100%"
  //           height="100%"
  //           exit="hidden"
  //           initial="hidden"
  //           animate="visible"
  //           background="none"
  //           position="relative"
  //           variants={variants}
  //           // transition={spring}
  //         >
  //           <Frame
  //             y={y}
  //             center
  //             drag="y"
  //             // top={-20}
  //             width={30}
  //             height={5}
  //             radius={12}
  //             position="relative"
  //             // dragElastic={false}
  //             // dragMomentum={false}
  //             backgroundColor="#ccc"
  //             dragConstraints={{ top: 0, bottom: 0 }}
  //             onDragEnd={(_e, info) => {
  //               if (info.point.y > maxY / 4) {
  //                 onClose?.();
  //               }
  //             }}
  //           />
  //           <Frame
  //             width="100%"
  //             height="auto"
  //             position="relative"
  //             backgroundColor="white"
  //             className={classes.sheet}
  //           >
  //             {children}
  //           </Frame>
  //         </Frame>
  //       )}
  //     </AnimatePresence>
  //   </Frame>,
  //   document.body
  // );
}
