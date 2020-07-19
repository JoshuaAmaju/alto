import { Frame, useMotionValue, useTransform } from "framer";
import React, { createRef, memo, useLayoutEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { Shuffle, Play } from "react-feather";
import { useParams } from "react-router-dom";
import { useAsync } from "react-use";
import AlbumArt from "../components/AlbumArt";
import Button from "../components/Button";
import PlaylistTile from "../components/PlaylistTile";
import Text from "../components/Text";
import usePlaybackManager from "../PlaybackManager/use-playback-manager";
import { ShuffleMode } from "../QueueService/types";
import { getSongs } from "../services/playlist.service";
import { Song } from "../types";
import { createSong } from "../utils";
import FlatButton from "../components/FlatButton";

const useStyle = createUseStyles({
  frame: {
    display: "flex",
    padding: "2rem 1.5rem",
    flexDirection: "column",
    justifyContent: "center",
    "& > * + *": {
      margin: { top: "2rem" },
    },
  },
  cover: {
    height: 200,
    borderRadius: 20,
    alignSelf: "center",
    filter: "contrast(0.9)",
    boxShadow: "rgba(0, 0, 0, 0.2) 0px 50px 20px -40px",
  },
  main: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& > * + *": {
      margin: { left: "1rem" },
    },
  },
});

function Playlist() {
  const classes = useStyle();
  const { name } = useParams();
  const ref = createRef<HTMLDivElement>();
  const [{ top }, setRect] = useState({} as DOMRect);

  const [queueOpen, setQueueOpen] = useState(false);
  const {
    openQueue,
    playSong,
    playSongAt,
    setShuffleMode,
  } = usePlaybackManager();

  const y = useMotionValue<any>(0);
  const alpha = useTransform<any>(y, [0, -(top / 2)], [0, 1]);
  const scale = useTransform<any>(y, [0, top, top + 100], [1, 1.5, 2]);

  const radius = useTransform<any>(alpha, (v) => v * 12);

  const { value, loading } = useAsync(async () => {
    const res = await getSongs(name);
    return res.map(createSong);
  }, [name]);

  const songWithImage = value && value.find(({ image }) => !!image);

  const open = () => {
    const songs = value as Song[];
    openQueue(songs);
  };

  useLayoutEffect(() => {
    const rect = ref.current?.getBoundingClientRect();
    setRect(rect as DOMRect);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <div className={classes.frame}>
        <Text variant="h2">{name}</Text>

        <div style={{ position: "relative" }}>
          <AlbumArt
            layoutId={name}
            style={{ scale }}
            song={songWithImage}
            className={classes.cover}
          />
          <FlatButton
            style={{
              top: 20,
              left: 20,
              width: "2.5rem",
              height: "2.5rem",
              padding: "0.7rem",
              borderRadius: 100,
              position: "absolute",
              backdropFilter: "blur(20px)",
              backgroundColor: "#ffffffc2",
            }}
            onClick={() => {
              open();
              playSongAt(0);
              setQueueOpen(true);
            }}
          >
            <Play size="100%" stroke="none" fill="#fff" />
          </FlatButton>
        </div>

        <Button
          className={classes.button}
          onClick={() => {
            open();
            playSongAt(0);
            setQueueOpen(true);
            setShuffleMode(ShuffleMode.SHUFFLE);
          }}
        >
          <span>Shuffle Play</span>
          <Shuffle size={20} />
        </Button>
      </div>
      <Frame
        y={y}
        drag="y"
        ref={ref}
        radius={20}
        width="100%"
        height="auto"
        dragElastic={0.2}
        position="relative"
        backgroundColor="none"
        className={classes.main}
        dragConstraints={{ top: -top, bottom: 0 }}
      >
        <Frame
          size="100%"
          opacity={alpha}
          radius={radius}
          style={{ zIndex: -1 }}
          backgroundColor="white"
        />
        {value &&
          value.map((song) => {
            return (
              <PlaylistTile
                song={song}
                key={song.id}
                onClick={() => {
                  if (!queueOpen) {
                    open();
                    setQueueOpen(true);
                  }

                  playSong(song);
                }}
              />
            );
          })}
      </Frame>
    </div>
  );
}

export default memo(Playlist);
