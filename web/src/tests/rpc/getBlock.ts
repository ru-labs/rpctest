import makeRpcRequest from "@/utils/makeRpcRequest";
export const id = 'GET_LOW_BLOCK'
export const name = 'Get Low Block'
export const description = 'This test checks to see if a provider is able to return a block from a low slot number. If this fails, it may be indiciative of a provider that does not have a full ledger storage of the Solana blockchain.'
export async function run(endpoint: string) {
  const response = await makeRpcRequest(endpoint, 'getBlock', [2500]);
  return response;
}