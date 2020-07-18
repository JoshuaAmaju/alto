import { IonInput, IonItem, IonLabel } from "@ionic/react";
import classNames from "classnames";
import { Frame, motion } from "framer";
import { Link } from "react-router-dom";
import React, { createRef, useState } from "react";
import { createUseStyles } from "react-jss";
import AlbumArt from "../components/AlbumArt";
import BottomSheet from "../components/BottomSheet";
import Button from "../components/Button";
import { Fab } from "../components/Fab";
import Text from "../components/Text";
import { Overflow } from "../icons";
import usePlaylists from "../PlaylistsManager/use-playlist-manager";

export const useStyle = createUseStyles({
  form: {
    padding: "1.5rem",
  },
  button: {
    alignSelf: "flex-end",
    margin: { top: "1rem" },
  },
  column: {
    display: "flex",
    flexDirection: "column",
  },
  list: {
    gap: "1rem",
    padding: "1rem",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
  },
  texts: {
    alignItems: "center",
    margin: { top: "1rem" },
  },
  frame: {
    padding: "1rem",
    borderRadius: 12,
    backgroundColor: "white",
    "& a": {
      textDecoration: "none",
    },
  },
});

export default function Playlists() {
  const classes = useStyle();
  const [open, setOpen] = useState(false);
  const { create, details } = usePlaylists();
  const ref = createRef<HTMLIonInputElement>();

  const names = details.map(({ name }) => name);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = ref.current?.value as string;
    if (!names.includes(value)) await create(value);
    setOpen(false);
  };

  return (
    <div>
      <ul className={classes.list}>
        {details.map(({ name, song, count }) => {
          const label = `song${count > 1 || count === 0 ? "s" : ""}`;

          return (
            <motion.li key={name} className={classes.frame}>
              <Link to={`/playlist/${name}`}>
                <Frame
                  radius={12}
                  width="100%"
                  height={100}
                  overflow="hidden"
                  position="relative"
                  shadow="rgba(0, 0, 0, 0.2) 0px 10px 20px -5px"
                >
                  <AlbumArt song={song} />
                </Frame>
                <div className={classNames(classes.texts, classes.column)}>
                  <Text variant="h3">{name}</Text>
                  <Text variant="h4">
                    {count} {label}
                  </Text>
                </div>
              </Link>
            </motion.li>
          );
        })}
      </ul>
      <Fab onClick={() => setOpen(true)}>
        <Overflow width={35} stroke="white" />
      </Fab>
      <BottomSheet open={open} onClose={() => setOpen(false)}>
        <form
          className={classNames(classes.form, classes.column)}
          onSubmit={submit}
        >
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
