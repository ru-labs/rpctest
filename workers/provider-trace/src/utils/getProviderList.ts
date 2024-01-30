
export interface Provider {
  id: string;
  name: string;
  endpoint: string;
}
export async function getProviderList() {
  const providerList = await fetch("https://sol.rpctest.com/api/provider")
  const providers = await providerList.json() as Provider[]
  return providers
}