import { Color } from "framer";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import React, {
  createRef,
  RefObject,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Play, Shuffle } from "react-feather";
import { createUseStyles } from "react-jss";
import { usePalette } from "react-palette";
import { useHistory, useParams } from "react-router-dom";
import { useScroll } from "react-use";
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
  sticky: {
    top: 0,
    position: "sticky",
  },
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
    boxShadow: ({ color }) => `0px 50px 20px -40px ${color}`,
  },
  main: {
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ({ muted }) => muted,
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
  const { name } = useParams();
  const { goBack } = useHistory();

  const heroRef = createRef<HTMLDivElement>();
  const pageRef = useRef<HTMLDivElement>(null);
  const listWrapperRef = createRef<HTMLDivElement>();

  const rect = useDOMRect(heroRef);
  const { top } = useDOMRect(listWrapperRef);

  const { playlistsMap } = usePlaylists();
  const [queueOpen, setQueueOpen] = useState(false);
  const { openQueue, playSongAt } = usePlaybackManager();

  // This calculates the available scrollable space of
  // the songs list for animating its background opacity
  // during drag.
  const ratio = useMemo(() => {
    const { bottom, height } = rect;
    return Math.max(bottom, height) - Math.min(bottom, height);
  }, [rect]);

  const { y: scrollY } = useScroll(pageRef);

  const y = useMotionValue(scrollY);
  const radius = useTransform(y, [0, ratio], [0, 20]);
  const scale = useTransform(y, [0, -(top + 100)], [1, 2]);

  const backgroundColor = useTransform(
    y,
    [0, ratio],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 1)"]
  );

  const { label, songs, coverUrl } = useMemo(() => {
    return playlistsMap[name] ?? {};
  }, [name, playlistsMap]);

  const { image } = useMemo(() => {
    return (songs?.find(({ image }) => !!image) ?? {}) as Song;
  }, [songs]);

  const {
    data: { muted = "blue", vibrant = "#000" },
  } = usePalette(image ? coverUrl : "");

  let color = Color.alpha(Color(vibrant), 0.4);

  const classes = useStyle({ muted, color: color.toValue() });

  const open = (shuffle?: ShuffleMode) => {
    openQueue(songs as Song[], shuffle);
  };

  useEffect(() => {
    y.set(scrollY);
  }, [y, scrollY]);

  return (
    <div className="Page" ref={pageRef}>
      <div className={classes.sticky}>
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
        <div ref={heroRef} className={classes.frame}>
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
              open(ShuffleMode.SHUFFLE);
              playSongAt(0);
              setQueueOpen(true);
            }}
          >
            <span>Shuffle Play</span>
            <Shuffle size={20} />
          </Button>
        </div>
      </div>
      <motion.div
        ref={listWrapperRef}
        className={classes.main}
        style={{
          backgroundColor,
          borderTopLeftRadius: radius,
          borderTopRightRadius: radius,
        }}
      >
        {songs && <SongsList songs={songs} color={muted} />}
      </motion.div>
    </div>
  );
}

export default Playlist;
