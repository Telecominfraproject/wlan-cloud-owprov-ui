const UNITS = {
  year: 24 * 60 * 60 * 1000 * 365,
  month: (24 * 60 * 60 * 1000 * 365) / 12,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000,
};

const RTF = new Intl.RelativeTimeFormat('en', { localeMatcher: 'best fit', style: 'long' });

const twoDigitNumber = (number) => {
  if (number >= 10) {
    return number;
  }
  return `0${number}`;
};

const unixToDateString = (unixNumber) => unixNumber * 1000;

export const compactDate = (dateString) => {
  if (!dateString || dateString === null) return '-';
  const convertedTimestamp = unixToDateString(dateString);
  const date = new Date(convertedTimestamp);
  return `${date.getFullYear()}-${twoDigitNumber(date.getMonth() + 1)}-${twoDigitNumber(
    date.getDate(),
  )}
  ${twoDigitNumber(date.getHours())}:${twoDigitNumber(date.getMinutes())}:${twoDigitNumber(
    date.getSeconds(),
  )}`;
};

export const formatDaysAgo = (d1, d2 = new Date()) => {
  const convertedTimestamp = unixToDateString(d1);
  const date = new Date(convertedTimestamp);
  const elapsed = date - d2;

  for (const [key] of Object.entries(UNITS))
    if (Math.abs(elapsed) > UNITS[key] || key === 'second')
      return RTF.format(Math.round(elapsed / UNITS[key]), key);

  return compactDate(date);
};

export const compactSecondsToDetailed = (seconds, t) => {
  if (!seconds || seconds === 0) return `0 ${t('common.seconds')}`;
  let secondsLeft = seconds;
  const days = Math.floor(secondsLeft / (3600 * 24));
  secondsLeft -= days * (3600 * 24);
  const hours = Math.floor(secondsLeft / 3600);
  secondsLeft -= hours * 3600;
  const minutes = Math.floor(secondsLeft / 60);
  secondsLeft -= minutes * 60;

  let finalString = '';

  finalString =
    days === 1
      ? `${finalString}${days} ${t('common.day')}, `
      : `${finalString}${days} ${t('common.days')}, `;
  finalString = `${finalString}${twoDigitNumber(hours)}:`;
  finalString = `${finalString}${twoDigitNumber(minutes)}:`;
  finalString = `${finalString}${twoDigitNumber(secondsLeft)}`;

  return finalString;
};
