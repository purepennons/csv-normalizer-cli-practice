import path from 'path'
import csvtojson from 'csvtojson'
import { isString } from 'lodash'

export function isValidUTF8(str) {

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
  
}

export function normalizeName(name) {
  // All name columns should be converted to uppercase. There will be non-English names.
}

export function normalizeZIP(zip) {
  // formatted as 5 digits
  // If there are less than 5 digits, assume 0 as the prefix
  if(!isString(zip)) return '00000'
  return zip.substring(zip.length-5, zip.length).padStart(5, '0')
}

export function normalizeTimestamp(timestamp) {
  // ISO-8601 format
  // US/Pacific -> US/Eastern
  // invalid -> warning to stderr
}

export function normalizeColumn(obj) {

}

export default async function normalize(input) {
  try {
    const json = await csvtojson().fromFile(path.resolve(input))
    console.log('json', json)
  } catch(err) {
    console.error('not a valid input', err)
  }
}