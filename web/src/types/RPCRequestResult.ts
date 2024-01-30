export type RpcRequestResult = {
  endpoint: string;
  method: string;
  params: any[];
  total_ms: number;
  response: any;
  successful: boolean;
  start: number;
}