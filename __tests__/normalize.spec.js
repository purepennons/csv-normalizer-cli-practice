import path from 'path'
import normalize, { normalizeZIP, normalizeAddress } from '../src/'

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
  })
})


describe('normalize', () => {
  it('should run without error', async () => {
    await normalize('./samples/sample.csv')
  })
})