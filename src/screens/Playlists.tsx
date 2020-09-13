import classNames from "classnames";
import { motion } from "framer-motion";
import React, { createRef, useEffect, useState } from "react";
import { MoreVertical, Plus, Trash2 } from "react-feather";
import { createUseStyles } from "react-jss";
import { useHistory, useLocation } from "react-router-dom";
import AlbumArt from "../components/AlbumArt";
import AppHeader from "../components/AppHeader";
import BottomSheet from "../components/BottomSheet";
import Button from "../components/Button";
import FlatButton from "../components/FlatButton";
import Text from "../components/Text";
import TextInput from "../components/TextInput";
import usePlaylists from "../PlaylistsManager/use-playlist-manager";
import SelectionManager from "../SelectionManager/SelectionManager";

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
  details: {
    display: "flex",
    alignItems: "center",
    margin: { top: "1rem" },
  },
  texts: {
    flex: 1,
    alignItems: "center",
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
  const { state } = useLocation();
  const { push, goBack } = useHistory();
  const [open, setOpen] = useState(false);
  const ref = createRef<HTMLInputElement>();
  const {
    create,
    playlists,
    playlistsMap,
    delete: deletePlaylist,
  } = usePlaylists();

  const createNew = (state as any)?.new;
  const names = playlists.map(({ name }) => name);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = ref.current?.value as string;
    if (!names.includes(value)) create(value);
    if (createNew) goBack();
    setOpen(false);
  };

  useEffect(() => {
    if (createNew) setOpen(true);
  }, [createNew]);

  return (
    <div className="Page">
      <AppHeader
        title={
          <motion.h1 style={{ margin: 0 }} layoutId="playlists">
            Playlists
          </motion.h1>
        }
      >
        <FlatButton onClick={() => setOpen(true)}>
          <Plus />
        </FlatButton>
      </AppHeader>
      <SelectionManager
        action={({ selection }) => {
          return (
            <>
              <FlatButton
                onClick={() => {
                  deletePlaylist(...(Object.values(selection) as string[]));
                }}
              >
                <Trash2 />
              </FlatButton>
              <FlatButton onClick={() => {}}>
                <MoreVertical size={25} />
              </FlatButton>
            </>
          );
        }}
      >
        {({ add, has, show, remove, isShowing }) => {
          return (
            <ul className={classes.list}>
              {names.map((name) => {
                const { songs, label, coverUrl } = playlistsMap[name] ?? {};

                return (
                  songs?.length > 0 && (
                    <li
                      key={name}
                      className={classes.frame}
                      style={{ background: has(name) ? "#ccc" : "white" }}
                      onClick={() => {
                        if (isShowing) {
                          if (has(name)) {
                            remove(name);
                          } else {
                            add(name, name);
                          }
                        } else {
                          // push(`/playlist/${name}`);
                        }
                      }}
                      onDoubleClick={() => {
                        add(name, name);
                        show(true);
                      }}
                    >
                      <AlbumArt
                        url={coverUrl}
                        layoutId={name}
                        className={classes.cover}
                      />
                      <div className={classes.details}>
                        <div
                          className={classNames(classes.texts, classes.column)}
                        >
                          <Text variant="h3">{name}</Text>
                          <Text variant="h4">{label}</Text>
                        </div>
                        <FlatButton>
                          <MoreVertical size={25} />
                        </FlatButton>
                      </div>
                    </li>
                  )
                );
              })}
            </ul>
          );
        }}
      </SelectionManager>
      <BottomSheet open={open} onClose={() => setOpen(false)}>
        <form
          onSubmit={submit}
          className={classNames(classes.form, classes.column)}
        >
          <TextInput ref={ref} required label="Playlist name" />
          <Button type="submit" className={classes.button}>
            create
          </Button>
        </form>
      </BottomSheet>
    </div>
  );
}
