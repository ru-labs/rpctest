
export type RpcRequestResult = {
  endpoint: string;
  method: string;
  params: any[];
  total_ms: number;
  response: any;
  successful: boolean;
  start: number;
}

export default async function makeRpcRequest(endpoint: string, method: string, params: any[]): Promise<RpcRequestResult> {
  const startTime = performance.timeOrigin + performance.now();
  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method,
        params,
      }),
    })
  } catch (e) {
    return {
      endpoint,
      method,
      params,
      total_ms: performance.timeOrigin + performance.now() - startTime,
      response: null,
      successful: false,
      start: startTime
    };
  }

  const endTime = performance.timeOrigin + performance.now();

  if (response.status !== 200) {
    return {
      endpoint,
      method,
      params,
      total_ms: endTime - startTime,
      response: null,
      successful: false,
      start: startTime
    };
  }

  const result = await response.json() as any;

  if (result.error) {
    return {
      endpoint,
      method,
      params,
      total_ms: endTime - startTime,
      response: result.error,
      successful: false,
      start: startTime
    };
  }

  return {
    endpoint,
    method,
    params,
    total_ms: endTime - startTime,
    response: result.result,
    successful: true,
    start: startTime
  };
}