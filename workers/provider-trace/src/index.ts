import { Provider, getProviderList } from './utils/getProviderList.js';
import makeRpcRequest from './utils/makeRpcRequest.js';
import { lookupAsn, lookupCity } from './utils/maxmindLookup.js';
import runTrace from './utils/runTrace.js';

const traceProvider = async (provider: Provider) => {
  console.log("Tracing provider:", provider.name)
  const response = await makeRpcRequest(provider.endpoint, 'getIdentity', [])

  if (!response.successful) {
    console.log("Failed to get identity for provider:", provider.name)
    return;
  }

  const hostname = provider.endpoint.replace("https://", "").replace("http://", "").split("/")?.[0]
  const hopStats = new Set<any>()
  await runTrace(hostname, (hop: any) => {

    if (hop.rtt1 !== '*') {
      hop.geo = lookupCity(hop.ip)
      hop.asn = lookupAsn(hop.ip)
    }

    hopStats.add(hop)
  })

  const traceArray = Array.from(hopStats)

  return {
    provider: provider,
    location: process.env.AWS_REGION || "local",
    identity: response.response.identity,
    hops: traceArray
  }
}

const saveTrace = async (trace: any) => {
  const pushResponse = await fetch('https://sol.rpctest.com/api/stats/remoteIngest', {
    method: 'POST',
    body: JSON.stringify(trace),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const respStatus = pushResponse.status;
  const respText = await pushResponse.text();

  if (respStatus !== 200) {
    console.log("Failed to push response:", respStatus, respText);
    return;
  }

  console.log("Pushed trace successfully");
}

const run = async (event: any, context: any) => {
  const time = new Date().toISOString()
  console.log("Starting run at", time)

  const providers = await getProviderList()

  let traces: Promise<any>[] = []

  for await (const provider of providers) {
    const trace = traceProvider(provider)
    traces.push(trace)
  }

  const results = await Promise.all(traces)

  for await (const trace of results) {
    console.log("Saving trace", trace)
    await saveTrace(trace)
  }

  console.log("Finished run at", new Date().toISOString())
}

export default run;