export type ServiceID =
  | "arb-one"
  | "avax-dfk"
  | "avax"
  | "base-sepolia-testnet"
  | "base"
  | "blast"
  | "bsc"
  | "eth-sepolia-testnet"
  | "eth"
  | "fantom"
  | "fuse"
  | "gnosis"
  | "ink"
  | "kaia"
  | "kava"
  | "mantle"
  | "metis"
  | "op-sepolia-testnet"
  | "op"
  | "poly-amoy-testnet"
  | "poly-zkevm"
  | "poly"
  | "scroll"
  | "sei"
  | "arb-sepolia-testnet"
  | "boba"
  | "fraxtal"
  | "linea"
  | "oasys"
  | "osmosis"
  | "pocket"
  | "solana"
  | "sonic"
  | "bera"
  | "giwa-sepolia-testnet"
  | "harmony"
  | "iotex"
  | "moonbeam"
  | "moonriver"
  | "near"
  | "opbnb"
  | "radix"
  | "sui"
  | "tron"
  | "xrplevm-testnet"
  | "xrplevm"
  | "zklink-nova"
  | "zksync-era"
  | "eth-holesky-testnet"
  | "taiko-hekla-testnet"
  | "taiko"
  | "base-test"
  | "evmos"
  | "celo"
  | "arb_sep_test"
  | "akash"
  | "atomone"
  | "cheqd"
  | "chihuahua"
  | "elys-network"
  | "fetch"
  | "jackal"
  | "juno"
  | "persistence"
  | "router"
  | "seda"
  | "shentu"
  | "stargaze"
  | "arb_one"
  | "eth_sep_test"
  | "op_sep_test"
  | "poly_amoy_test"
  | "hey"
  | "pocket-alpha"
  | "pocket-beta"
  | "xrplevm-grove-only"
  | "rpc1"
  | "eth_hol_test"

export type ChainName =
  | "arbitrum-one"
  | "arbitrum-sepolia-testnet"
  | "avax"
  | "base"
  | "base-testnet"
  | "berachain"
  | "blast"
  | "bsc"
  | "boba"
  | "celo"
  | "defi-kingdoms"
  | "evm"
  | "evm-testnet"
  | "fraxtal"
  | "fuse"
  | "gnosis"
  | "harmony"
  | "ink"
  | "iotex"
  | "kaia"
  | "kava"
  | "linea"
  | "mantle"
  | "metis"
  | "moonbeam"
  | "moonriver"
  | "near"
  | "oasys"
  | "optimism"
  | "optimism-sepolia-testnet"
  | "osmosis"
  | "pocket"
  | "polygon"
  | "polygon-amoy-testnet"
  | "polygon-zkevm"
  | "radix"
  | "scroll"
  | "sei"
  | "solana"
  | "sonic"
  | "sui"
  | "taiko"
  | "taiko-hekla-testnet"
  | "tron"
  | "xrplevm"
  | "xrpl-evm-testnet"
  | "zklink-nova"
  | "zksync-era";

export type Supplier = {
  operator_address: string,
  owner_address: string,
  service_config_history: {
    activation_height: string,
    deactivation_height: string,
    operator_address: string,
    service: {
      endpoints: {
        configs: {
          key: string,
          value: string
        }[],
        rpc_type: string,
        url: string
      }[],
      rev_share: {
        address: string,
        rev_share_percentage: string
      }[],
      service_id: ServiceID
    },
  }[],
  services: {
    endpoints: {
      configs: {
        key: string,
        value: string
      }[],
      rpc_type: string,
      url: string
    }[],
    rev_share: {
      address: string,
      rev_share_percentage: string
    }[],
    service_id: ServiceID
  }[],
  stake: {
    amount: string,
    denom: string
  },
  unstake_session_end_height: string
}

export type SupplierResponse = {
  supplier: Supplier[],
  pagination: {
    next_key: string,
    total: string
  }
}