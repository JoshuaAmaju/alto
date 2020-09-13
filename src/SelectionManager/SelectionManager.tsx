import { AnimatePresence, motion } from "framer";
import React, { ReactNode, useCallback, useState, useEffect } from "react";
import { X } from "react-feather";
import { createUseStyles } from "react-jss";
import FlatButton from "../components/FlatButton";
import Text from "../components/Text";

type Selection = Record<string, unknown>;

type Selections = {
  isShowing: boolean;
  selection: Selection;
  show: (show: boolean) => void;
  has: (key: string) => boolean;
  remove: (key: string) => void;
  add: (key: string, value: unknown) => void;
};

interface SelectionManager {
  children: (selection: Selections) => ReactNode;
  action?: ReactNode | SelectionManager["children"];
}

const useStyle = createUseStyles({
  container: {
    left: 0,
    bottom: 0,
    zIndex: 10,
    width: "100%",
    display: "flex",
    position: "fixed",
    alignItems: "center",
    padding: "1.2rem 1rem",
    backgroundColor: "white",
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
    justifyContent: "space-between",
    boxShadow: "0px 4px 11px #00000030",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    "& * + *": {
      margin: { left: "1rem" },
    },
  },
});

export default function SelectionManager({
  action,
  children,
}: SelectionManager) {
  const classes = useStyle();
  const [show, setShow] = useState(false);
  const [selection, setSelection] = useState<Selection>({});

  const length = useCallback(() => {
    return Object.keys(selection).length;
  }, [selection]);

  const add = useCallback(
    (key: string, value: unknown) => {
      setSelection({ ...selection, [key]: value });
    },
    [selection]
  );

  const remove = useCallback(
    (key: string) => {
      delete selection[key];
      setSelection({ ...selection });
    },
    [selection]
  );

  const has = useCallback(
    (key: string) => {
      return Object.keys(selection).includes(key);
    },
    [selection]
  );

  useEffect(() => {
    if (length() <= 0) setShow(false);
  }, [length, selection]);

  const options = {
    add,
    has,
    remove,
    selection,
    show: setShow,
    isShowing: show,
  };

  return (
    <>
      {children(options)}
      <AnimatePresence>
        {show && (
          <motion.div
            animate={{ scale: 1 }}
            initial={{ scale: 0.9 }}
            className={classes.container}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <Text>{length()} selected</Text>
            <div className={classes.actions}>
              {typeof action === "function" ? action(options) : action}
              <FlatButton
                onClick={() => {
                  setShow(false);
                  setSelection({});
                }}
              >
                <X />
              </FlatButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
