
// ─── WebSocket ───────────────────────────────────────────────
export const WS_BASE_URL = 'wss://stream.binance.com:9443';

export const RECONNECT_MAX_RETRIES = 10;
export const RECONNECT_BASE_DELAY_MS = 1000;
export const RECONNECT_MAX_DELAY_MS = 30000;

export const HEARTBEAT_INTERVAL_MS = 30000;
export const HEARTBEAT_TIMEOUT_MS = 10000;

export const THROTTLE_INTERVAL_MS = 250;

export interface TradingPairConfig {
    symbol: string;
    name: string;
    shortSymbol: string;
}

export const DEFAULT_TRADING_PAIRS: TradingPairConfig[] = [
    { symbol: 'btcusdt', name: 'Bitcoin', shortSymbol: 'BTC' },
    { symbol: 'ethusdt', name: 'Ethereum', shortSymbol: 'ETH' },
    { symbol: 'solusdt', name: 'Solana', shortSymbol: 'SOL' },
    { symbol: 'bnbusdt', name: 'BNB', shortSymbol: 'BNB' },
    { symbol: 'xrpusdt', name: 'XRP', shortSymbol: 'XRP' },
    { symbol: 'adausdt', name: 'Cardano', shortSymbol: 'ADA' },
    { symbol: 'dogeusdt', name: 'Dogecoin', shortSymbol: 'DOGE' },
    { symbol: 'dotusdt', name: 'Polkadot', shortSymbol: 'DOT' },
    { symbol: 'avaxusdt', name: 'Avalanche', shortSymbol: 'AVAX' },
    { symbol: 'maticusdt', name: 'Polygon', shortSymbol: 'MATIC' },
    { symbol: 'linkusdt', name: 'Chainlink', shortSymbol: 'LINK' },
    { symbol: 'ltcusdt', name: 'Litecoin', shortSymbol: 'LTC' },
];

export function buildStreamUrl(pairs: TradingPairConfig[]): string {
    const streams = pairs.map(p => `${p.symbol}@miniTicker`).join('/');
    return `${WS_BASE_URL}/stream?streams=${streams}`;
}
