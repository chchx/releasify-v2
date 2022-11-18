const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const PLAYLISTS_ENDPOINT = 'https://api.spotify.com/v1/me/playlists';

const getAccessToken = async (refresh_token) => {
  try {
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
  } catch (e) {
    console.error(e)
  }
};

export const getArtists = async (refresh_token) => {
  try {
    const res = await findFollowedArtists(refresh_token)
    // Removes null entries
    // console.log('res at get...', res)
    return res.filter(n => n)
  } catch (e) {
    console.error(e)
  }
}

const delay = ms => new Promise(res => setTimeout(res, ms));

const findFollowedArtists = async (refresh_token, cursor, data = []) => {
  // recursive function
  if (cursor === null) {
    return data
  }
  if (cursor === undefined) {
    await delay(2)
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
      .then((res) => res.json())
      .then((obj) => {
        data = data.concat(obj.artists.items)
        return findFollowedArtists(refresh_token, obj.artists.cursors.after, data)
      })
      .catch((e) => console.error(e))
  } else {
    await delay(2)
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
      .then((res) => res.json())
      .then((obj) => {
        data = data.concat(obj.artists.items)
        return findFollowedArtists(refresh_token, obj.artists.cursors.after, data)
      })
      .catch((e) => console.error(e))
  }
}

const requestAsync = (artistId, access_token) => new Promise((resolve, reject) => {
  console.log('in promise')
  fetch(`https://api.spotify.com/v1/artists/${artistId}/albums?` + new URLSearchParams({
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
      console.log('in res', res)
      return res.json()
    })
    .then((final) => {
      console.log('final is...', final)
      resolve(final.items)
    })
});

export const getArtistAlbums = async (refresh_token) => {
  const { access_token } = await getAccessToken(refresh_token);

  return getArtists(access_token)
    .then((result) => {
      let artistIds = result.map((artistData) => artistData.id);
      console.log('artists ids are...', artistIds)
      return artistIds;
      // e.g. ['041iTeoMIwXMlShuQPIVKo', '06EfEcjc0vdvI6VNL0soIO', '06cLuOP0p7VAnBnqil1eWX','0CKa42Jqrc9fSFbDjePaXP', '0Cd6nHYwecCNM1sVEXKlYr', '0Fn4agIyGMwQsKHrx1i8Dn']
    })
    .then(async (artistIds) => {
      console.log('in artistIds')
      const data = [];
      try {
        // console.log('data is...', data)
        for (const artistId of artistIds) {
          // console.log('artistId is ', artistId)
          data.push(await requestAsync(artistId, access_token))
          // console.log('delaying...')
          await delay(2);
          // console.log('data is ', data)
        }
        console.log('data is...', data)
        return data.flat()
      } catch (err) {
        console.error(err)
      }
    })
    // .then((artistIds) => {
    //   let delay = 0;
    //   const delayIncrement = 1000;

    //   Promise.all(artistIds.map(async (item) => {
    //     delay += delayIncrement;
    //     return new Promise(resolve => setTimeout(resolve, delay))
    //       .then(() =>
    //         fetch(`https://api.spotify.com/v1/artists/${item}/albums?` + new URLSearchParams({
    //           include_groups: 'album',
    //           limit: 50
    //         }), {
    //           headers: {
    //             Authorization: `Bearer ${access_token}`,
    //             'Content-Type': 'application/json',
    //             Accept: 'application/json',
    //           },
    //         }))
    //       .then((res) => {
    //         console.log('INNER RES IS...', res)
    //         return res.json()
    //       })
    //       .then((data) => {
    //         console.log('data at get...', data)
    //         return data.items
    //       })
    //       .catch((e) => console.error(e));
    //   }))
    // })
  // .then((albums) => {
  //   const albumArray = albums.flat();
  //   return albumArray
  // })
  // .catch((e) => console.error(e))
};

// test function for /api/playlists
export const getUsersPlaylists = async (refresh_token) => {
  const { access_token } = await getAccessToken(refresh_token);
  return fetch(PLAYLISTS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};