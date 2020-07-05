import { useContext } from "react";
import SongsManagerContext from "./SongsManagerContext";

export default function useSongsManager() {
  return useContext(SongsManagerContext);
}
