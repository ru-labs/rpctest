import makeRpcRequest from "../../utils/makeRpcRequest";
export const id = 'GET_TRANSACTION_COUNT'
export const name = 'Get Transaction Count'
export const description = 'This test checks to see if a provider is able to return the transaction count. This ensures that the provider has a consistent view of the current transaction count.'

export async function run(endpoint: string) {
  const response = await makeRpcRequest(endpoint, 'getTransactionCount', []);
  return response;
}