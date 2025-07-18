export interface ErrorResponse {
  code: number,
  details: {
    "@type": string
  }[],
  message: string
}

export class PocketApi {
  private readonly apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  public node = {
    config: async (): Promise<{
      halt_height: string,
      minimum_gas_price: string,
      pruning_interval: string,
      pruning_keep_recent: string
    } | ErrorResponse> => {
      const response = await fetch(`${this.apiUrl}/cosmos/base/node/v1beta1/config`);
      return await response.json();
    },
    status: async (): Promise<{
      app_hash: string,
      earliest_store_height: string,
      height: string,
      timestamp: string,
      validator_hash: string
    } | ErrorResponse> => {
      const response = await fetch(`${this.apiUrl}/cosmos/base/node/v1beta1/status`);
      return await response.json();
    }
  }

  public tendermint = {
    nodeInfo: async (): Promise<{
      application_version: {
        app_name: string,
        build_deps: {
          path: string,
          sum: string,
          version: string
        }[],
        build_tags: string,
        cosmos_sdk_version: string,
        git_commit: string,
        go_version: string,
        name: string,
        version: string
      },
      default_node_info: {
        channels: string,
        default_node_id: string,
        listen_addr: string,
        moniker: string,
        network: string,
        other: {
          rpc_address: string,
          tx_index: string
        },
        protocol_version: {
          app: string,
          block: string,
          p2p: string
        },
        version: string
      }
    } | ErrorResponse> => {
      const response = await fetch(`${this.apiUrl}/cosmos/base/tendermint/v1beta1/node_info`);
      return await response.json();
    },
    syncing: async (): Promise<{
      syncing: boolean
    } | ErrorResponse> => {
      const response = await fetch(`${this.apiUrl}/cosmos/base/tendermint/v1beta1/syncing`);
      return await response.json();
    }
  }

  public ibc_core = {
    connection: {
      params: async (): Promise<{
        params: {
          max_expected_time_per_block: string
        }
      } | ErrorResponse> => {
        const response = await fetch(`${this.apiUrl}/ibc/core/connection/v1/params`);
        return await response.json();
      },
      connections: async (params?: {
        paginationKey?: string,
        paginationOffset?: number,
        paginationLimit?: number,
        paginationCountTotal?: boolean,
        paginationReverse?: boolean,
      }): Promise<{
        connections: {
          client_id: string,
          counterparty: {
            client_id: string,
            connection_id: string,
            prefix: {
              key_prefix: string
            }
          },
          delay_period: string,
          id: string,
          state: string,
          versions: {
            features: string[],
            identifier: string
          }[],
        }[],
        height: {
          revision_height: string,
          revision_number: string
        },
        pagination: {
          next_key: string,
          total: string
        }
      } | ErrorResponse> => {
        // Build query string from params
        let query = '';
        if (params) {
          const searchParams = new URLSearchParams();
          if (params.paginationKey) searchParams.append("pagination.key", params.paginationKey);
          if (params.paginationOffset) searchParams.append("pagination.offset", params.paginationOffset.toString());
          if (params.paginationLimit) searchParams.append("pagination.limit", params.paginationLimit.toString());
          if (params.paginationCountTotal) searchParams.append("pagination.count_total", String(params.paginationCountTotal));
          if (params.paginationReverse) searchParams.append("pagination.reverse", String(params.paginationReverse));
          const qs = searchParams.toString();
          if (qs) query = `?${qs}`;
        }
        const response = await fetch(`${this.apiUrl}/ibc/core/connection/v1/connections${query}`);
        return await response.json();
      }
    }
  }

