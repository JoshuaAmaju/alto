import React, { createRef, useState, useEffect, ReactText } from "react";
import { useAsync } from "react-use";
import { useParams } from "react-router-dom";
import { getSongs } from "../services/playlist.service";
import { Song } from "../types";
import { Frame, useMotionValue, useTransform, MotionValue } from "framer";
import { useMeasure } from "react-use";
import { createSong } from "../utils";
import PlaylistTile from "../components/PlaylistTile";
import AlbumArt from "../components/AlbumArt";

export default function Playlist() {
  const { name } = useParams();
  const ref = createRef<HTMLDivElement>();
  const [{ top, bottom, height }, setRect] = useState({} as DOMRect);

  const y = useMotionValue<any>(0);
  const scale = useTransform<any>(y, [0, 300, 400], [1, 1.5, 2]);

  const { value, loading } = useAsync(async () => {
    const res = await getSongs(name);
    return res.map(createSong);
  }, [name]);

  const songWithImage = value && value.find(({ image }) => !!image);

  useEffect(() => {
    const rect = ref.current?.getBoundingClientRect();
    setRect(rect as DOMRect);
  }, []);

  console.log(top, bottom, height);

  return (
    <div>
      <Frame width="100%" height={300} scale={scale}>
        <AlbumArt song={songWithImage} />
      </Frame>
      <Frame
        y={y}
        drag="y"
        ref={ref}
        top={270}
        radius={20}
        width="100%"
        height="auto"
        dragElastic={0.2}
        position="relative"
        backgroundColor="white"
        dragConstraints={{ top: -top, bottom: 0 }}
      >
        {value &&
          value.map((song) => {
            return <PlaylistTile key={song.id} song={song} />;
          })}
      </Frame>
    </div>
  );
}
