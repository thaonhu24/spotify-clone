import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { ExtendedSession, TokenError } from "../types";
import { spotifyApi } from "../config/spotify";

const useSpotify = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;
    if (
      (session as ExtendedSession).error === TokenError.RefreshAccessTokenError
    ) {
      signIn();
    }
    spotifyApi.setAccessToken((session as ExtendedSession).accessToken);
  }, [session]);
  return spotifyApi;
};

export default useSpotify;
