import { IonInput, IonItem, IonLabel } from "@ionic/react";
import classNames from "classnames";
import React, { createRef, useState } from "react";
import { Plus } from "react-feather";
import { createUseStyles } from "react-jss";
import { Link } from "react-router-dom";
import AlbumArt from "../components/AlbumArt";
import AppHeader from "../components/AppHeader";
import BottomSheet from "../components/BottomSheet";
import Button from "../components/Button";
import FlatButton from "../components/FlatButton";
import Page from "../components/Page";
import Text from "../components/Text";
import usePlaylists from "../PlaylistsManager/use-playlist-manager";
import { Song } from "../types";
import { findSongWithImage } from "../utils";

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
  cover: {
    height: 150,
    borderRadius: 12,
    boxShadow: "rgba(0, 0, 0, 0.2) 0px 10px 20px -5px",
  },
});

export default function Playlists() {
  const classes = useStyle();
  const [open, setOpen] = useState(false);
  const ref = createRef<HTMLIonInputElement>();
  const { create, playlists, getSongs } = usePlaylists();

  const names = playlists.map(({ name }) => name);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = ref.current?.value as string;
    if (!names.includes(value)) create(value);
    setOpen(false);
  };

  return (
    <Page>
      <AppHeader title="Playlists">
        <FlatButton onClick={() => setOpen(true)}>
          <Plus />
        </FlatButton>
      </AppHeader>
      <ul className={classes.list}>
        {names.map((name) => {
          const songs = getSongs(name) as Song[];

          const count = songs?.length;
          const song = songs && findSongWithImage(songs);

          const label = `song${count > 1 || count === 0 ? "s" : ""}`;

          return (
            <li key={name} className={classes.frame}>
              <Link to={`/playlist/${name}`}>
                <AlbumArt
                  song={song}
                  layoutId={name}
                  className={classes.cover}
                />
                <div className={classNames(classes.texts, classes.column)}>
                  <Text variant="h3">{name}</Text>
                  <Text variant="h4">
                    {count} {label}
                  </Text>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
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
    </Page>
  );
}
