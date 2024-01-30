import makeRpcRequest from "../../utils/makeRpcRequest";

export const id = 'GET_CLUSTER_NODES'
export const name = 'Get Cluster Nodes'
export const description = 'This test checks to see if a provider is able to return the cluster nodes. This ensures that the provider has a clear view of the Solana cluster.'
export const disabled = true;
export async function run(endpoint: string) {
  const response = await makeRpcRequest(endpoint, 'getClusterNodes', []);
  return response;
}