import { getArtists, getFollowedArtists } from '../../lib/spotify';
import {getSession} from 'next-auth/react';

const handler = async (req, res) => {
  const {
    token: {accessToken},
  } = await getSession({req});

  // const response = await getFollowedArtists(accessToken);
  const response = await getArtists(accessToken);
  // console.log('outer response is....', response)

  // return response

  return res.status(200).json(response);

};

export default handler;