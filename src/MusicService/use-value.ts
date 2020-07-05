import { useRef, useState } from "react";
import MusicService, { service } from "./MusicService";
import { Events } from "./types";
import useEvent from "./use-event";

export default function useValue<T>(
  initial: T,
  event: Events,
  fn: (service: MusicService) => T
) {
  const ref = useRef(fn);
  const [state, setState] = useState(initial);

  useEvent(event, () => {
    setState(ref.current(service));
  });

  return state;
}
