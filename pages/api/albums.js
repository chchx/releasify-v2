import { getArtists, getArtistAlbums } from '../../lib/spotify';
import {getSession} from 'next-auth/react';

const handler = async (req, res) => {
  const {
    token: {accessToken},
  } = await getSession({req});
  try {

    let response = await getArtistAlbums(accessToken);
    console.log('RESPONSE 1 IS...', response)
    response = res.status(200).json(response);
    // response = res.status(200).send(response);
    console.log('RESPONSE 2 IS...', response)
    return response;
  } catch (e) {
    console.error(e)
  }
};

export default handler;