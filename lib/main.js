const createCalendar = (albumsArray, year) => {
  const calendar = {
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

  albumsArray.forEach((album) => {
    const releaseMonth = album.release_date.split('-')[1];
    const releaseYear = album.release_date.split('-')[0];

    const yearValid = releaseYear === String(year);

    if (releaseMonth === '01' && yearValid) calendar.January.push(album);
    if (releaseMonth === '02' && yearValid) calendar.February.push(album);
    if (releaseMonth === '03' && yearValid) calendar.March.push(album);
    if (releaseMonth === '04' && yearValid) calendar.April.push(album);
    if (releaseMonth === '05' && yearValid) calendar.May.push(album);
    if (releaseMonth === '06' && yearValid) calendar.June.push(album);
    if (releaseMonth === '07' && yearValid) calendar.July.push(album);
    if (releaseMonth === '08' && yearValid) calendar.August.push(album);
    if (releaseMonth === '09' && yearValid) calendar.September.push(album);
    if (releaseMonth === '10' && yearValid) calendar.October.push(album);
    if (releaseMonth === '11' && yearValid) calendar.November.push(album);
    if (releaseMonth === '12' && yearValid) calendar.December.push(album);
  });

  Object.keys(calendar).forEach((month) => {
    calendar[month] = calendar[month].filter((month, i, array) => array.findIndex(t => t.name === month.name) === i);
  });
  return calendar;
};

export default createCalendar;