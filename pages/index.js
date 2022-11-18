import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { getArtistAlbums } from '../lib/spotify.js';
import NavArrow from '../components/NavArrow.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import createCalendar from '../lib/main.js';
import { Helmet } from 'react-helmet';


export default function Home() {
  const { data: session, status, clear } = useSession();
  const [albumData, setAlbumData] = useState([]);
  const [albumCalendar, setAlbumCalendar] = useState({});
  const [year, setYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (Object.keys(albumData).length > 0) {
      setAlbumCalendar(createCalendar(albumData, year));
    }
  }, [year]);

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, []);

  const arrowHandler = (e) => {
    console.log(e.target.id)
    if (e.target.id === 'left-arrow') {
      setYear(year - 1);
    }
    if (e.target.id === 'right-arrow') {
      setYear(year + 1);
    }
  };

  const keyHandler = (e) => {
    if (e.key === 'ArrowLeft') {
      setYear(year - 1);
    }
    if (e.key === 'ArrowRight') {
      if (year < 2022) {
        setYear(year + 1);
      }
    }
  };

  const routeHandler = async (e) => {
    e.preventDefault()

    await setIsLoading(true);

    fetch('/api/albums')
      .then((res) => res.json())
      .then((albums) => {
        albums = albums.filter(n => n)
        setAlbumData(albumData.concat(albums));
        setAlbumCalendar(createCalendar(albums, year));
      })
      .then(() => {
        setIsLoading(false)
      })
      .catch((e) => {
        console.error(e)
        setIsLoading(false)
      })
  }

  return (
    <div className="App" tabIndex={0} onKeyDown={keyHandler}>
      <Helmet>
        <meta name="google-site-verification" content="PNMlCkd59hDkbYT2xlMOht3vv5b6kMJh1aWT32LfSuc" />
      </Helmet>
      <header className="App-header">
        <h1>Releasify</h1>
        <h3>BETA</h3>
      </header>
      {Object.keys(albumData).length > 0 ?
        <main>
          {Object.keys(albumCalendar).length > 1
            && <h2>{year}</h2>}
          {albumData.length > 0 &&
            <NavArrow arrowHandler={arrowHandler} direction="left-arrow" />
          }
          <div className="timeline-wrapper">
            <div className="row-container">
              <div className="timeline-row">
                {Object.keys(albumCalendar).map((month, index) => {
                  if (index <= 5) {
                    return (
                      <div className="month-container">
                        <div className="month-title">{month}</div>
                        <ol>
                          {albumCalendar[month].map((album, array) => {
                            return <li><a href={album.external_urls.spotify}>{album.name}</a> by {album.artists[0].name}</li>
                          })}
                        </ol>
                      </div>
                    );
                  }
                })}
              </div>
              <div className="timeline-row">
                {Object.keys(albumCalendar).map((month, index) => {
                  if (index > 5) {
                    return (
                      <div className="month-container">
                        <div className="month-title">{month}</div>
                        <ol>
                          {albumCalendar[month].map((album, array) => {
                            return <li><a href={album.external_urls.spotify}>{album.name}</a> by {album.artists[0].name}</li>
                          })}
                        </ol>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </div>
          {year < 2022
            && <NavArrow arrowHandler={arrowHandler} direction="right-arrow" />
          }
        </main>
        : ''
      }
      <div className="button-wrapper">
        {session
          ? <div className="button-container">
            {
              isLoading ? <LoadingSpinner /> : ''
            }
            {
              Object.keys(albumData).length === 0 ?
                <button onClick={routeHandler} disabled={isLoading}>Load timeline</button>
                : ''
            }
            <button onClick={() => signOut()}>Logout</button>
            Signed in as {session?.token?.email} <br />
          </div>
          : <div>
            <button onClick={() => signIn()}>Connect Spotify</button>
          </div>}
      </div>

      <footer>
        <p>Made with ❤️ by <a href="https://github.com/chchx">@chchx</a></p>
      </footer>
    </div>
  )
}
