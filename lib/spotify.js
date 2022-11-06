import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(path.dirname(''), '../.env')})

import querystring from 'querystring';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`

const getAccessToken = async () => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token
    })
  })

  return response.json();
}

const getArtists = async (cursor, data = []) => {
  const { access_token } = await getAccessToken();

  return axios.get('https://api.spotify.com/v1/me/following', {
  headers: {
    Authorization: `Bearer ${access_token}`,
  },
  params: {
    type: 'artist',
    limit: 50,
    after: cursor || null,
  },
}) // API supports a cursor param (?after=)
  .then((response) => {
    console.log('first response is...', response);
    console.log('CURSOR IS...', response.data.artists.cursors.after);
    data.push(...response.data.artists.items);
    if (response.data.artists.cursors.after === null) return data;
    return getArtists(response.data.artists.cursors.after, data);
  })
};

const getFollowedArtists = async (e) => {
  e.preventDefault();

  getArtists()
    .then((result) => {
      console.log('final data is...', result);
      // setArtistIds(result.map((artistData) => artistData.id));
      return result.map((artistData) => artistData.id);
    })
    .then((mappedIds) => Promise.all(mappedIds.map(async (item) => {
      let response;
      try {
        response = await axios.get(`https://api.spotify.com/v1/artists/${item}/albums`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            include_groups: 'album',
          },
        });
      } catch (err) {
        return err;
      }
      return response.data.items;
    })))
    .then((albums) => {
      const albumArray = albums.flat();
      setAlbumData(albumData.concat(albumArray));
      setAlbumCalendar(createCalendar(albumArray, year));
    });
};

console.log('client is...', client_id)
console.log('secret is...', client_secret)
console.log(basic)
console.log(getAccessToken().then((res) => console.log(res)))