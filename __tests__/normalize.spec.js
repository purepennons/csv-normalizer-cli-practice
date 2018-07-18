import path from 'path'
import normalize, { normalizeZIP, normalizeAddress, HMSToSecond, normalizeTimestamp } from '../src/'

describe('normalizeZIP', () => {
  it('should get five zeros when the argument is not a string', () => {
    expect(normalizeZIP(null)).toBe('00000')
  })

  it('should fill `0` as the prefix if the digits is less than 5 digits', () => {
    expect(normalizeZIP('1')).toBe('00001')
    expect(normalizeZIP('11')).toBe('00011')
    expect(normalizeZIP('111')).toBe('00111')
    expect(normalizeZIP('1111')).toBe('01111')
    expect(normalizeZIP('11111')).toBe('11111')
  })

  it('should truncate to 5 digits if the digits is more than 5 digits', () => {
    expect(normalizeZIP('211111')).toBe('11111')
    expect(normalizeZIP('2211111')).toBe('11111')
  })
})

describe('normalizeAddress', () => {
  it('should prefix `"` and postfix `"` to the address', () => {
    expect(normalizeAddress(',a address, without quoted string,')).toBe('",a address, without quoted string,"')
    expect(normalizeAddress('",a address, with quoted string,"')).toBe('",a address, with quoted string,"')
    expect(normalizeAddress('",prefix with, quoted string,')).toBe('"",prefix with, quoted string,"')
    expect(normalizeAddress(',postfix with, quoted string,"')).toBe('",postfix with, quoted string,""')
    expect(normalizeAddress("',a address, with single quoted string,'")).toBe("\"',a address, with single quoted string,'\"")
    expect(normalizeAddress(",a address, with single quoted string,'")).toBe("\",a address, with single quoted string,'\"")
    expect(normalizeAddress("',a address, with single quoted string,")).toBe("\"',a address, with single quoted string,\"")
  })
})

describe('HMSToSecond', () => {
  it('should convert HMS to float point seconds', () => {
    expect(HMSToSecond('11:22:33.44')).toBe(40920330.044)
  })

  it('should throw an error when the input format is not HH:MM:SS.MS', () => {
    expect(() => HMSToSecond('invalid time')).toThrow()
  })
})

describe('normalizeTimestamp', () => {
  it('should convert to US/Eastern time zone and be formatted in ISO-8601 format', () => {
    expect(normalizeTimestamp('4/1/11 10:33:22 AM')).toBe('2011-04-01T13:33:22-04:00')
    expect(normalizeTimestamp('4/1/11 10:33:22 PM')).toBe('2011-04-02T01:33:22-04:00')
  })

  it('should throw a error when the timestamp is invalid', () => {
    expect(() => normalizeTimestamp('invalid timestamp')).toThrow()
  })
})


describe('normalize', () => {
  it('should run without error', async () => {
    await normalize('./samples/sample.csv')
  })
})