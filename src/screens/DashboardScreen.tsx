import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, StatusBar, RefreshControl } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWebSocket } from '../hooks/useWebSocket';
import {
    useTradingStore,
    useConnectionStatus,
    useHasReceivedData,
    useSymbolOrder,
    useError,
} from '../stores/useTradingStore';
import { WebSocketStatus } from '../types/trading';
import type { TradingPair } from '../types/trading';
import PriceCard from '../components/PriceCard';
import ConnectionStatusBar from '../components/ConnectionStatusBar';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';
import { colors, typography, spacing } from '../theme';

const DashboardScreen: React.FC = () => {
    const { reconnect } = useWebSocket();
    const connectionStatus = useConnectionStatus();
    const hasReceivedData = useHasReceivedData();
    const error = useError();
    const symbolOrder = useSymbolOrder();
    const pairs = useTradingStore(s => s.pairs);

    const orderedPairs = useMemo(
        () => symbolOrder.map(sym => pairs[sym]).filter(Boolean),
        [symbolOrder, pairs],
    );

    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        reconnect();
        setTimeout(() => setRefreshing(false), 1000);
    }, [reconnect]);

    const renderItem = useCallback(
        ({ item }: { item: TradingPair }) => <PriceCard pair={item} />,
        [],
    );

    const keyExtractor = useCallback(
        (item: TradingPair) => item.symbol,
        [],
    );

    const lastUpdatedText = useMemo(() => {
        const now = new Date();
        return now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    }, [connectionStatus]);


    const isLoading =
        (connectionStatus === WebSocketStatus.CONNECTING ||
            connectionStatus === WebSocketStatus.RECONNECTING) &&
        !hasReceivedData;

    const isError =
        connectionStatus === WebSocketStatus.ERROR && !hasReceivedData;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor={colors.bg.primary} />

            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Trading Dashboard</Text>
                    <Text style={styles.subtitle}>Live Crypto Prices</Text>
                </View>
                <View style={styles.headerRight}>
                    <ConnectionStatusBar
                        status={connectionStatus}
                        error={error}
                    />
                </View>
            </View>

            {isLoading ? (
                <LoadingSkeleton />
            ) : isError ? (
                <ErrorState error={error} onRetry={reconnect} />
            ) : (
                <FlashList
                    data={orderedPairs}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={colors.accent.blue}
                            colors={[colors.accent.blue]}
                        />
                    }
                    ListHeaderComponent={
                        <View style={styles.listHeader}>
                            <Text style={styles.pairsCount}>
                                {orderedPairs.length} Trading Pairs
                            </Text>
                            <Text style={styles.lastUpdated}>
                                Updated {lastUpdatedText}
                            </Text>
                        </View>
                    }
                    ListFooterComponent={<View style={styles.listFooter} />}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg.primary,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
    },
    title: {
        color: colors.text.primary,
        fontSize: typography.sizes['3xl'],
        fontWeight: typography.weights.heavy,
        letterSpacing: -0.5,
    },
    subtitle: {
        color: colors.text.tertiary,
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.medium,
        marginTop: 2,
    },
    headerRight: {
        alignItems: 'flex-end',
    },
    listContent: {
        paddingBottom: spacing['4xl'],
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    pairsCount: {
        color: colors.text.secondary,
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.medium,
    },
    lastUpdated: {
        color: colors.text.tertiary,
        fontSize: typography.sizes.xs,
        fontWeight: typography.weights.regular,
    },
    listFooter: {
        height: spacing['4xl'],
    },
});

export default DashboardScreen;
