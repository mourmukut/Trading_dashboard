import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PriceDirection, type TradingPair } from '../types/trading';
import PriceDirectionArrow from './PriceDirectionArrow';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';

interface Props {
    pair: TradingPair;
}

function formatPrice(price: number): string {
    if (price === 0) return '—';
    if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (price >= 1) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
    return price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 });
}

function formatVolume(vol: number): string {
    if (vol === 0) return '—';
    if (vol >= 1_000_000_000) return `${(vol / 1_000_000_000).toFixed(2)}B`;
    if (vol >= 1_000_000) return `${(vol / 1_000_000).toFixed(2)}M`;
    if (vol >= 1_000) return `${(vol / 1_000).toFixed(2)}K`;
    return vol.toFixed(2);
}

const PriceCard: React.FC<Props> = React.memo(
    ({ pair }) => {
        const isUp = pair.direction === PriceDirection.UP;
        const isDown = pair.direction === PriceDirection.DOWN;
        const changeColor = isUp ? colors.accent.green : isDown ? colors.accent.red : colors.text.secondary;
        const changeBgColor = isUp ? colors.accent.greenDim : isDown ? colors.accent.redDim : 'transparent';
        const priceColor = isUp ? colors.accent.green : isDown ? colors.accent.red : colors.text.primary;

        const glowShadow = isUp
            ? shadows.cardGlow(colors.accent.greenGlow)
            : isDown
                ? shadows.cardGlow(colors.accent.redGlow)
                : shadows.card;

        return (
            <View style={[styles.card, glowShadow]}>
                <View style={styles.topRow}>
                    <View style={styles.symbolArea}>
                        <View style={[styles.iconCircle, { backgroundColor: isUp ? colors.accent.greenDim : isDown ? colors.accent.redDim : colors.accent.blueDim }]}>
                            <Text style={styles.iconText}>{pair.shortSymbol.charAt(0)}</Text>
                        </View>
                        <View style={styles.nameContainer}>
                            <Text style={styles.shortSymbol}>{pair.shortSymbol}</Text>
                            <Text style={styles.name}>{pair.name}</Text>
                        </View>
                    </View>
                    <PriceDirectionArrow direction={pair.direction} />
                </View>
                <View style={styles.priceRow}>
                    <Text style={[styles.price, { color: priceColor }]}>${formatPrice(pair.price)}</Text>
                    <View style={[styles.changeBadge, { backgroundColor: changeBgColor }]}>
                        <Text style={[styles.changeText, { color: changeColor }]}>
                            {pair.change24h >= 0 ? '+' : ''}
                            {pair.change24h.toFixed(2)}%
                        </Text>
                    </View>
                </View>
                <View style={styles.bottomRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Vol</Text>
                        <Text style={styles.statValue}>${formatVolume(pair.volume)}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>24h H</Text>
                        <Text style={styles.statValue}>${formatPrice(pair.high24h)}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>24h L</Text>
                        <Text style={styles.statValue}>${formatPrice(pair.low24h)}</Text>
                    </View>
                </View>
            </View>
        );
    },

    (prev, next) =>
        prev.pair.price === next.pair.price &&
        prev.pair.direction === next.pair.direction &&
        prev.pair.change24h === next.pair.change24h &&
        prev.pair.volume === next.pair.volume,
);

PriceCard.displayName = 'PriceCard';

const styles = StyleSheet.create({
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
    symbolArea: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    iconText: {
        color: colors.text.primary,
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.bold,
    },
    nameContainer: {
        justifyContent: 'center',
    },
    shortSymbol: {
        color: colors.text.primary,
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.bold,
        letterSpacing: 0.5,
    },
    name: {
        color: colors.text.secondary,
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.regular,
        marginTop: 2,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    price: {
        color: colors.text.primary,
        fontSize: typography.sizes['2xl'],
        fontWeight: typography.weights.heavy,
        fontFamily: typography.families.mono,
        letterSpacing: -0.5,
    },
    changeBadge: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
    },
    changeText: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
        fontFamily: typography.families.mono,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: colors.border.light,
        paddingTop: spacing.md,
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        color: colors.text.tertiary,
        fontSize: typography.sizes.xs,
        fontWeight: typography.weights.medium,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 2,
    },
    statValue: {
        color: colors.text.secondary,
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.medium,
        fontFamily: typography.families.mono,
    },
});

export default PriceCard;
