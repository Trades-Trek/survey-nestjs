import * as moment from 'moment-timezone';

export const NegerianTimeZone = () => {
  const originTime = new Date();
  const inputTz = "Africa/Lagos"
  const time = moment.tz(originTime, inputTz)
  const formated = moment(time).format("HH:mm:ss")
  return formated
}
export const NegerianHour = () => {
  const originTime = new Date();
  const inputTz = "Africa/Lagos"
  const time = moment.tz(originTime, inputTz)
  const formated = moment(time).format("HH")
  return formated
}
export const NegerianDateZone = () => {
  const originTime = new Date();
  const inputTz = "Africa/Lagos"
  const time = moment.tz(originTime, inputTz)
  const formated = moment(time).format("YYYY-MM-DD")
  return formated
}
export const NegerianGetDay = (originTime) => {

  const inputTz = "Africa/Lagos"
  const time = moment.tz(originTime, inputTz)
  const formated = moment(time).format("dddd")
  return formated
}
export const NegerianGetDate = (originTime) => {

  const inputTz = "Africa/Lagos"
  const time = moment.tz(originTime, inputTz)
  const formated = moment(time).format("YYYY-MM-DD")
  return formated
}
export const NegerianConvertDateZone = (date) => {
  const originTime = new Date(date);
  const inputTz = "Africa/Lagos"
  const time = moment.tz(originTime, inputTz)
  const formated = moment(time).format("MMM Do YY")
  return formated
}


export function timeDiffCalc(dateFuture, dateNow) {
  if (dateFuture.getMonth() < dateNow.getMonth()) {
    dateFuture.setMonth(dateNow.getMonth())
    dateFuture.setDate(1)

  }

  let diffInMilliSeconds = (dateFuture - dateNow) / 1000;

  // calculate days
  let days = Math.floor(diffInMilliSeconds / 86400);
  diffInMilliSeconds -= days * 86400;

  // calculate hours
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= hours * 3600;

  // calculate minutes
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  diffInMilliSeconds -= minutes * 60;

  let difference = "";
  if (days > 0) {
    difference += days === 1 ? `${days} day, ` : `${days} days, `;
  }

  difference +=
    hours === 0 || hours === 1 ? `${hours} hour, ` : `${hours} hours, `;

  difference +=
    minutes === 0 || hours === 1
      ? `${minutes} minutes`
      : `${minutes} minutes`;

  return days;
}

export function diff_months(dt2, dt1) {

  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= (60 * 60 * 24 * 7 * 4);
  return Math.round(diff);

}

export function orderFailedMessage(qty, action, rate, symbol) {
  return `Stock ${symbol}, quantity ${qty
    ?.toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} and rate ${rate?.toFixed(2)
      ?.toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${action} order is failed due to insufficient buying power.`
}
export function orderCancelledMessage(qty, action, rate, symbol) {
  return `Stock ${symbol}, quantity ${qty
    ?.toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} and rate ${rate?.toFixed(2)
      ?.toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${action} order is cancelled.`
}
export function orderPlaceddMessage(qty, action, rate, symbol) {
  return `Stock ${symbol}, quantity ${qty
    ?.toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} and rate ${rate?.toFixed(2)
      ?.toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${action} order is placed successfully.`
}
export function orderSuccessdMessage(qty, action, rate, symbol) {
  return `Stock ${symbol}, quantity ${qty
    ?.toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} and rate ${rate?.toFixed(2)
    ?.toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${action} order executed successfully.`
}

export function gameCreateMessage(gameName, type, cash) {
  return `Game (${gameName}) , game type (${type}) with starting cash ${cash?.toFixed(2)
    ?.toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} is created.`
}




export function subscriptionCancelled(subname, duration) {
  return `Subscription ${subname} duration ${duration} subscription is cancelled.`
}
export function subscriptionCreate(subname, duration) {
  return `Subscription ${subname} duration ${duration} is created.`
}
export function subscriptionFailed(subname, duration) {
  return `Subscription ${subname} duration ${duration} is failed.`
}
export function subscriptionSubscribe(subname, duration) {
  return `Subscription ${subname} duration ${duration} is Subscribed.`
}

export function userSignupMessage() {
  return `Welcome to trade trek. Signup Successfully.`
}
export function verifyEmailMessage() {
  return `Your email verify successfully.`
}


