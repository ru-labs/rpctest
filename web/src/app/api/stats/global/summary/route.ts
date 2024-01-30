import { lookup } from "@/lib/maxmindLookup";
import { run } from "@/tests/rpc/getClusterNodes";

export async function GET() {
  const nodes = await run('https://api.mainnet-beta.solana.com');

  const clusterNodes = await nodes.response.map((node: any) => {

    const nodeIp = node.gossip.split(':')[0]
    const [nodeInfo, prefix] = lookup(nodeIp)

    return {
      lat: nodeInfo?.location?.latitude,
      lng: nodeInfo?.location?.longitude,
      ip: nodeIp,
      pubkey: node.pubkey,
      version: node.version,
      rpc: node.rpc?.length > 0,
      tpu: node.tpu?.length > 0,
      gossip: node.gossip?.length > 0,
    }
  })

  return new Response(JSON.stringify(clusterNodes), {
    headers: { 'content-type': 'application/json' },
  })
}