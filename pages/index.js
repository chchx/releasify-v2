import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { getArtistAlbums } from '../lib/spotify.js';

export default function Home() {
  const { data: session, status } = useSession();
  const [albumData, setAlbumData] = useState([]);
  const [albumCalendar, setAlbumCalendar] = useState({});
  const [year, setYear] = useState(2022);

  useEffect(() => {
    if (Object.keys(albumData).length > 0) {
      setAlbumCalendar(createCalendar(albumData, year));
    }
  }, [year]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  const arrowHandler = (e) => {
    console.log(e.target.id)
    if (e.target.id === 'left-arrow') {
      setYear(year - 1);
      // setAlbumCalendar(createCalendar(albumData, year));
    }
    if (e.target.id === 'right-arrow') {
      setYear(year + 1);
    }
    // setAlbumCalendar(createCalendar(albumData, year));
  };

  const keyHandler = (e) => {
    if (e.key === 'ArrowLeft') {
      setYear(year - 1);
      // setAlbumCalendar(createCalendar(albumData, year));
    }
    if (e.key === 'ArrowRight') {
      if (year < 2022) {
        setYear(year + 1);
      }
    }
  };

  const createCalendar = (albumArray, year) => {
    const calendarObj = {
      January: [],
      February: [],
      March: [],
      April: [],
      May: [],
      June: [],
      July: [],
      August: [],
      September: [],
      October: [],
      November: [],
      December: [],
    };

    albumArray.forEach((album) => {
      const releaseMonth = album.release_date.split('-')[1];
      const releaseYear = album.release_date.split('-')[0];

      const yearValid = releaseYear === String(year);

      if (releaseMonth === '01' && yearValid) calendarObj.January.push(album);
      if (releaseMonth === '02' && yearValid) calendarObj.February.push(album);
      if (releaseMonth === '03' && yearValid) calendarObj.March.push(album);
      if (releaseMonth === '04' && yearValid) calendarObj.April.push(album);
      if (releaseMonth === '05' && yearValid) calendarObj.May.push(album);
      if (releaseMonth === '06' && yearValid) calendarObj.June.push(album);
      if (releaseMonth === '07' && yearValid) calendarObj.July.push(album);
      if (releaseMonth === '08' && yearValid) calendarObj.August.push(album);
      if (releaseMonth === '09' && yearValid) calendarObj.September.push(album);
      if (releaseMonth === '10' && yearValid) calendarObj.October.push(album);
      if (releaseMonth === '11' && yearValid) calendarObj.November.push(album);
      if (releaseMonth === '12' && yearValid) calendarObj.December.push(album);
    });

    console.log(calendarObj)

    Object.keys(calendarObj).forEach((month) => {
      calendarObj[month] = calendarObj[month].filter((month, i, array) => array.findIndex(t => t.name === month.name) === i);
    });
    return calendarObj;
  };

  // if (session) {
  //   return (
  //     <>
  //       Signed in as {session?.token?.email} <br />
  //       <button onClick={() => signOut()}>Sign out</button>
  //     </>
  //   );
  // }
  // return (
  //   <>
  //     Not signed in <br />
  //     <button onClick={() => signIn()}>Sign in</button>
  //   </>
  // );

  return (
    <div className="App" tabIndex={0} onKeyDown={keyHandler}>
      <header className="App-header">
        <h1>Releasify</h1>

      </header>
      <main>
        {Object.keys(albumCalendar).length > 1
          && <h2>{year}</h2>}
        {albumData.length > 0 &&
          <svg xmlns="http://www.w3.org/2000/svg" onClick={arrowHandler} className="left-arrow" width="7vw" height="7vh" fill="white" viewBox="7 5 6 9.99">
            <path id="left-arrow" fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" fillOpacity="75%"></path>
          </svg>
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
          && <svg xmlns="http://www.w3.org/2000/svg" onClick={arrowHandler} className="right-arrow" fill="white" width="7vw" height="7vh" viewBox="7 5.01 6 9.99">
            <path id="right-arrow" fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" fillOpacity="75%"></path>
          </svg>
        }
      </main>
      {session
        ? <div>
          {/* <button onClick={getArtistAlbums}>Load timeline</button> */}
          <div className="logout-container">
            <button onClick={signOut()}>Logout</button>
            Signed in as {session?.token?.email} <br />
          </div>
        </div>
        : <div>
          Not signed in <br />
          <button onClick={() => signIn()}>Sign in</button>
        </div>}

      <footer>
        <p>Made with ❤️ by <a href="https://github.com/chrisxchoi">@chrisxchoi</a></p>
      </footer>
    </div>
  )
}

// import Head from 'next/head'
// import Image from 'next/image'
// import styles from '../styles/Home.module.css'

// export default function Home() {
//   return (
//     <div className={styles.container}>
//       <Head>
//         <title>Create Next App</title>
//         <meta name="description" content="Generated by create next app" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <main className={styles.main}>
//         <h1 className={styles.title}>
//           Welcome to <a href="https://nextjs.org">Next.js!</a>
//         </h1>

//         <p className={styles.description}>
//           Get started by editing{' '}
//           <code className={styles.code}>pages/index.js</code>
//         </p>

//         <div className={styles.grid}>
//           <a href="https://nextjs.org/docs" className={styles.card}>
//             <h2>Documentation &rarr;</h2>
//             <p>Find in-depth information about Next.js features and API.</p>
//           </a>

//           <a href="https://nextjs.org/learn" className={styles.card}>
//             <h2>Learn &rarr;</h2>
//             <p>Learn about Next.js in an interactive course with quizzes!</p>
//           </a>

//           <a
//             href="https://github.com/vercel/next.js/tree/canary/examples"
//             className={styles.card}
//           >
//             <h2>Examples &rarr;</h2>
//             <p>Discover and deploy boilerplate example Next.js projects.</p>
//           </a>

//           <a
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
//             className={styles.card}
//           >
//             <h2>Deploy &rarr;</h2>
//             <p>
//               Instantly deploy your Next.js site to a public URL with Vercel.
//             </p>
//           </a>
//         </div>
//       </main>

//       <footer className={styles.footer}>
//         <a
//           href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Powered by{' '}
//           <span className={styles.logo}>
//             <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
//           </span>
//         </a>
//       </footer>
//     </div>
//   )
// }
