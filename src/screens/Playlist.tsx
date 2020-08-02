import { Frame, useMotionValue, useTransform } from "framer";
import { AnimatePresence, motion } from "framer-motion";
import React, {
  createRef,
  memo,
  RefObject,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { Play, Shuffle } from "react-feather";
import { createUseStyles } from "react-jss";
import { useHistory, useParams } from "react-router-dom";
import AlbumArt from "../components/AlbumArt";
import Button from "../components/Button";
import FlatButton from "../components/FlatButton";
import SongsList from "../components/SongsList";
import Text from "../components/Text";
import usePlaybackManager from "../PlaybackManager/use-playback-manager";
import usePlaylists from "../PlaylistsManager/use-playlist-manager";
import { ShuffleMode } from "../QueueService/types";
import { Song } from "../types";

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
  header: {
    padding: "1rem",
    "& button": {
      display: "flex",
      alignItems: "center",
    },
    "& *": {
      margin: 0,
      padding: 0,
    },
  },
});

function useDOMRect<T extends HTMLElement>(ref: RefObject<T>) {
  const [rect, setRect] = useState({} as DOMRect);

  useLayoutEffect(() => {
    const rect = ref.current?.getBoundingClientRect();
    setRect(rect as DOMRect);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return rect;
}

function Playlist() {
  const classes = useStyle();
  const { name } = useParams();
  const { goBack } = useHistory();
  const ref = createRef<HTMLDivElement>();
  const ref2 = createRef<HTMLDivElement>();
  const { top, height } = useDOMRect(ref);

  const rect = useDOMRect(ref2);

  const [queueOpen, setQueueOpen] = useState(false);

  const { playlistsMap } = usePlaylists();

  const { openQueue, playSongAt, setShuffleMode } = usePlaybackManager();

  const ratio = useMemo(() => {
    const { bottom, height } = rect;
    return Math.max(bottom, height) - Math.min(bottom, height);
  }, [rect]);

  const diff = useMemo(() => {
    const topHeight = top + height;
    return window.innerHeight - topHeight;
  }, [top, height]);

  const y = useMotionValue<any>(0);
  const alpha = useTransform<any>(y, [0, -ratio], [0, 1]);
  const scale = useTransform<any>(y, [0, top, top + 100], [1, 1.5, 2]);

  const radius = useTransform<any>(alpha, (v) => v * 12);

  const { label, songs, coverUrl } = useMemo(() => {
    return playlistsMap[name] ?? {};
  }, [name, playlistsMap]);

  const open = () => {
    openQueue(songs as Song[]);
  };

  return (
    <div className="Page">
      <div className={classes.header}>
        <FlatButton onClick={goBack}>
          <AnimatePresence>
            <motion.svg
              width={35}
              height={35}
              fill="none"
              stroke-width="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              exit={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              initial={{ x: -30, opacity: 0 }}
              xmlns="http://www.w3.org/2000/svg"
              transition={{ damping: 15, type: "spring" }}
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </motion.svg>
          </AnimatePresence>
          <motion.h2 layoutId="playlists">Playlists</motion.h2>
        </FlatButton>
      </div>
      <div ref={ref2} className={classes.frame}>
        <div style={{ position: "relative" }}>
          <AlbumArt
            url={coverUrl}
            layoutId={name}
            style={{ scale }}
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
              if (!queueOpen) open();
              playSongAt(0);
              setQueueOpen(true);
            }}
          >
            <Play size="100%" stroke="none" fill="#fff" />
          </FlatButton>
        </div>

        <div>
          <Text variant="h2">{name}</Text>
          <Text variant="h4">{label}</Text>
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
        dragConstraints={{
          bottom: 0,
          top: diff < 0 ? diff : 0,
          // top: -(
          //   Math.max(window.innerHeight, topHeight) -
          //   Math.min(window.innerHeight, topHeight)
          // ),
        }}
      >
        <Frame
          size="100%"
          opacity={alpha}
          radius={radius}
          style={{ zIndex: -1 }}
          backgroundColor="white"
        />
        {songs && <SongsList songs={songs} />}
      </Frame>
    </div>
  );
}

export default memo(Playlist);
