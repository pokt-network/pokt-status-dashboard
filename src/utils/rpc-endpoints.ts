import "server-only";

export type RpcEndpoint = {
  name: string;
  rpcUrl: string;
  healthUrl: string;
  apiKey: string;
};

function isHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function asNonEmptyString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function getRpcEndpointsFromEnv(
  raw = process.env.RPC_ENDPOINTS_JSON,
): RpcEndpoint[] {
  if (!raw) {
    throw new Error("RPC_ENDPOINTS_JSON is not set");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(
      `RPC_ENDPOINTS_JSON is not valid JSON: ${(error as Error).message}`,
    );
  }

  if (!Array.isArray(parsed)) {
    throw new Error("RPC_ENDPOINTS_JSON must be a JSON array");
  }

  const endpoints = parsed.map((item, index) => {
    const entry = item as Record<string, unknown>;
    const name = asNonEmptyString(entry.name);
    const rpcUrl = asNonEmptyString(entry.rpcUrl);
    const healthUrl = asNonEmptyString(entry.healthUrl);
    const apiKey = asNonEmptyString(entry.apiKey);

    if (!name || !rpcUrl || !healthUrl || !apiKey) {
      throw new Error(
        `RPC_ENDPOINTS_JSON[${index}] must include non-empty name, rpcUrl, healthUrl, and apiKey`,
      );
    }

    if (!isHttpUrl(rpcUrl)) {
      throw new Error(
        `RPC_ENDPOINTS_JSON[${index}].rpcUrl must be an absolute http(s) URL`,
      );
    }

    if (!isHttpUrl(healthUrl)) {
      throw new Error(
        `RPC_ENDPOINTS_JSON[${index}].healthUrl must be an absolute http(s) URL`,
      );
    }

    return { name, rpcUrl, healthUrl, apiKey };
  });

  const byName = new Set<string>();
  const byRpcUrl = new Set<string>();

  for (const endpoint of endpoints) {
    if (byName.has(endpoint.name)) {
      throw new Error(`RPC endpoint name '${endpoint.name}' is duplicated`);
    }
    byName.add(endpoint.name);

    if (byRpcUrl.has(endpoint.rpcUrl)) {
      throw new Error(`RPC endpoint rpcUrl '${endpoint.rpcUrl}' is duplicated`);
    }
    byRpcUrl.add(endpoint.rpcUrl);
  }

  return endpoints;
}
