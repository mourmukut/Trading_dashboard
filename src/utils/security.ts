import type { BinanceMiniTickerMessage } from '../types/trading';

export function sanitizePrice(raw: unknown): number | null {
    if (raw === null || raw === undefined) return null;

    const num = typeof raw === 'string' ? parseFloat(raw) : Number(raw);

    if (!Number.isFinite(num) || num < 0) return null;

    return num;
}

export function sanitizeSymbol(raw: unknown): string | null {
    if (typeof raw !== 'string') return null;

    const cleaned = raw.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

    if (cleaned.length === 0 || cleaned.length > 20) return null;

    return cleaned;
}

export function validateBinanceMessage(
    data: unknown,
): BinanceMiniTickerMessage | null {
    if (!data || typeof data !== 'object') return null;

    const msg = data as Record<string, unknown>;

    if (msg.e !== '24hrMiniTicker') return null;

    const stringFields: (keyof BinanceMiniTickerMessage)[] = [
        's', 'c', 'o', 'h', 'l', 'v', 'q',
    ];
    for (const field of stringFields) {
        if (typeof msg[field] !== 'string') return null;
    }

    if (typeof msg.E !== 'number' || !Number.isFinite(msg.E)) return null;

    const priceFields = ['c', 'o', 'h', 'l'];
    for (const field of priceFields) {
        const num = parseFloat(msg[field] as string);
        if (!Number.isFinite(num) || num < 0) return null;
    }

    return data as BinanceMiniTickerMessage;
}
