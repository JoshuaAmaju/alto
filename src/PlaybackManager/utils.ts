import { randomRange } from "../utils";
import { RepeatMode, ShuffleMode } from "./types";

function isLastTrack(position: number, queueSize: number) {
  return position === queueSize - 1;
}

export function shufflePosition(shuffleMode: ShuffleMode, queueSize: number) {
  if (shuffleMode === ShuffleMode.SHUFFLE) return randomRange(0, queueSize);
}

export function getNextPosition(
  repeatMode: RepeatMode,
  shuffleMode: ShuffleMode,
  queueSize: number,
  currentPos: number,
  force: boolean
) {
  const shuffledPos = shufflePosition(shuffleMode, queueSize);

  if (shuffledPos) currentPos = shuffledPos;

  let position = currentPos + 1;
  const lastTrack = isLastTrack(position, queueSize);

  switch (repeatMode) {
    case RepeatMode.ALL:
      if (lastTrack) position = 0;
      break;
    case RepeatMode.CURRENT:
      if (force) {
        if (lastTrack) position = -1;
      } else {
        position -= 1;
      }
      break;
    case RepeatMode.NONE:
      if (lastTrack) position = -1;
      break;
  }

  return position;
}

export function getPreviousPosition(
  repeatMode: RepeatMode,
  shuffleMode: ShuffleMode,
  queueSize: number,
  currentPos: number,
  force: boolean
) {
  const prevPos = currentPos;
  const shuffledPos = shufflePosition(shuffleMode, queueSize);

  if (shuffledPos) currentPos = shuffledPos;

  let position = currentPos - 1;

  switch (repeatMode) {
    case RepeatMode.ALL:
      if (position < 0) position = queueSize - 1;
      break;
    case RepeatMode.NONE:
      if (position < 0) position = 0;
      break;
    case RepeatMode.CURRENT:
      if (force) {
        if (position < 0) {
          position = queueSize - 1;
        }
      } else {
        position = prevPos;
      }
      break;
  }

  return position;
}
