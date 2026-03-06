# Pocket Network Status Dashboard

A real-time status dashboard for monitoring Pocket Network services, applications, gateways, suppliers, and tokenomics metrics. This dashboard provides comprehensive insights into the Pocket Network ecosystem through an intuitive web interface.

## Prerequisites

Before running this dashboard, ensure you have:

- **Node.js** 18+ or **Bun** runtime
- Access to a Pocket Network API endpoint

## Self-Hosting Guide

### 1. Clone the Repository

```bash
git clone <repository-url>
cd status-dashboard
```

### 2. Install Dependencies

Using Bun (recommended):

```bash
bun install
```

Or using npm:

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and set the following environment variables:

```env
# Pocket Network API URL
NEXT_PUBLIC_POCKET_API_URL=https://your-pocket-api-endpoint.com

# RPC endpoints + per-endpoint API keys (server-only)
RPC_ENDPOINTS_JSON=[{"name":"gateway-a","rpcUrl":"https://path.portal.gateway-a.com/v1","healthUrl":"https://path.portal.gateway-a.com/healthz","apiKey":"your-key-a"},{"name":"gateway-b","rpcUrl":"https://path.portal.gateway-b.com/v1","healthUrl":"https://path.portal.gateway-b.com/healthz","apiKey":"your-key-b"}]

# Optional relay-test performance tuning
# RELAY_TEST_RESPONSE_TTL_MS=300000
# RELAY_TEST_COVERAGE_TTL_MS=900000
# RELAY_TEST_CHAIN_CONCURRENCY=8
# RELAY_TEST_ENDPOINT_CONCURRENCY=3
# RELAY_TEST_ENDPOINT_TIMEOUT_MS=4000
# RELAY_TEST_HEALTH_TIMEOUT_MS=2500
```

**Important**:

- Replace `https://your-pocket-api-endpoint.com` with your actual Pocket Network API URL (Shannon Mainnet).
- `RPC_ENDPOINTS_JSON` must be valid JSON.
- `apiKey` values are server-side only and must **not** use `NEXT_PUBLIC_` env vars.

### 4. Build the Application

```bash
bun run build
```

Or using npm:

```bash
npm run build
```

### 5. Start the Production Server

```bash
bun run start
```

Or using npm:

```bash
npm run start
```

The dashboard will be available at `http://localhost:3000`

## Development

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your
browser to see the result.

## Configuration Options

### Pagination Settings

You can modify default pagination settings in `src/utils/constants.ts`:

```typescript
export const DEFAULT_PAGE_LIMIT = 10;
export const DEFAULT_PAGE_OFFSET = 0;
export const DEFAULT_PAGE_COUNT_TOTAL = true;
export const DEFAULT_PAGE_REVERSE = false;
```

### API Configuration

The dashboard connects to Pocket Network APIs through the configured endpoint. Ensure your API endpoint supports the following endpoints:

- `/pokt-network/poktroll/application/application`
- `/pokt-network/poktroll/gateway/gateway`
- `/pokt-network/poktroll/service/params`
- `/pokt-network/poktroll/supplier/supplier`
- `/pokt-network/poktroll/tokenomics/tokenomics`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 🔗 Links

- [Pocket Network Documentation](https://docs.pokt.network/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 📞 Support

For issues and questions:

- Create an issue in the repository
- Check the troubleshooting section above
- Review the Pocket Network documentation for API-related questions
