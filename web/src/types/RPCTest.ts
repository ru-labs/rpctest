import { RpcRequestResult } from "./RPCRequestResult";

export type RPCTest = {
  id: string;
  name: string;
  description: string;
  disabled: boolean;
  setup?: () => Promise<void>;
  run: (endpoint: string) => Promise<RpcRequestResult>;
}
