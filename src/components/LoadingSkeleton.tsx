import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    interpolateColor,
} from 'react-native-reanimated';
import { colors, spacing, borderRadius, animations } from '../theme';

const SkeletonCard: React.FC = () => {
    const shimmer = useSharedValue(0);

    useEffect(() => {
        shimmer.value = withRepeat(
            withTiming(1, { duration: animations.shimmerCycle }),
            -1,
            true,
        );
    }, [shimmer]);

    const animatedBg = useAnimatedStyle(() => {
        const bgColor = interpolateColor(
            shimmer.value,
            [0, 1],
            [colors.bg.card, colors.bg.cardElevated],
        );
        return { backgroundColor: bgColor };
    });

    return (
        <Animated.View style={[styles.card, animatedBg]}>
            {/* Top row skeleton */}
            <View style={styles.topRow}>
                <View style={styles.row}>
                    <View style={styles.iconPlaceholder} />
                    <View>
                        <View style={[styles.textBlock, { width: 60, height: 14 }]} />
                        <View
                            style={[
                                styles.textBlock,
                                { width: 80, height: 10, marginTop: 6 },
                            ]}
                        />
                    </View>
                </View>
                <View style={[styles.textBlock, { width: 24, height: 24, borderRadius: 12 }]} />
            </View>

            {/* Price row skeleton */}
            <View style={styles.priceRow}>
                <View style={[styles.textBlock, { width: 140, height: 22 }]} />
                <View style={[styles.textBlock, { width: 70, height: 26, borderRadius: 8 }]} />
            </View>

            {/* Bottom row skeleton */}
            <View style={styles.bottomRow}>
                {[1, 2, 3].map(i => (
                    <View key={i} style={styles.statPlaceholder}>
                        <View style={[styles.textBlock, { width: 30, height: 8 }]} />
                        <View
                            style={[
                                styles.textBlock,
                                { width: 50, height: 10, marginTop: 4 },
                            ]}
                        />
                    </View>
                ))}
            </View>
        </Animated.View>
    );
};

const LoadingSkeleton: React.FC = React.memo(() => (
    <View style={styles.container}>
        {[1, 2, 3, 4, 5].map(i => (
            <SkeletonCard key={i} />
        ))}
    </View>
));

LoadingSkeleton.displayName = 'LoadingSkeleton';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: spacing.sm,
    },
    card: {
        backgroundColor: colors.bg.card,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginHorizontal: spacing.lg,
        marginVertical: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border.default,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.bg.cardElevated,
        marginRight: spacing.md,
    },
    textBlock: {
        backgroundColor: colors.bg.cardElevated,
        borderRadius: 4,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: colors.border.light,
        paddingTop: spacing.md,
    },
    statPlaceholder: {
        alignItems: 'center',
    },
});

export default LoadingSkeleton;
