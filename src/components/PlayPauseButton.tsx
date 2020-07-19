import React from "react";
import FlatButton from "./FlatButton";
import usePlaybackManager from "../PlaybackManager/use-playback-manager";
import { PlayStates } from "../PlaybackManager/types";
import { Pause, Play } from "react-feather";

interface PlayPauseButton extends FlatButton {
  fill?: boolean;
  color?: string;
  size?: string | number;
}

export default function PlayPauseButton({
  fill,
  onClick,
  size = 25,
  color = "initial",
  ...props
}: PlayPauseButton) {
  const { state, play, pause } = usePlaybackManager();

  const handleClick = () => {
    if (state === PlayStates.PLAYING) pause();
    if (state === PlayStates.SUSPENDED) play();
  };

  return (
    <FlatButton {...props} onClick={onClick ?? handleClick}>
      {state === PlayStates.PLAYING ? (
        <Pause
          size={size}
          stroke={fill ? "none" : color}
          fill={fill ? color : "initial"}
        />
      ) : (
        <Play
          size={size}
          stroke={fill ? "none" : color}
          fill={fill ? color : "initial"}
        />
      )}
    </FlatButton>
  );
}
