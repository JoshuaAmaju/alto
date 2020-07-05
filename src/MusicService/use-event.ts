import { useEffect, useRef } from "react";
import { service } from "./MusicService";
import { Events } from "./types";

export default function useEvent<T>(
  event: Events,
  callback: (...args: T[]) => void
) {
  const ref = useRef(callback);

  useEffect(() => {
    const unsubscribe = service.addEventListener(event, ref.current);
    return unsubscribe;
  }, [event]);
}
