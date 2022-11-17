import { getArtists, getArtistAlbums } from '../../lib/spotify';
import {getSession} from 'next-auth/react';

const handler = async (req, res) => {
  const {
    token: {accessToken},
  } = await getSession({req});
  let response = await getArtistAlbums(accessToken);
  response = res.status(200).json(response);
  return response;
};

export default handler;