import "server-only";

import { parseRpcEndpoints, RpcEndpoint } from "./rpc-endpoints-shared";
export type { RpcEndpoint } from "./rpc-endpoints-shared";

export function getRpcEndpointsFromEnv(
  raw = process.env.RPC_ENDPOINTS_JSON,
): RpcEndpoint[] {
  return parseRpcEndpoints(raw);
}
