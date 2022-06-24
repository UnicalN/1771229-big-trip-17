import dayjs from 'dayjs';
export const getTimeFromIso = (isoDate) => dayjs(isoDate).format('HH:mm');
export const getDateFromIso = (isoDate) => dayjs(isoDate).format('MMM DD');
export const getEditableDateFromIso = (isoDate) => dayjs(isoDate).format('DD/MM/YY');

export const getDurationFromIso = (start, finish) => {
  const duration = {
    minutes:  (dayjs(finish).diff(dayjs(start), 'm')) % 60 + 1 ,
    hours:    (dayjs(finish).diff(dayjs(start), 'h')) % 24,
    days:     (dayjs(finish).diff(dayjs(start), 'd'))
  };
  let humanizedDuration = `${duration.minutes}M`;
  if (duration.minutes < 10){humanizedDuration = `0${humanizedDuration}`;}

  if (duration.hours + duration.days > 0) {
    humanizedDuration = `${duration.hours}H ${humanizedDuration}`;
  }
  if ((duration.hours < 10)&&(duration.hours > 0)){humanizedDuration = `0${humanizedDuration}`;}
  if (duration.days > 0) {
    humanizedDuration = `${duration.days}D ${humanizedDuration}`;
  }
  if ((duration.days < 10)&&(duration.days > 0)){humanizedDuration = `0${humanizedDuration}`;}
  return (humanizedDuration);
};
