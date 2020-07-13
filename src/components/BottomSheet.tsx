import { AnimatePresence, Frame } from "framer";
import React, {
  CSSProperties,
  ReactEventHandler,
  ReactNode,
  useRef,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import { createUseStyles } from "react-jss";

interface BottomSheet {
  open: boolean;
  children: ReactNode;
  onClose?: ReactEventHandler;
  height?: CSSProperties["height"];
}

const useStyle = createUseStyles({
  sheet: {
    // margin: { top: 10 },
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backdropFilter: "blur(20px)",
  },
});

export default function BottomSheet({
  open,
  onClose,
  children,
  height = "auto",
}: BottomSheet) {
  const classes = useStyle();
  //   const [maxY, setMaxY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const variants = {
    visible: { y: 0 },
    hidden: { y: "110%" },
  };

  //   const control = useDragControls();

  //   const startDrag = (event: React.PointerEvent) => {
  //     control.start(event, { snapToCursor: true });
  //   };

  //   useLayoutEffect(() => {
  //     const height = ref.current?.getBoundingClientRect().height;
  //     if (height) setMaxY(height);
  //   }, [open]);

  useEffect(() => {
    if (open) ref.current?.focus();
  }, [open]);

  return createPortal(
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
            left={0}
            ref={ref}
            bottom={0}
            width="100%"
            exit="hidden"
            tabIndex={-1}
            height={height}
            initial="hidden"
            position="fixed"
            animate="visible"
            overflow="hidden"
            variants={variants}
            transition={{
              type: "tween",
              duration: 0.2,
              ease: "easeInOut",
            }}
            className={classes.sheet}
            backgroundColor="rgba(255, 255, 255, 0.7)"
          >
            {children}
          </Frame>
        )}
      </AnimatePresence>
    </>,
    document.body
  );

  //   return createPortal(
  //     <Frame
  //       left={0}
  //       ref={ref}
  //       bottom={0}
  //       width="100%"
  //       position="fixed"
  //       height={height}
  //       backgroundColor="none"
  //     >
  //       {open && (
  //         <Frame
  //           top={0}
  //           left={0}
  //           width="100%"
  //           height="100%"
  //           position="fixed"
  //           onClick={onClose}
  //           backgroundColor="rgba(0, 0, 0, 0.4)"
  //         />
  //       )}
  //       <AnimatePresence>
  //         {open && (
  //           <Frame
  //             drag="y"
  //             width="100%"
  //             height="100%"
  //             exit="hidden"
  //             initial="hidden"
  //             animate="visible"
  //             background="none"
  //             position="relative"
  //             variants={variants}
  //             // transition={spring}
  //             dragElastic={false}
  //             dragMomentum={false}
  //             // dragControls={control}
  //             dragConstraints={{ top: 0 }}
  //           >
  //             <Frame
  //               center
  //               top={-20}
  //               width={30}
  //               height={5}
  //               radius={12}
  //               backgroundColor="#ccc"
  //               //   dragControls={control}
  //               //   onPointerDown={startDrag}
  //             />
  //             <Frame
  //               width="100%"
  //               height="auto"
  //               position="relative"
  //               backgroundColor="white"
  //               className={classes.sheet}
  //             >
  //               {children}
  //             </Frame>
  //           </Frame>
  //         )}
  //       </AnimatePresence>
  //     </Frame>,
  //     document.body
  //   );
}
