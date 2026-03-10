import { create } from 'zustand';
import { DEFAULT_TRADING_PAIRS } from '../constants/config';
import {
    PriceDirection,
    WebSocketStatus,
    type TradingPair,
    type BinanceMiniTickerMessage,
} from '../types/trading';
import { sanitizePrice, sanitizeSymbol } from '../utils/security';

interface TradingState {
    pairs: Record<string, TradingPair>;
    symbolOrder: string[];
    connectionStatus: WebSocketStatus;
    error: string | null;
    hasReceivedData: boolean;

    updatePairFromTicker: (msg: BinanceMiniTickerMessage) => void;
    setConnectionStatus: (status: WebSocketStatus) => void;
    setError: (error: string | null) => void;
}

function buildInitialPairs(): Record<string, TradingPair> {
    const pairs: Record<string, TradingPair> = {};
    for (const cfg of DEFAULT_TRADING_PAIRS) {
        const key = cfg.symbol.toUpperCase();
        pairs[key] = {
            symbol: key,
            name: cfg.name,
            shortSymbol: cfg.shortSymbol,
            price: 0,
            prevPrice: 0,
            direction: PriceDirection.NEUTRAL,
            change24h: 0,
            volume: 0,
            high24h: 0,
            low24h: 0,
            lastUpdated: 0,
        };
    }
    return pairs;
}

export const useTradingStore = create<TradingState>((set, get) => ({
    pairs: buildInitialPairs(),
    symbolOrder: DEFAULT_TRADING_PAIRS.map(p => p.symbol.toUpperCase()),
    connectionStatus: WebSocketStatus.DISCONNECTED,
    error: null,
    hasReceivedData: false,

    updatePairFromTicker: (msg: BinanceMiniTickerMessage) => {
        const symbol = sanitizeSymbol(msg.s);
        if (!symbol) return;

        const closePrice = sanitizePrice(msg.c);
        const openPrice = sanitizePrice(msg.o);
        const highPrice = sanitizePrice(msg.h);
        const lowPrice = sanitizePrice(msg.l);
        const volume = sanitizePrice(msg.q);

        if (closePrice === null || openPrice === null) return;

        const state = get();
        const existing = state.pairs[symbol];
        if (!existing) return;

        let direction = PriceDirection.NEUTRAL;
        if (existing.price > 0) {
            if (closePrice > existing.price) {
                direction = PriceDirection.UP;
            } else if (closePrice < existing.price) {
                direction = PriceDirection.DOWN;
            } else {
                direction = existing.direction;
            }
        }

        const change24h =
            openPrice > 0 ? ((closePrice - openPrice) / openPrice) * 100 : 0;

        set(state2 => ({
            hasReceivedData: true,
            pairs: {
                ...state2.pairs,
                [symbol]: {
                    ...existing,
                    price: closePrice,
                    prevPrice: existing.price,
                    direction,
                    change24h,
                    volume: volume ?? existing.volume,
                    high24h: highPrice ?? existing.high24h,
                    low24h: lowPrice ?? existing.low24h,
                    lastUpdated: Date.now(),
                },
            },
        }));
    },

    setConnectionStatus: (status: WebSocketStatus) => {
        set({ connectionStatus: status, error: status === WebSocketStatus.CONNECTED ? null : get().error });
    },

    setError: (error: string | null) => {
        set({ error });
    },
}));

export const usePair = (symbol: string) =>
    useTradingStore(state => state.pairs[symbol]);

export const useConnectionStatus = () =>
    useTradingStore(state => state.connectionStatus);

export const useError = () => useTradingStore(state => state.error);

export const useHasReceivedData = () =>
    useTradingStore(state => state.hasReceivedData);

export const useSymbolOrder = () =>
    useTradingStore(state => state.symbolOrder);