  public poktNetwork = {
    poktroll: {
      application: {
        application: async (params?: {
          paginationKey?: string,
          paginationOffset?: number,
          paginationLimit?: number,
          paginationCountTotal?: boolean,
          paginationReverse?: boolean,
          delegateeGatewayAddress?: string
        }): Promise<{
          applications: {
            address: string,
            delegatee_gateway_addresses: string[],
            pending_transfer: {
              destination_address: string,
              session_end_height: string
            },
            pending_undelegations: {
              additionalProp1: {
                gateway_addresses: string[]
              },
              additionalProp2: {
                gateway_addresses: string[]
              },
              additionalProp3: {
                gateway_addresses: string[]
              }
            },
            service_configs: {
              service_id: string
            }[],
            stake: {
              amount: string,
              denom: string
            },
            unstake_session_end_height: string
          }[],
          pagination: {
            next_key: string,
            total: string
          }
        } | ErrorResponse> => {
          // Build query string from params
          let query = '';
          if (params) {
            const searchParams = new URLSearchParams();
            if (params.paginationKey) searchParams.append("pagination.key", params.paginationKey);
            if (params.paginationOffset) searchParams.append("pagination.offset", params.paginationOffset.toString());
            if (params.paginationLimit) searchParams.append("pagination.limit", params.paginationLimit.toString());
            if (params.paginationCountTotal) searchParams.append("pagination.count_total", String(params.paginationCountTotal));
            if (params.paginationReverse) searchParams.append("pagination.reverse", String(params.paginationReverse));
            if (params.delegateeGatewayAddress) searchParams.append("delegatee_gateway_address", params.delegateeGatewayAddress);
            const qs = searchParams.toString();
            if (qs) query = `?${qs}`;
          }
          const response = await fetch(`${this.apiUrl}/pokt-network/poktroll/application/application${query}`);
          const data = await response.json();
          console.log(data);
          return data;
        },
        application_by_address: async (address: string): Promise<{
          application: {
            address: string,
            delegatee_gateway_addresses: string[],
            pending_transfer: {
              destination_address: string,
              session_end_height: string
            },
            pending_undelegations: {
              additionalProp1: {
                gateway_addresses: string[]
              },
              additionalProp2: {
                gateway_addresses: string[]
              },
              additionalProp3: {
                gateway_addresses: string[]
              }
            },
            service_configs: {
              service_id: string
            }[],
            stake: {
              amount: string,
              denom: string
            },
            unstake_session_end_height: string
          }
        } | ErrorResponse> => {
          const response = await fetch(`${this.apiUrl}/pokt-network/poktroll/application/application/${address}`);
          const data = await response.json();
          return data;
        },
        params: async (): Promise<{
          params: {
            max_delegated_gateways: string,
            min_stake: {
              amount: string,
              denom: string
              }
          }
        } | ErrorResponse> => {
          const response = await fetch(`${this.apiUrl}/pokt-network/poktroll/application/params`);
          const data = await response.json();
          return data;
        }
      },
  
      gateway: {
        gateway: async (params?: {
          paginationKey?: string,
          paginationOffset?: number,
          paginationLimit?: number,
          paginationCountTotal?: boolean,
          paginationReverse?: boolean,
        }): Promise<{
          gateways: {
            address: string,
            stake: {
              amount: string,
              denom: string
            },
            unstake_session_end_height: string
          }[],
          pagination: {
            next_key: string,
            total: string
          }
        } | ErrorResponse> => {
          // Build query string from params
          let query = '';
          if (params) {
            const searchParams = new URLSearchParams();
            if (params.paginationKey) searchParams.append("pagination.key", params.paginationKey);
            if (params.paginationOffset) searchParams.append("pagination.offset", params.paginationOffset.toString());
            if (params.paginationLimit) searchParams.append("pagination.limit", params.paginationLimit.toString());
            if (params.paginationCountTotal) searchParams.append("pagination.count_total", String(params.paginationCountTotal));
            if (params.paginationReverse) searchParams.append("pagination.reverse", String(params.paginationReverse));
            const qs = searchParams.toString();
            if (qs) query = `?${qs}`;
          }
          const response = await fetch(`${this.apiUrl}/pokt-network/poktroll/gateway/gateway${query}`);
          const data = await response.json();
          return data;
        },
        gateway_by_address: async (address: string): Promise<{
          gateway: {
            address: string,
            stake: {
              amount: string,
              denom: string
            },
            unstake_session_end_height: string
          }
        } | ErrorResponse> => {
          const response = await fetch(`${this.apiUrl}/pokt-network/poktroll/gateway/gateway/${address}`);
          const data = await response.json();
          return data;
        },
        params: async (): Promise<{
          params: {
            min_stake: {
              amount: string,
              denom: string
            }
          }
        } | ErrorResponse> => {
          const response = await fetch(`${this.apiUrl}/pokt-network/poktroll/gateway/params`);
          const data = await response.json();
          return data;
        }
      },
  
      service: {
        params: async (): Promise<{
          params: {
            add_service_fee: {
              amount: string,
              denom: string
            },
            target_num_relays: string
          }
        } | ErrorResponse> => {
          const response = await fetch(`${this.apiUrl}/pokt-network/poktroll/service/params`);
          const data = await response.json();
          return data;
        },
        relay_mining_difficulty: async (params?: {
          paginationKey?: string,
          paginationOffset?: number,
          paginationLimit?: number,
          paginationCountTotal?: boolean,
          paginationReverse?: boolean,
        }): Promise<{
          pagination: {
            next_key: string,
            total: string
          },
          relayMiningDifficulty: [
            {
              block_height: string,
              num_relays_ema: string,
              service_id: string,
              target_hash: string
            }
          ]
        } | ErrorResponse> => {
          // Build query string from params
          let query = '';
          if (params) {
            const searchParams = new URLSearchParams();
            if (params.paginationKey) searchParams.append("pagination.key", params.paginationKey);
            if (params.paginationOffset) searchParams.append("pagination.offset", params.paginationOffset.toString());
            if (params.paginationLimit) searchParams.append("pagination.limit", params.paginationLimit.toString());
            if (params.paginationCountTotal) searchParams.append("pagination.count_total", String(params.paginationCountTotal));
            if (params.paginationReverse) searchParams.append("pagination.reverse", String(params.paginationReverse));
            const qs = searchParams.toString();
            if (qs) query = `?${qs}`;
          }
          const response = await fetch(`${this.apiUrl}/pokt-network/poktroll/service/relay_mining_difficulty${query}`);
          const data = await response.json();
          return data;
        },
        relay_mining_difficulty_by_service_id: async (serviceId: string): Promise<{
          relayMiningDifficulty: {
            block_height: string,
            num_relays_ema: string,
            service_id: string,
            target_hash: string
          }
        } | ErrorResponse> => {
          const response = await fetch(`${this.apiUrl}/pokt-network/poktroll/service/relay_mining_difficulty/${serviceId}`);
          const data = await response.json();
          return data;
        },
        service: async (params?: {
          paginationKey?: string,
          paginationOffset?: number,
          paginationLimit?: number,
          paginationCountTotal?: boolean,
          paginationReverse?: boolean,
        }): Promise<{
          pagination: {
            next_key: string,
            total: string
          },
          service: {
            compute_units_per_relay: string,
            id: string,
            name: string,
            owner_address: string
          }[]
        } | ErrorResponse> => {
          // Build query string from params
          let query = '';
          if (params) {
            const searchParams = new URLSearchParams();
            if (params.paginationKey) searchParams.append("pagination.key", params.paginationKey);
            if (params.paginationOffset) searchParams.append("pagination.offset", params.paginationOffset.toString());
            if (params.paginationLimit) searchParams.append("pagination.limit", params.paginationLimit.toString());
            if (params.paginationCountTotal) searchParams.append("pagination.count_total", String(params.paginationCountTotal));
            if (params.paginationReverse) searchParams.append("pagination.reverse", String(params.paginationReverse));
            const qs = searchParams.toString();
            if (qs) query = `?${qs}`;
          }
          const response = await fetch(`${this.apiUrl}/pokt-network/poktroll/service/service${query}`);
          const data = await response.json();
          return data;
        },
      },
  
      supplier: {
        params: async (): Promise<{
          params: {
            min_stake: {
              amount: string,
              denom: string
            },
            staking_fee: {
              amount: string,
              denom: string
            }
          }
        } | ErrorResponse> => {
          const response = await fetch(`${this.apiUrl}/pokt-network/poktroll/supplier/params`);
          const data = await response.json();
          return data;
        },
        supplier: async (params?: {
          paginationKey?: string,
          paginationOffset?: number,
          paginationLimit?: number,
          paginationCountTotal?: boolean,
          paginationReverse?: boolean,
          serviceId?: string,
        }): Promise<{
          pagination: {
            next_key: string,
            total: string
          },
          supplier: {
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
          }[]
        } | ErrorResponse> => {
          // Build query string from params
          let query = '';
          if (params) {
            const searchParams = new URLSearchParams();
            if (params.paginationKey) searchParams.append("pagination.key", params.paginationKey);
            if (params.paginationOffset) searchParams.append("pagination.offset", params.paginationOffset.toString());
            if (params.paginationLimit) searchParams.append("pagination.limit", params.paginationLimit.toString());
            if (params.paginationCountTotal) searchParams.append("pagination.count_total", String(params.paginationCountTotal));
            if (params.paginationReverse) searchParams.append("pagination.reverse", String(params.paginationReverse));
            if (params.serviceId) searchParams.append("service_id", params.serviceId);
            const qs = searchParams.toString();
            if (qs) query = `?${qs}`;
          }
          const response = await fetch(`${this.apiUrl}/pokt-network/poktroll/supplier/supplier${query}`);
          const data = await response.json();
          return data;
        },
        supplier_by_operator_address: async (operatorAddress: string): Promise<{
          supplier: {
            operator_address: string,
            owner_address: string,
            service_config_history: [
              {
                activation_height: string,
                deactivation_height: string,
                operator_address: string,
                service: {
                  endpoints: [
                    {
                      configs: [
                        {
                          key: string,
                          value: string
                        }
                      ],
                      rpc_type: string,
                      url: string
                    }
                  ],
                  rev_share: [
                    {
                      address: string,
                      rev_share_percentage: string
                    }
                  ],
                  service_id: string
                }
              }
            ],
            services: [
              {
                endpoints: [
                  {
                    configs: [
                      {
                        key: string,
                        value: string
                      }
                    ],
                    rpc_type: string,
                    url: string
                  }
                ],
                rev_share: [
                  {
                    address: string,
                    rev_share_percentage: string
                  }
                ],
                service_id: string
              }
            ]
          }
        } | ErrorResponse> => {
          const response = await fetch(`${this.apiUrl}/pokt-network/poktroll/supplier/supplier/${operatorAddress}`);
          const data = await response.json();
          return data;
        }
      },
  
      tokenomics: {
        params: async (): Promise<{
          params: {
            dao_reward_address: string,
            global_inflation_per_claim: number,
            mint_allocation_percentages: {
              application: number,
              dao: number,
              proposer: number,
              source_owner: number,
              supplier: number
            }
          }
        } | ErrorResponse> => {
          const response = await fetch(`${this.apiUrl}/pokt-network/poktroll/tokenomics/params`);
          const data = await response.json();
          return data;
        }
      }
    },
  }
}