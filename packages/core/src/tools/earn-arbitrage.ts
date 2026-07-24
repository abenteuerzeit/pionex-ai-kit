import type { ToolSpec } from "./types.js";

export function registerEarnArbitrageTools(): ToolSpec[] {
  return [
    {
      name: "pionex_earn_arbitrage_fetch_products",
      module: "earn_arbitrage",
      isWrite: false,
      description:
        "List available Earn Arbitrage (InstFund) products. " +
        "Optionally filter by coin. Requires Enable reading permission.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          coin: { type: "string", description: "Filter by coin (e.g. USDT). Omit to return all products." },
          visibility: { type: "string", description: "Visibility filter." },
        },
      },
      async handler(args, { client }) {
        const coin = args.coin as string | undefined;
        const visibility = args.visibility as string | undefined;
        const query: Record<string, string> = {};
        if (coin) query.coin = coin;
        if (visibility) query.visibility = visibility;
        return (await client.signedGet("/api/v1/earn/arbitrage/fetchProducts", query)).data;
      },
    },

    {
      name: "pionex_earn_arbitrage_fetch_user_balances",
      module: "earn_arbitrage",
      isWrite: false,
      description:
        "Get authenticated user's Earn Arbitrage account balances. Requires Enable reading permission.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          businessType: { type: "integer", description: "Business type filter." },
        },
      },
      async handler(args, { client }) {
        const businessType = args.businessType as number | undefined;
        const query: Record<string, string> = {};
        if (businessType != null) query.businessType = String(businessType);
        return (await client.signedGet("/api/v1/earn/arbitrage/fetchUserBalances", query)).data;
      },
    },

    {
      name: "pionex_earn_arbitrage_stake",
      module: "earn_arbitrage",
      isWrite: true,
      description:
        "Stake (invest) into an Earn Arbitrage product. Requires Earn permission. " +
        "Obtain productId from pionex_earn_arbitrage_fetch_products before calling this.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        required: ["amount", "coin", "productId"],
        properties: {
          amount: { type: "string", description: "Amount to stake (e.g. '100')" },
          coin: { type: "string", description: "Coin to stake (e.g. USDT)" },
          productId: { type: "string", description: "Product ID from fetchProducts" },
          uniqueId: { type: "string", description: "Client-assigned idempotency key" },
        },
      },
      async handler(args, { client }) {
        const body: Record<string, unknown> = {
          amount: args.amount,
          coin: args.coin,
          productId: args.productId,
        };
        if (args.uniqueId) body.uniqueId = args.uniqueId;
        return (await client.signedPost("/api/v1/earn/arbitrage/stake", body)).data;
      },
    },

    {
      name: "pionex_earn_arbitrage_un_stake",
      module: "earn_arbitrage",
      isWrite: true,
      description:
        "Unstake (withdraw) from an Earn Arbitrage product. Requires Earn permission. " +
        "Check your balance with pionex_earn_arbitrage_fetch_user_balances before calling this.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        required: ["amount", "coin", "productId"],
        properties: {
          amount: { type: "string", description: "Amount to unstake (e.g. '100')" },
          coin: { type: "string", description: "Coin to unstake (e.g. USDT)" },
          productId: { type: "string", description: "Product ID" },
          uniqueId: { type: "string", description: "Client-assigned idempotency key" },
          unstakeId: { type: "string", description: "Unstake record ID" },
        },
      },
      async handler(args, { client }) {
        const body: Record<string, unknown> = {
          amount: args.amount,
          coin: args.coin,
          productId: args.productId,
        };
        if (args.uniqueId) body.uniqueId = args.uniqueId;
        if (args.unstakeId) body.unstakeId = args.unstakeId;
        return (await client.signedPost("/api/v1/earn/arbitrage/unStake", body)).data;
      },
    },
  ];
}
