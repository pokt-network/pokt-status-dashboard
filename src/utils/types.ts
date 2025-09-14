export type ServiceID =
  | "akash"
  | "arb-one"
  | "arb-sepolia-testnet"
  | "arb_one"
  | "arb_sep_test"
  | "atomone"
  | "avax"
  | "avax-dfk"
  | "base"
  | "base-sepolia-testnet"
  | "base-test"
  | "bera"
  | "blast"
  | "boba"
  | "bsc"
  | "celo"
  | "cheqd"
  | "chihuahua"
  | "elys-network"
  | "eth"
  | "eth-holesky-testnet"
  | "eth-sepolia-testnet"
  | "eth_hol_test"
  | "eth_sep_test"
  | "evmos"
  | "fantom"
  | "fetch"
  | "fraxtal"
  | "fuse"
  | "giwa-sepolia-testnet"
  | "gnosis"
  | "harmony"
  | "hey"
  | "ink"
  | "iotex"
  | "jackal"
  | "juno"
  | "kaia"
  | "kava"
  | "linea"
  | "mantle"
  | "metis"
  | "moonbeam"
  | "moonriver"
  | "near"
  | "oasys"
  | "op"
  | "op-sepolia-testnet"
  | "op_sep_test"
  | "opbnb"
  | "osmosis"
  | "persistence"
  | "pocket"
  | "pocket-alpha"
  | "pocket-beta"
  | "poly"
  | "poly-amoy-testnet"
  | "poly-zkevm"
  | "poly_amoy_test"
  | "radix"
  | "router"
  | "rpc1"
  | "seda"
  | "sei"
  | "shentu"
  | "solana"
  | "sonic"
  | "stargaze"
  | "scroll"
  | "sui"
  | "taiko"
  | "taiko-hekla-testnet"
  | "tron"
  | "xrplevm"
  | "xrplevm-grove-only"
  | "xrplevm-testnet"
  | "zklink-nova"
  | "zksync-era"

export type ChainName =
  | "akash"
  | "arbitrum-one"
  | "arbitrum-sepolia-testnet"
  | "atomone"
  | "avax"
  | "avax-dfk"
  | "base"
  | "base-testnet"
  | "berachain"
  | "blast"
  | "boba"
  | "bsc"
  | "celo"
  | "cheqd"
  | "chihuahua"
  | "elys"
  | "eth"
  | "eth-holesky-testnet"
  | "eth-sepolia-testnet"
  | "fantom"
  | "fetch"
  | "fraxtal"
  | "fuse"
  | "giwa-sepolia-testnet"
  | "gnosis"
  | "harmony"
  | "ink"
  | "iotex"
  | "jackal"
  | "juno"
  | "kaia"
  | "kava"
  | "linea"
  | "mantle"
  | "metis"
  | "moonbeam"
  | "moonriver"
  | "near"
  | "oasys"
  | "opbnb"
  | "optimism"
  | "optimism-sepolia-testnet"
  | "osmosis"
  | "persistence"
  | "pocket"
  | "polygon"
  | "polygon-amoy-testnet"
  | "polygon-zkevm"
  | "radix"
  | "router"
  | "scroll"
  | "seda"
  | "sei"
  | "shentu"
  | "solana"
  | "sonic"
  | "stargaze"
  | "sui"
  | "taiko"
  | "taiko-hekla-testnet"
  | "tron"
  | "xrplevm"
  | "xrplevm-testnet"
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