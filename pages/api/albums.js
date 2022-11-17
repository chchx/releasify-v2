import { getArtists, getArtistAlbums } from '../../lib/spotify';
import {getSession} from 'next-auth/react';

const handler = async (req, res) => {
  const {
    token: {accessToken},
  } = await getSession({req});
  // console.log('req...', req)
  // console.log('{req}...', {req})

  let response = await getArtistAlbums(accessToken);

  response = res.status(200).json(response);

  console.log(response)
  return response;
};

export default handler;