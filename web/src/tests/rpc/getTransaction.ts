import makeRpcRequest from "../../utils/makeRpcRequest";
export const id = 'GET_TRANSACTION_JSON'
export const name = 'Get Transaction (JSON Parsed)'
export const description = 'This test checks to see if a provider is able to return a transaction. This check also ensures that the JSON parsing is working correctly.'

export async function run(endpoint: string) {
  const response = await makeRpcRequest(endpoint, 'getTransaction', [
    'utPCy36cwsQeV9WxQ3bepHGpn2zj2vBe1sGRF9LKRjDW29mn1n3RhZGgdvgsZRGcKgDDoVQykkcVQQiQeN3cxbX',
    { "encoding": "jsonParsed" }
  ]);
  return response;
}