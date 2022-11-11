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

export const getUsersPlaylists = async (refresh_token) => {
  const { access_token } = await getAccessToken(refresh_token);
  return fetch(PLAYLISTS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export const getArtists = async (refresh_token) => {

  const { access_token } = await getAccessToken(refresh_token);
  const res = explore(access_token)
  console.log('RES IS', res)
}

export const explore = async (refresh_token, cursor, data = []) => {
  if (cursor === null) {
    console.log('RETURNING DATA...', data)
    return data
  }

  // const { access_token } = await getAccessToken(refresh_token);

  if (cursor === undefined) {
    fetch('https://api.spotify.com/v1/me/following?' + new URLSearchParams({
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
      // console.log('obj is...', obj)
      data.push(obj.artists.items)
      // console.log('DATA IS...', data)
      return explore(refresh_token, obj.artists.cursors.after, data)
    })
  } else {
    fetch('https://api.spotify.com/v1/me/following?' + new URLSearchParams({
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
      data.push(obj.artists.items)
      // console.log('DATA IS...', data)
      return explore(refresh_token, obj.artists.cursors.after, data)
    })
  }
  // .then((res) => res.json())
  // .then((data) => {
  //   getArtists(access_token, data.artists.cursors.after, data)
  // }
  // )
  // const res_json = await response.json()
  // console.log('res is...', res_json)
  // data.push(res_json.artists.items)
  // console.log('data is...', data)

  // getArtists(access_token, res_json.artists.cursors.after, data)
}

const getFollowedArtists = async (e) => {
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
      console.log(albumArray)
      // setAlbumData(albumData.concat(albumArray));
      // setAlbumCalendar(createCalendar(albumArray, year));
    });
};



// const getArtists = (cursor, data = []) => axios.get('https://api.spotify.com/v1/me/following', {
//   headers: {
//     Authorization: `Bearer ${token}`,
//   },
//   params: {
//     type: 'artist',
//     limit: 50,
//     after: cursor || null,
//   },
// }) // API supports a cursor param (?after=)
//   .then((response) => {
//     console.log('first response is...', response);
//     console.log('CURSOR IS...', response.data.artists.cursors.after);
//     data.push(...response.data.artists.items);
//     if (response.data.artists.cursors.after === null) return data;
//     return getArtists(response.data.artists.cursors.after, data);
//   });

// const getFollowedArtists = async (e) => {
//   getArtists()
//     .then((result) => {
//       console.log('final data is...', result);
//       // setArtistIds(result.map((artistData) => artistData.id));
//       return result.map((artistData) => artistData.id);
//     })
//     .then((mappedIds) => Promise.all(mappedIds.map(async (item) => {
//       let response;
//       try {
//         response = await axios.get(`https://api.spotify.com/v1/artists/${item}/albums`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           params: {
//             include_groups: 'album',
//           },
//         });
//       } catch (err) {
//         return err;
//       }
//       return response.data.items;
//     })))
//     .then((albums) => {
//       const albumArray = albums.flat();
//       console.log(albumArray)
//       // setAlbumData(albumData.concat(albumArray));
//       // setAlbumCalendar(createCalendar(albumArray, year));
//     });
// };


