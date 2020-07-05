import { useEffect, useState } from "react";
import { service } from "./MusicService";
import { Events } from "./types";

export default function useEventValue<T>(event: Events, initial?: T) {
  const [state, setState] = useState(initial);

  useEffect(() => {
    const unsubscribe = service.addEventListener(event, (value) => {
      setState(value as T);
    });

    return unsubscribe;
  }, [event]);

  return state;
}
