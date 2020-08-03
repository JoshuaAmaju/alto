import { useMachine } from "@xstate/react";
import { AnimatePresence, motion } from "framer-motion";
import React, {
  createRef,
  ReactEventHandler,
  ReactNode,
  useEffect,
} from "react";
import { createUseStyles } from "react-jss";
import { Machine } from "xstate";
import FlatButton from "./FlatButton";

interface Snackbar {
  visible: boolean;
  children: ReactNode;
  onDismiss?: VoidFunction;
  action?: {
    label: string;
    onPress: ReactEventHandler;
  };
}

type Events = { type: "SHOW" | "HIDE" };

const machine = Machine<any, Events>({
  initial: "hidden",
  states: {
    visible: {
      onEntry: "focus",
      onExit: "onDismiss",
      on: {
        HIDE: "hidden",
      },
      after: {
        3000: {
          cond: "noAction",
          actions: "onDismiss",
        },
      },
    },
    hidden: {
      on: {
        SHOW: "visible",
      },
    },
  },
});

const useStyle = createUseStyles({
  wrapper: {
    left: "50%",
    width: "95%",
    zIndex: 1000,
    bottom: "1rem",
    color: "white",
    display: "flex",
    padding: "1rem",
    borderRadius: 7,
    position: "fixed",
    alignItems: "center",
    backgroundColor: "#222",
    justifyContent: "space-between",
    transform: "translate3d(-50%, 0, 0)",
    boxShadow: "0px 5px 9px 0 rgba(0, 0, 0, 0.3)",
    "& > * + *": {
      margin: { left: "1rem" },
    },
  },
  actionButton: {
    color: "turquoise",
    textTransform: "uppercase",
  },
});

const variants = {
  in: { scale: 1, y: 0, x: "-50%" },
  out: { scale: 0.9, y: 100, x: "-50%" },
};

export default function Snackbar({
  action,
  visible,
  children,
  onDismiss = () => {},
}: Snackbar) {
  const ref = createRef<HTMLDivElement>();
  const { wrapper, actionButton } = useStyle();
  const [current, send] = useMachine(
    machine.withConfig({
      actions: {
        onDismiss,
        focus: () => ref.current?.focus(),
      },
      guards: { noAction: () => !action },
    })
  );

  useEffect(() => {
    if (current.matches("visible")) {
      ref.current?.focus();
    }
  }, [current, ref]);

  useEffect(() => {
    if (visible) {
      send("SHOW");
    } else {
      send("HIDE");
    }
  }, [send, visible]);

  return (
    <AnimatePresence>
      {current.matches("visible") && (
        <motion.div
          drag="y"
          ref={ref}
          exit="out"
          animate="in"
          initial="out"
          tabIndex={-1}
          className={wrapper}
          variants={variants}
          dragConstraints={{ top: 0 }}
          onDragEnd={async (_e, info) => {
            const { offset } = info;
            if (offset.y > 0) send("HIDE");
          }}
        >
          <div>{children}</div>
          {action && (
            <FlatButton className={actionButton} onClick={action.onPress}>
              {action.label}
            </FlatButton>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
