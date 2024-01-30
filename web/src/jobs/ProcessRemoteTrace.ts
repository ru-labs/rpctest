import prisma from '@/lib/prisma';
import faktory from 'faktory-worker';

export interface ProcessRemoteTraceJob {
  providerId: string;
  location: string;
  endpoint: string;
  hops: any;
  identity: string;
}

type RemoteTraceHop = {
  hop: number;
  ip: string;
  rtt: number;
  friendlyName?: string;
  geo: {
    lat?: number;
    lon?: number;
    city?: {
      names?: {
        en?: string;
        jp?: string;
      }
    }
  }
}

type RemoteTraceResult = {
  providerId: any;
  location: string;
  identity: string;
  anycast: boolean;
  hops: Set<RemoteTraceHop>;
}

function isPublicIP(ip: string): boolean {
  const reservedRanges = [
    { start: '10.0.0.0', end: '10.255.255.255' },       // RFC 1918
    { start: '172.16.0.0', end: '172.31.255.255' },     // RFC 1918
    { start: '192.168.0.0', end: '192.168.255.255' },   // RFC 1918
    { start: '169.254.0.0', end: '169.254.255.255' },   // Link-local
    { start: '127.0.0.0', end: '127.255.255.255' },     // Loopback
    { start: '224.0.0.0', end: '239.255.255.255' },     // Multicast
    { start: '100.64.0.0', end: '100.127.255.255' },    // RFC 6598 (CGN)
    { start: '240.0.0.0', end: '255.255.255.255' }      // Reserved, Experimental, or Future Use
  ];

  const ipNum = ip.split('.').reduce((accum, octet) => (accum << 8) | parseInt(octet), 0);

  for (const range of reservedRanges) {
    const [startNum, endNum] = [range.start, range.end].map(
      addr => addr.split('.').reduce((accum, octet) => (accum << 8) | parseInt(octet), 0)
    );
    if (ipNum >= startNum && ipNum <= endNum) {
      return false;
    }
  }

  return true;
}

async function createAsync(job: ProcessRemoteTraceJob) {
  const client = await faktory.connect()
  await client.job("ProcessRemoteTrace", job).push();
  await client.close();
}

async function run(job: ProcessRemoteTraceJob) {
  const { providerId, location, endpoint, hops, identity } = job;

  if (!hops || hops.length === 0) {
    console.log("Error: ", providerId, location, endpoint, hops, identity)
    throw new Error(`Missing trace for ${providerId} ${location} ${endpoint}`);
  }

  let result: RemoteTraceResult = {
    providerId: providerId,
    location: location,
    identity: identity,
    anycast: false,
    hops: new Set<RemoteTraceHop>()
  }

  const provider = await prisma.rpcProvider.findFirst({
    where: {
      id: providerId
    }
  })

  if (!provider) {
    throw new Error(`Provider ${providerId} not found`);
  }

  for (const hop of hops) {

    if (!isPublicIP(hop.ip)) {
      continue;
    }

    let entry: RemoteTraceHop = {
      hop: hop.hop,
      ip: hop.ip,
      rtt: hop.rtt1,
      geo: {},
    }

    if (hop.geo) {
      if (hop.geo.city) {
        if (hop.geo.city.names.en) {
          entry.friendlyName = hop.geo.city.names.en
        }
      }

      if (hop.geo.location) {
        entry.geo.lat = hop.geo.location.latitude
        entry.geo.lon = hop.geo.location.longitude
      }
    }

    result.hops.add(entry)
  }


  console.log(`Trace for ${provider.name} from ${location}: ${result.hops.size} hops`);
  console.dir({ ts: new Date(), result }, { depth: null });
}

export {
  createAsync, run
};

