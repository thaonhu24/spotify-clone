import NextAuth from "next-auth/next";
import SpotifyProvider from "next-auth/providers/spotify";
import { scopes, spotifyApi } from "../../../config/spotify";
import { CallbacksOptions } from "next-auth";
import { ExtendedToken, TokenError } from "../../../types";

const refreshAccessToken = async (token: ExtendedToken) => {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);
    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
    return {
      ...token,
      accessToken: refreshedToken.access_token,
      refreshtoken: refreshedToken.refresh_token,
      accessTokenExpireAt: Date.now() + refreshedToken.expires_in * 1000,
    };
  } catch (error) {
    console.log(error);
    return {
      ...token,
      error: TokenError.RefreshAccessTokenError,
    };
  }
};

const jwtCallback: CallbacksOptions["jwt"] = async ({
  token,
  account,
  user,
}) => {
  let extendedToken: ExtendedToken;
  if (account && user) {
    extendedToken = {
      ...token,
      user,
      accessToken: account.access_token as string,
      refreshToken: account.refresh_token as string,
      accessTokenExpireAt: (account.expires_at as number) * 1000,
    };
    return extendedToken;
  }

  if (Date.now() + 5000 < (token as ExtendedToken).accessTokenExpireAt) {
    return token;
  }

  return await refreshAccessToken(token as ExtendedToken);
};

const sessionCallback: CallbacksOptions["session"] = async ({
  session,
  token,
}) => {
  session.accessToken = (token as ExtendedToken).accessToken;
  session.error = (token as ExtendedToken).error;
  return session;
};

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
      authorization: {
        url: "https://accounts.spotify.com/authorize",
        params: {
          scope: scopes,
        },
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt: jwtCallback,
    session: sessionCallback,
  },
});
