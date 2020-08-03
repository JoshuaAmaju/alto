import React from "react";
import AppHeader from "../components/AppHeader";
import SongsList from "../components/SongsList";
import SongsPicker from "../components/SongsPicker";
import useSongsManager from "../SongsManager/use-songs-manager";
import Snackbar from "../components/Snackbar";

// const useStyle = createUseStyles({
//   lists: {
//     "& li": {
//       padding: "1.5rem",
//       listStyle: "none",
//       fontWeight: "bold",
//       position: "relative",
//       textTransform: "capitalize",
//     },
//     "& *:not(:first-child)": {
//       borderTop: "1px solid #ccc",
//     },
//   },
// });

export default function AllSongs() {
  const [show, setShow] = React.useState(true);
  const { songs, loading } = useSongsManager();

  React.useEffect(() => {
    if (!show) {
      setTimeout(() => setShow(true), 2000);
    }
  }, [show]);

  return (
    <div className="Page">
      <AppHeader title="Songs">
        <SongsPicker />
      </AppHeader>
      <SongsList songs={songs} />
      <Snackbar
        visible={show}
        onDismiss={() => setShow(false)}
        action={{ label: "retry", onPress: () => setShow(false) }}
      >
        Hello
      </Snackbar>
    </div>
  );
}
