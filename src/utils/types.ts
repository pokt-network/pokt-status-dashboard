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
      service_id: string
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
    service_id: string
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