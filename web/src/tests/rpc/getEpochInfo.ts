import makeRpcRequest from "../../utils/makeRpcRequest";

export const id = 'GET_EPOCH_INFO'
export const name = 'Get Epoch Info'
export const description = 'This test checks to see if a provider is able to return the epoch info. This ensures that the provider has a consistent view of the current epoch.'
export async function run(endpoint: string) {
  const response = await makeRpcRequest(endpoint, 'getEpochInfo', []);
  return response;
}