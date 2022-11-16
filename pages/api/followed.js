import { getArtists, getFollowedArtists } from '../../lib/spotify';
import {getSession} from 'next-auth/react';

const handler = async (req, res) => {
  const {
    token: {accessToken},
  } = await getSession({req});

  let response = await getFollowedArtists(accessToken);
  // const response = await getArtists(accessToken);
  // console.log('outer response is....', response)

  // return response

  response = res.status(200).json(response);

  console.log(response)
  return response;
};

export default handler;