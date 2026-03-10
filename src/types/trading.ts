export enum WebSocketStatus {
    CONNECTING = 'CONNECTING',
    CONNECTED = 'CONNECTED',
    DISCONNECTED = 'DISCONNECTED',
    RECONNECTING = 'RECONNECTING',
    ERROR = 'ERROR',
}

export enum PriceDirection {
    UP = 'UP',
    DOWN = 'DOWN',
    NEUTRAL = 'NEUTRAL',
}

export interface TradingPair {
    symbol: string;
    name: string;
    shortSymbol: string;
    price: number;
    prevPrice: number;
    direction: PriceDirection;
    change24h: number;
    volume: number;
    high24h: number;
    low24h: number;
    lastUpdated: number;
}

export interface BinanceMiniTickerMessage {
    e: string;
    E: number;
    s: string;
    c: string;
    o: string;
    h: string;
    l: string;
    v: string;
    q: string;
}

export interface BinanceCombinedStreamMessage {
    stream: string;
    data: BinanceMiniTickerMessage;
}
