import { env } from "./env";

export interface ErrorResponse {
  code: number,
  details: {
    "@type": string
  }[],
  message: string
}

export class PocketApi {
  private readonly apiUrl: string;

  constructor() {
    this.apiUrl = env.apiUrl;
  }

  public poktroll = {
    application: {
      application: async (): Promise<{
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
        const response = await fetch(`${this.apiUrl}/poktroll/application/application`);
        const data = await response.json();
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
        const response = await fetch(`${this.apiUrl}/poktroll/application/application/${address}`);
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
        const response = await fetch(`${this.apiUrl}/poktroll/application/params`);
        const data = await response.json();
        return data;
      }
    },

    gateway: {
      gateway: async (): Promise<{
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
        const response = await fetch(`${this.apiUrl}/poktroll/gateway/gateway`);
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
        const response = await fetch(`${this.apiUrl}/poktroll/gateway/gateway/${address}`);
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
        const response = await fetch(`${this.apiUrl}/poktroll/gateway/params`);
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
        const response = await fetch(`${this.apiUrl}/poktroll/service/params`);
        const data = await response.json();
        return data;
      },
      service: async (): Promise<{
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
        const response = await fetch(`${this.apiUrl}/poktroll/service/service`);
        const data = await response.json();
        return data;
      },
    }
  };
}