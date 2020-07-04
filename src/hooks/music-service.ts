import { useEffect, useRef, useState } from "react";
import { Events } from "../services/MusicService/types";
import MusicService, { service } from "../services/MusicService/MusicService";

export function useValue<T>(
  initial: T,
  event: Events,
  fn: (service: MusicService) => T
) {
  const ref = useRef(fn);
  const [state, setState] = useState(initial);

  useEffect(() => {
    const unsubscribe = service.addEventListener(event, () => {
      setState(ref.current(service));
    });

    return unsubscribe;
  }, [event]);

  return state;
}

export function useEventValue<T>(event: Events, initial?: T) {
  const [state, setState] = useState(initial);

  useEffect(() => {
    const unsubscribe = service.addEventListener(event, (value) => {
      setState(value as T);
    });

    return unsubscribe;
  }, [event]);

  return state;
}

export function useServiceCallback(event: Events, callback: VoidFunction) {
  const ref = useRef(callback);

  useEffect(() => {
    const unsubscribe = service.addEventListener(event, ref.current);
    return unsubscribe;
  }, [event]);
}
