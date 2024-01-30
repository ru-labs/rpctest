import { RpcRequestResult } from '@/types/RPCRequestResult';
import { Prisma } from '@prisma/client';

export default function makeTestResult(name: string, result: RpcRequestResult) {
  let testResult: Prisma.TestResultCreateWithoutRunInput = {
    test: name,
    endpoint: result.endpoint,
    successful: result.successful,
    duration: result.total_ms,
    start: new Date(result.start),
  }

  if (result.response) {
    testResult.result = result.response;
  }

  return testResult;
}