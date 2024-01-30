import prisma from "@/lib/prisma";
import makeRpcRequest from "@/utils/makeRpcRequest";

export default async function runClusterChecks() {

  const endpoint = await prisma.rpcProvider.findFirst({
    where: {
      name: "Solana Foundation"
    }
  });

  if (!endpoint) {
    throw new Error("No endpoint found");
  }

  const health = (await makeRpcRequest(endpoint.endpoint, 'getHealth', [])).response;
  const blockHeight = (await makeRpcRequest(endpoint.endpoint, 'getBlockHeight', [])).response;
  const currentSlot = (await makeRpcRequest(endpoint.endpoint, 'getSlot', [])).response;
  const identity = (await makeRpcRequest(endpoint.endpoint, 'getIdentity', [])).response.identity;
  const currentLeader = (await makeRpcRequest(endpoint.endpoint, 'getSlotLeader', [])).response;
  const nodes = (await makeRpcRequest(endpoint.endpoint, 'getClusterNodes', [])).response;
  const leader = nodes.find((node: any) => node.pubkey === currentLeader);
  const source = nodes.find((node: any) => node.pubkey === identity);

  const clusterStatus = {
    source,
    health,
    blockHeight,
    currentSlot,
    leader,
  }

  return clusterStatus;

}

(async () => {
  const clusterStatus = await runClusterChecks()

  const result = {
    clusterStatus,
  }


  console.dir(result);
})()