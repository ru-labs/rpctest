import makeRpcRequest from "../../utils/makeRpcRequest";

export const id = 'GET_LATEST_BLOCKHASH'
export const name = 'Get Latest Blockhash'
export const description = 'This test checks to see if a provider is able to return the latest blockhash. This ensures that the provider has a consistent view of the current blockhash.'
export async function run(endpoint: string) {
  const response = await makeRpcRequest(endpoint, 'getLatestBlockhash', []);
  return response;
}