import { useEffect, useCallback, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import WebSocketService from '../services/WebSocketService';
import { useTradingStore } from '../stores/useTradingStore';

export function useWebSocket() {
    const updatePairFromTicker = useTradingStore(s => s.updatePairFromTicker);
    const setConnectionStatus = useTradingStore(s => s.setConnectionStatus);
    const setError = useTradingStore(s => s.setError);
    const connectionStatus = useTradingStore(s => s.connectionStatus);
    const error = useTradingStore(s => s.error);

    const serviceRef = useRef<WebSocketService | null>(null);
    const appStateRef = useRef<AppStateStatus>(AppState.currentState);

    useEffect(() => {
        const service = WebSocketService.getInstance();
        serviceRef.current = service;

        service.onMessage(msg => {
            updatePairFromTicker(msg);
        });

        service.onStatusChange((status, errorMsg) => {
            setConnectionStatus(status);
            if (errorMsg) {
                setError(errorMsg);
            }
        });

        service.connect();

        const subscription = AppState.addEventListener(
            'change',
            (nextState: AppStateStatus) => {
                const prevState = appStateRef.current;
                appStateRef.current = nextState;

                if (prevState.match(/inactive|background/) && nextState === 'active') {
                    service.reconnect();
                } else if (nextState.match(/inactive|background/)) {
                    service.disconnect();
                }
            },
        );

        return () => {
            subscription.remove();
            service.disconnect();
        };
    }, []);

    const reconnect = useCallback(() => {
        serviceRef.current?.reconnect();
    }, []);

    return {
        connectionStatus,
        error,
        reconnect,
    };
}
