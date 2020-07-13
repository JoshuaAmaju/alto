import { IonInput, IonItem, IonLabel } from "@ionic/react";
import { Frame, Stack } from "framer";
import React, { createRef, useState } from "react";
import { createUseStyles } from "react-jss";
import BottomSheet from "../components/BottomSheet";
import Button from "../components/Button";
import { Overflow } from "../icons";
import usePlaylists from "../PlaylistsManager/use-playlist-manager";
import { Fab } from "../components/Fab";

export const useStyle = createUseStyles({
  form: {
    display: "flex",
    padding: "1.5rem",
    flexDirection: "column",
  },
  button: {
    margin: { top: "1rem" },
    alignSelf: "flex-end",
  },
});

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
