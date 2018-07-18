import path from 'path';
import csvtojson from 'csvtojson';
import moment from 'moment-timezone'

export function isValidUTF8(str) {}

export function HMSToSecond(str) {
  const regx = /^\d+:\d+:\d+\.\d+$/g
  if(!regx.test(str)) throw new Error('invalid duration')

  const [HH, MM, SSMS] = str.split(':');
  const [SS, MS] = SSMS.split('.');
  const seconds = parseFloat(HH * 60 * 60 + MM * 60 + SS + MS / 1000);
  return seconds;
}

export function normalizeUTF8(str) {
  // replace invalid UTF-8 character with the Unicode Replacement Character
}

export function normalizeAddress(address) {
  /**
   * Unicode validation. Please note there are commas in the Address
   * field; your CSV parsing will need to take that into account. Commas
   * will only be present inside a quoted string.
   */
  const regx = /^\".*\"$/g;
  return regx.test(address) ? address : `"${address}"`;
}

export function normalizeName(name) {
  // All name columns should be converted to uppercase. There will be non-English names.
  return String(name).toUpperCase();
}

export function normalizeZIP(zip) {
  // formatted as 5 digits
  // If there are less than 5 digits, assume 0 as the prefix
  if (!zip) return '00000';
  return zip.substring(zip.length - 5, zip.length).padStart(5, '0');
}

export function normalizeTimestamp(timestamp) {
  // ISO-8601 format
  // US/Pacific -> US/Eastern
  // invalid -> warning to stderr
  const t = moment.tz(timestamp, 'MM/DD/YY hh:mm:ss a', 'US/Pacific')
  if(!t.isValid()) throw new Error('invalid timestamp')
  return t.tz('US/Eastern').format()
}

export function nomralizeDuration(foo, bar) {
  // foo and bar convert to floating point seconds format
  // return { FooDuration, BarDuration, TotalDuration }
  try {
    const fooDuration = HMSToSecond(foo)
    const barDuration = HMSToSecond(bar)
    return {
      FooDuration: fooDuration,
      BarDuration: barDuration,
      TotalDuration: fooDuration + barDuration
    }
  } catch(err) {
    console.warn('nomralizeDuration error:', err)
    throw new Error('nomralizeDuration failure')
  }
}

export function normalizeColumn(obj) {}

export default async function normalize(input) {
  try {
    const json = await csvtojson().fromFile(path.resolve(input));
    console.log('json', json);
  } catch (err) {
    console.error('not a valid input', err);
  }
}
