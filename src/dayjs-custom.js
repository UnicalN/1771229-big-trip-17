import dayjs from 'dayjs';
export const getTimeFromIso = (isoDate) => dayjs(isoDate).format('HH:mm');
export const getDateFromIso = (isoDate) => dayjs(isoDate).format('MMM DD');

export const getDurationFromIso = (start, finish) => {
  const duration = {
    minutes:  (dayjs(finish).diff(dayjs(start), 'm')) % 60,
    hours: (dayjs(finish).diff(dayjs(start), 'H')) % 24,
    days: (dayjs(finish).diff(dayjs(start), 'd'))
  };


  let humanizedDuration = `${duration.minutes}M`;
  if (duration.minutes < 10){humanizedDuration = `0${humanizedDuration}`;}

  if (duration.hours + duration.days > 0) {
    humanizedDuration = `${duration.hours}H ${humanizedDuration}`;
  }
  if (duration.hours < 10){humanizedDuration = `0${humanizedDuration}`;}
  if (duration.days > 0) {
    humanizedDuration = `${duration.days}D ${humanizedDuration}`;
  }
  if (duration.hours < 10){humanizedDuration = `0${humanizedDuration}`;}
  return (humanizedDuration);
};
