import maxmind, { CityResponse } from 'maxmind';
import path from 'path';

const absolutePath = path.resolve(process.cwd(), 'src/lib/vendor', 'city.mmdb');
const dbReader = await maxmind.open<CityResponse>(absolutePath);
export function lookup(ip: string): [CityResponse | null, number] {
  return dbReader.getWithPrefixLength(ip);
}