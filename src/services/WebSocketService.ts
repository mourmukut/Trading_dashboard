import {
    buildStreamUrl,
    DEFAULT_TRADING_PAIRS,
    HEARTBEAT_INTERVAL_MS,
    HEARTBEAT_TIMEOUT_MS,
    RECONNECT_BASE_DELAY_MS,
    RECONNECT_MAX_DELAY_MS,
    RECONNECT_MAX_RETRIES,
    THROTTLE_INTERVAL_MS,
} from '../constants/config';
import type { TradingPairConfig } from '../constants/config';
import type { BinanceCombinedStreamMessage, BinanceMiniTickerMessage } from '../types/trading';
import { WebSocketStatus } from '../types/trading';
import { validateBinanceMessage } from '../utils/security';

type MessageCallback = (data: BinanceMiniTickerMessage) => void;
type StatusCallback = (status: WebSocketStatus, error?: string) => void;

class WebSocketService {
    private static instance: WebSocketService | null = null;

    private ws: WebSocket | null = null;
    private pairs: TradingPairConfig[] = DEFAULT_TRADING_PAIRS;

    private onMessageCallback: MessageCallback | null = null;
    private onStatusCallback: StatusCallback | null = null;

    private retryCount = 0;
    private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
    private pongTimer: ReturnType<typeof setTimeout> | null = null;
    private lastPongReceived = 0;

    private messageBuffer: Map<string, BinanceMiniTickerMessage> = new Map();
    private throttleTimer: ReturnType<typeof setInterval> | null = null;

    private isManualDisconnect = false;
    private currentStatus: WebSocketStatus = WebSocketStatus.DISCONNECTED;

    private constructor() { }

    static getInstance(): WebSocketService {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    /**
     * Register a callback for validated, throttled messages.
     */
    onMessage(callback: MessageCallback): void {
        this.onMessageCallback = callback;
    }

    /**
     * Register a callback for connection status changes.
     */
    onStatusChange(callback: StatusCallback): void {
        this.onStatusCallback = callback;
    }

    /**
     * Connect to the Binance WebSocket combined stream.
     */
    connect(pairs?: TradingPairConfig[]): void {
        if (pairs) {
            this.pairs = pairs;
        }

        this.isManualDisconnect = false;
        this.retryCount = 0;
        this.doConnect();
    }

    /**
     * Gracefully disconnect and clean up all timers.
     */
    disconnect(): void {
        this.isManualDisconnect = true;
        this.cleanup();
        this.setStatus(WebSocketStatus.DISCONNECTED);
    }

    /**
     * Force a reconnection attempt (e.g., user taps "Retry").
     */
    reconnect(): void {
        this.cleanup();
        this.isManualDisconnect = false;
        this.retryCount = 0;
        this.doConnect();
    }

    getStatus(): WebSocketStatus {
        return this.currentStatus;
    }

    private doConnect(): void {
        this.cleanup();
        this.setStatus(
            this.retryCount > 0
                ? WebSocketStatus.RECONNECTING
                : WebSocketStatus.CONNECTING,
        );

        const url = buildStreamUrl(this.pairs);

        try {
            this.ws = new WebSocket(url);
        } catch (err) {
            this.handleError('Failed to create WebSocket connection');
            return;
        }

        this.ws.onopen = this.handleOpen.bind(this);
        this.ws.onmessage = this.handleMessage.bind(this);
        this.ws.onerror = this.handleWsError.bind(this);
        this.ws.onclose = this.handleClose.bind(this);
    }

    private handleOpen(): void {
        this.retryCount = 0;
        this.setStatus(WebSocketStatus.CONNECTED);
        this.startHeartbeat();
        this.startThrottleFlush();
    }

    private handleMessage(event: WebSocketMessageEvent): void {
        try {
            const parsed = JSON.parse(event.data) as BinanceCombinedStreamMessage;
            const tickerData = parsed.data || parsed;

            const validated = validateBinanceMessage(tickerData);
            if (!validated) return;

            this.messageBuffer.set(validated.s, validated);
            this.lastPongReceived = Date.now();
        } catch {
        }
    }

    private handleWsError(_event: Event): void {
    }

    private handleClose(event: WebSocketCloseEvent): void {
        this.stopHeartbeat();
        this.stopThrottleFlush();

        if (this.isManualDisconnect) return;

        // Attempt reconnection
        if (this.retryCount < RECONNECT_MAX_RETRIES) {
            this.scheduleReconnect();
        } else {
            this.handleError(
                `Connection lost after ${RECONNECT_MAX_RETRIES} retries (code: ${event.code})`,
            );
        }
    }

    private scheduleReconnect(): void {
        this.setStatus(WebSocketStatus.RECONNECTING);

        const delay = Math.min(
            RECONNECT_BASE_DELAY_MS * Math.pow(2, this.retryCount) +
            Math.random() * 1000,
            RECONNECT_MAX_DELAY_MS,
        );

        this.retryCount++;

        this.reconnectTimer = setTimeout(() => {
            this.doConnect();
        }, delay);
    }

    private startHeartbeat(): void {
        this.lastPongReceived = Date.now();

        this.heartbeatTimer = setInterval(() => {
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

            const elapsed = Date.now() - this.lastPongReceived;
            if (elapsed > HEARTBEAT_INTERVAL_MS + HEARTBEAT_TIMEOUT_MS) {
                this.ws?.close();
                return;
            }

            try {
                this.ws.send(JSON.stringify({ method: 'PING' }));
            } catch {
            }
        }, HEARTBEAT_INTERVAL_MS);
    }

    private stopHeartbeat(): void {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
        if (this.pongTimer) {
            clearTimeout(this.pongTimer);
            this.pongTimer = null;
        }
    }

    // ─── Throttled Flush ───────────────────────────────────────

    private startThrottleFlush(): void {
        this.throttleTimer = setInterval(() => {
            if (this.messageBuffer.size === 0) return;

            // Flush all buffered messages
            this.messageBuffer.forEach(msg => {
                this.onMessageCallback?.(msg);
            });
            this.messageBuffer.clear();
        }, THROTTLE_INTERVAL_MS);
    }

    private stopThrottleFlush(): void {
        if (this.throttleTimer) {
            clearInterval(this.throttleTimer);
            this.throttleTimer = null;
        }
    }

    // ─── Helpers ───────────────────────────────────────────────

    private setStatus(status: WebSocketStatus, error?: string): void {
        this.currentStatus = status;
        this.onStatusCallback?.(status, error);
    }

    private handleError(message: string): void {
        this.setStatus(WebSocketStatus.ERROR, message);
    }

    private cleanup(): void {
        this.stopHeartbeat();
        this.stopThrottleFlush();
        this.messageBuffer.clear();

        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }

        if (this.ws) {
            this.ws.onopen = null;
            this.ws.onmessage = null;
            this.ws.onerror = null;
            this.ws.onclose = null;

            if (
                this.ws.readyState === WebSocket.OPEN ||
                this.ws.readyState === WebSocket.CONNECTING
            ) {
                this.ws.close();
            }
            this.ws = null;
        }
    }
}

export default WebSocketService;
