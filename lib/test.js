
const access_token = 'BQCjnGiyewEvioS88oChGnQRxVBYy1WkF1uad8Z6OXLZVWHXyYX5wZhZc7jlF3Q_Q7OjvHSQxKOJiwz7covge2ZsboqEcAJL9NQmjkmG2adFNASWpQr8_cnKXLAffb4i9J8LJVFKkM8eWDCYmP65LCLxNENdoqlWVhNc-bGkOleinsIlgYbAZJrSobQa00NRURaBXBUlgdMeHIKTjFdB3oI'

fetch('https://api.spotify.com/v1/me/following?' + new URLSearchParams({
    type: 'artist',
    // limit: 50,
    // after: cursor || null
  }),
  {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
  })
  .then((req) => console.log(req.json()))
