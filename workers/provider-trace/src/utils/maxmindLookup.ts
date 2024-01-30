import { Asn, City, Reader } from '@maxmind/geoip2-node';
import * as fs from 'fs';


const cityDb = fs.readFileSync('/opt/data/city.mmdb');
const cityReader = Reader.openBuffer(cityDb);

const asnDb = fs.readFileSync('/opt/data/asn.mmdb');
const asnReader = Reader.openBuffer(asnDb);

export function lookupCity(ip: string): City | undefined {
  try {
    return cityReader.city(ip);
  } catch (e) {
    // console.log(e);
  }
}

export function lookupAsn(ip: string): Asn | undefined {
  try {
    return asnReader.asn(ip);
  } catch (e) {
    // console.log(e);
  }
}