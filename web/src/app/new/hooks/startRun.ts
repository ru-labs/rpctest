import { RpcRequestResult } from "@/types/RPCRequestResult";
import { RPCTest } from "@/types/RPCTest";
import { getActiveTests } from "@/utils/getActiveTests";
import getClientIP from "@/utils/getClientIP";
import getEndpointDetails from "@/utils/getEndpointDetails";
import makeTestResult from "@/utils/makeTestResult";
import { Prisma, RpcProvider } from "@prisma/client";

function sleep(seconds: number) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

export default async function startRun(provider: RpcProvider, onTestCompleted: (test: RPCTest) => void) {

  const providerMeta = await getEndpointDetails(provider.endpoint);

  let run: Prisma.RunCreateInput = {
    requestIp: await getClientIP(),
    providerIp: providerMeta.dns.ip,
    start: new Date(),
    rpcProvider: {
      connect: {
        id: provider.id
      }
    }
  };

  let activeTests = getActiveTests();
  let testResults = [];

  for (const [name, rpcTest] of activeTests) {
    let testResult: RpcRequestResult;
    testResult = await rpcTest.run(provider.endpoint);
    const result = makeTestResult(rpcTest.name, testResult);
    testResults.push(result);
    onTestCompleted(rpcTest);
    await sleep(1.5)
  }

  run.results = {
    createMany: {
      data: testResults,
    },
  }

  return run;
}