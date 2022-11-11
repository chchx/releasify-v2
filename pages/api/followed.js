import { getArtists } from '../../lib/spotify';
import {getSession} from 'next-auth/react';

const handler = async (req, res) => {
  const {
    token: {accessToken},
  } = await getSession({req});

  const response = await getArtists(accessToken);
  console.log('outer response is....', response)
  // console.log('before .json is called: ', response.body)

  // const items = await response.json();

  // return res.status(200).json({items});

  // getArtists(accessToken)
};

export default handler;