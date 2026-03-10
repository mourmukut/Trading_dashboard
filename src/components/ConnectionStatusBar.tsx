import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { WebSocketStatus } from '../types/trading';
import { colors, typography, spacing } from '../theme';

interface Props {
    status: WebSocketStatus;
    error?: string | null;
}

const STATUS_CONFIG: Record<
    WebSocketStatus,
    { label: string; color: string; pulse: boolean }
> = {
    [WebSocketStatus.CONNECTED]: {
        label: 'Live',
        color: colors.status.connected,
        pulse: false,
    },
    [WebSocketStatus.CONNECTING]: {
        label: 'Connecting...',
        color: colors.status.connecting,
        pulse: true,
    },
    [WebSocketStatus.RECONNECTING]: {
        label: 'Reconnecting...',
        color: colors.status.reconnecting,
        pulse: true,
    },
    [WebSocketStatus.DISCONNECTED]: {
        label: 'Disconnected',
        color: colors.status.disconnected,
        pulse: false,
    },
    [WebSocketStatus.ERROR]: {
        label: 'Connection Error',
        color: colors.status.error,
        pulse: true,
    },
};

const ConnectionStatusBar: React.FC<Props> = React.memo(({ status }) => {
    const config = STATUS_CONFIG[status];
    const pulseOpacity = useSharedValue(1);

    React.useEffect(() => {
        if (config.pulse) {
            pulseOpacity.value = withRepeat(
                withSequence(
                    withTiming(0.4, { duration: 800 }),
                    withTiming(1, { duration: 800 }),
                ),
                -1,
                false,
            );
        } else {
            pulseOpacity.value = withTiming(1, { duration: 200 });
        }
    }, [config.pulse, pulseOpacity]);

    const dotStyle = useAnimatedStyle(() => ({
        opacity: pulseOpacity.value,
    }));

    if (status === WebSocketStatus.CONNECTED) {
        return (
            <View style={styles.connectedBar}>
                <Animated.View
                    style={[
                        styles.dot,
                        { backgroundColor: config.color },
                        dotStyle,
                    ]}
                />
                <Text style={[styles.label, { color: config.color }]}>
                    {config.label}
                </Text>
            </View>
        );
    }

    return (
        <View style={[styles.bar, { backgroundColor: config.color + '22' }]}>
            <Animated.View
                style={[styles.dot, { backgroundColor: config.color }, dotStyle]}
            />
            <Text style={[styles.label, { color: config.color }]}>
                {config.label}
            </Text>
        </View>
    );
});

ConnectionStatusBar.displayName = 'ConnectionStatusBar';

const styles = StyleSheet.create({
    connectedBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.xs,
    },
    bar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        marginHorizontal: spacing.lg,
        marginBottom: spacing.sm,
        borderRadius: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: spacing.sm,
    },
    label: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semibold,
        letterSpacing: 0.5,
    },
});

export default ConnectionStatusBar;
