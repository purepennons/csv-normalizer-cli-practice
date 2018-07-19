import path from 'path';
import { readFile, writeFile } from 'fs-extra';
import csvtojson from 'csvtojson';
import moment from 'moment-timezone';
import { pickAll, merge } from 'ramda';
import { Parser } from 'json2csv';

const FIELDS = [
  'Timestamp',
  'Address',
  'ZIP',
  'FullName',
  'FooDuration',
  'BarDuration',
  'TotalDuration',
  'Notes'
];

export function HMSToSecond(str) {
  const regx = /^\d+:\d+:\d+\.\d+$/g;
  if (!regx.test(str)) throw new Error('invalid duration');

  const [HH, MM, SSMS] = str.split(':');
  const [SS, MS] = SSMS.split('.');
  const seconds = parseFloat(HH * 60 * 60 + MM * 60 + SS + MS / 1000);
  return seconds;
}

export function normalizeUTF8(str) {
  // replace invalid UTF-8 character with the Unicode Replacement Character
  const regx = /(?!([\u{0000}-\u{007F}]|[\u{0080}-\u{07FF}]|[\u{0800}-\u{FFFF}]|[\u{10000}-\u{10FFFF}]))/ug
  return str.replace(regx, '\ufffd');
}

export function normalizeAddress(address) {
  /**
   * Unicode validation. Please note there are commas in the Address
   * field; your CSV parsing will need to take that into account. Commas
   * will only be present inside a quoted string.
   */
  // do nothing, json2csv will handle it
  return address;
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
  const t = moment.tz(timestamp, 'MM/DD/YY hh:mm:ss a', 'US/Pacific');
  if (!t.isValid()) throw new Error('invalid timestamp');
  return t.tz('US/Eastern').format();
}

export function nomralizeDuration(foo, bar) {
  // foo and bar convert to floating point seconds format
  // return { FooDuration, BarDuration, TotalDuration }
  try {
    const fooDuration = HMSToSecond(foo);
    const barDuration = HMSToSecond(bar);
    return {
      FooDuration: fooDuration,
      BarDuration: barDuration,
      TotalDuration: fooDuration + barDuration
    };
  } catch (err) {
    throw new Error('nomralizeDuration failure');
  }
}

export function normalizeColumn(obj) {
  const o = pickAll(FIELDS, obj);

  try {
    o['Timestamp'] = normalizeTimestamp(o['Timestamp']);
    o['Address'] = normalizeAddress(o['Address']);
    o['ZIP'] = normalizeZIP(o['ZIP']);
    o['FullName'] = normalizeName(o['FullName']);

    const duration = nomralizeDuration(o['FooDuration'], o['BarDuration']);
    return merge(o, duration);
  } catch (err) {
    console.warn('parsing error', err);
    return null;
  }
}

export default async function normalize(input = '', output = './normalized.csv') {
  try {
    if (!input || !output) throw new Error('empty input/output');
    let csvstr = await readFile(path.resolve(input))
    csvstr = normalizeUTF8(csvstr.toString())

    const objList = await csvtojson().fromString(csvstr);
    const results = objList
      .map(obj => normalizeColumn(obj))
      .filter(obj => !!obj);

    const json2csvParser = new Parser({ fields: FIELDS });
    const csv = json2csvParser.parse(results);

    // write back
    await writeFile(path.resolve(output), csv);
  } catch (err) {
    console.error('not a valid input/output', err);
  }
}
