import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { IPlaylistContext, PlaylistContextState } from "../types";
import useSpotify from "../hooks/useSpotify";
import { useSession } from "next-auth/react";

const defaultPlaylistContextState: PlaylistContextState = {
  playlists: [],
};

export const PlaylistContext = createContext<IPlaylistContext>({
  playlistContextState: defaultPlaylistContextState,
});

export const usePlaylistContext = () => useContext(PlaylistContext);

export const PlaylistContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [playlistContextState, setPlaylistContextState] = useState(
    defaultPlaylistContextState
  );
  const spotifyApi = useSpotify();
  const { data: session } = useSession();

  useEffect(() => {
    const getUserPlaylist = async () => {
      const userPlaylistResponse = await spotifyApi.getUserPlaylists();
      setPlaylistContextState({ playlists: userPlaylistResponse.body.items });
      console.log({ userPlaylistResponse });
    };
    if (spotifyApi.getAccessToken()) {
      getUserPlaylist();
    }
  }, [spotifyApi, session]);

  const playlistContextProviderData = {
    playlistContextState,
  };
  return (
    <PlaylistContext.Provider value={playlistContextProviderData}>
      {children}
    </PlaylistContext.Provider>
  );
};
