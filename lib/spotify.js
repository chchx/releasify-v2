const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const PLAYLISTS_ENDPOINT = 'https://api.spotify.com/v1/me/playlists';

const getAccessToken = async (refresh_token) => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    }),
  });
  return response.json();
};


export const getArtists = async (refresh_token) => {
  const res = await findFollowedArtists(refresh_token)
  return res
}

const findFollowedArtists = async (refresh_token, cursor, data = []) => {
  if (cursor === null) {
    return data
  }
  if (cursor === undefined) {
    return fetch('https://api.spotify.com/v1/me/following?' + new URLSearchParams({
      type: 'artist',
      limit: 50,
    }), {
      headers: {
        Authorization: `Bearer ${refresh_token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
    })
    .then( (res) => res.json())
    .then( (obj) => {
      data = data.concat(obj.artists.items)
      return findFollowedArtists(refresh_token, obj.artists.cursors.after, data)
    })
  } else {
    return fetch('https://api.spotify.com/v1/me/following?' + new URLSearchParams({
      type: 'artist',
      limit: 50,
      after: cursor
    }), {
      headers: {
        Authorization: `Bearer ${refresh_token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
    })
    .then( (res) => res.json())
    .then( (obj) => {
      // console.log('obj is...', obj)
      // data.push(obj.artists.items)
      data = data.concat(obj.artists.items)
      // console.log('DATA IS...', data)
      return findFollowedArtists(refresh_token, obj.artists.cursors.after, data)
    })
  }
}

export const getArtistAlbums = async (refresh_token) => {
  const { access_token } = await getAccessToken(refresh_token);

  return getArtists(access_token)
    .then((result) => {
      // console.log('final data is...', result);
      // setArtistIds(result.map((artistData) => artistData.id));
      // console.log('RESULT IS...', result, '...result')
      let artistIds = result.map((artistData) => artistData.id);
      // console.log('MAPPED IS...', mapped)
      return artistIds;
    })
    .then((artistIds) => Promise.all(artistIds.map((item) => {
        return fetch(`https://api.spotify.com/v1/artists/${item}/albums?` + new URLSearchParams({
          include_groups: 'album',
          limit: 50
        }), {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        })
          .then((res) => {
            return res.json()
          })
          .then((data) => {
            return data.items
          });

    })))
    .then((albums) => {
      const albumArray = albums.flat();
      return albumArray
    //   console.log(albumArray)
    //   // setAlbumData(albumData.concat(albumArray));
    //   // setAlbumCalendar(createCalendar(albumArray, year));
    })

};

export const getUsersPlaylists = async (refresh_token) => {
  const { access_token } = await getAccessToken(refresh_token);
  return fetch(PLAYLISTS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};