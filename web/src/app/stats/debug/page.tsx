import prisma from "@/lib/prisma";
import { createRedisInstance } from "@/lib/redis";
import { RpcProvider } from "@prisma/client";

import DebugView from "@/app/stats/debug/View";


interface Hop {
  ip: string;
  hop: number;
  rtt1: number;
  geo?: any;
  asn?: any;
}

interface ProviderTrace {
  provider: RpcProvider;
  identity: string;
  endpoint: string;
  location: string;
  hops: Hop[];
}

async function fetchLatestTraces(providerId: string, filters: string[] = []) {
  const redis = createRedisInstance();
  let keys = await redis.keys(`traces:${providerId}:*`);

  if (filters.length !== 0) {
    keys = keys.filter((region) => { return filters.includes(region) })
  }

  if (keys.length === 0) return new Map<String, ProviderTrace>();
  const regions = keys.map((region) => { return region.split(':')[2] })
  const latest = await redis.mget(keys)
  const map = new Map<String, ProviderTrace>();


  for (let i = 0; i < regions.length; i++) {
    if (!latest[i]) continue;
    map.set(regions[i], JSON.parse(latest[i] as string));
  }

  return map
}

export default async function DebugPage() {

  const providers = await prisma.rpcProvider.findMany({});
  let traces = []
  for (const provider of providers) {
    const trace = await fetchLatestTraces(provider.id);
    traces.push(trace)
  }

  return (
    <DebugView providers={providers} traces={traces} />
  )
}