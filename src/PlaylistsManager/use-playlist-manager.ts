import { useContext } from "react";
import PlaylistsManagerContext from "./PlaylistsManagerContext";

export default function usePlaylists() {
  return useContext(PlaylistsManagerContext);
}
