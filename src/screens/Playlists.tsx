import { IonInput, IonItem, IonLabel } from "@ionic/react";
import { AnimatePresence, Frame, Stack } from "framer";
import React, { createRef, CSSProperties, useState } from "react";
import { createUseStyles } from "react-jss";
import BottomSheet from "../components/BottomSheet";
import Button from "../components/Button";
import FlatButton from "../components/FlatButton";
import { Overflow } from "../icons";
import usePlaylists from "../PlaylistsManager/use-playlist-manager";

interface Fab extends FlatButton {
  top?: CSSProperties["top"];
  left?: CSSProperties["left"];
  right?: CSSProperties["right"];
  bottom?: CSSProperties["bottom"];
  position?: CSSProperties["position"];
}

const useStyle = createUseStyles({
  frame: {
    padding: "1rem",
  },
  form: {
    display: "flex",
    padding: "1.5rem",
    flexDirection: "column",
  },
  button: {
    margin: { top: "1rem" },
    alignSelf: "flex-end",
  },
  fab: {
    color: "white",
    padding: "1rem",
    display: "flex",
    width: "3.5rem",
    height: "3.5rem",
    alignItems: "center",
    borderRadius: "100px",
    backgroundColor: "blue",
    justifyContent: "center",
    boxShadow: "0px 4px 10px 0px #00000070",
  },
});

function Fab({
  children,
  right = 0,
  bottom = 0,
  top = "auto",
  left = "auto",
  position = "absolute",
  ...props
}: Fab) {
  const classes = useStyle();

  return (
    <AnimatePresence>
      <Frame
        top={top}
        left={left}
        width="auto"
        height="auto"
        right={right}
        bottom={bottom}
        background="none"
        position={position}
        className={classes.frame}
        whileTap={{ scale: 0.8 }}
        exit={{ scale: 0.4, rotate: 90 }}
        animate={{ scale: 1, rotate: 0 }}
        initial={{ scale: 0.4, rotate: 90 }}
        {...(props as any)}
      >
        <FlatButton {...props} className={classes.fab}>
          {children}
        </FlatButton>
      </Frame>
    </AnimatePresence>
  );
}

export default function Playlists() {
  const classes = useStyle();
  const [open, setOpen] = useState(false);
  const ref = createRef<HTMLIonInputElement>();
  const { create, playlists } = usePlaylists();
  const names = playlists.map(({ name }) => name);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = ref.current?.value as string;
    if (!names.includes(value)) await create(value);
    setOpen(false);
  };

  return (
    <div>
      <Stack width="100%" height="100%">
        {playlists.map(({ name }) => {
          return (
            <Frame key={name} width="auto" height="auto">
              {name}
            </Frame>
          );
        })}
      </Stack>
      <Fab onClick={() => setOpen(true)}>
        <Overflow width={35} stroke="white" />
      </Fab>
      <BottomSheet open={open} onClose={() => setOpen(false)}>
        <form className={classes.form} onSubmit={submit}>
          <IonItem>
            <IonLabel position="stacked">Playlist name</IonLabel>
            <IonInput
              required
              ref={ref}
              type="text"
              name="playlist"
              maxlength={10}
            />
          </IonItem>
          <Button type="submit" className={classes.button}>
            create
          </Button>
        </form>
      </BottomSheet>
    </div>
  );
}
