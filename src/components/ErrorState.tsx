import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';

interface Props {
    error: string | null;
    onRetry: () => void;
}

const ErrorState: React.FC<Props> = React.memo(({ error, onRetry }) => (
    <View style={styles.container}>
        <View style={styles.iconContainer}>
            <Text style={styles.icon}>⚠️</Text>
        </View>
        <Text style={styles.title}>Connection Error</Text>
        <Text style={styles.message}>
            {error || 'Unable to connect to the trading feed. Please check your network and try again.'}
        </Text>
        <TouchableOpacity
            style={styles.retryButton}
            onPress={onRetry}
            activeOpacity={0.7}
        >
            <Text style={styles.retryText}>Retry Connection</Text>
        </TouchableOpacity>
    </View>
));

ErrorState.displayName = 'ErrorState';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing['3xl'],
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.accent.redDim,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    icon: {
        fontSize: 36,
    },
    title: {
        color: colors.text.primary,
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.bold,
        marginBottom: spacing.sm,
    },
    message: {
        color: colors.text.secondary,
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.regular,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: spacing['2xl'],
    },
    retryButton: {
        backgroundColor: colors.accent.blue,
        paddingHorizontal: spacing['2xl'],
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        minWidth: 200,
        alignItems: 'center',
    },
    retryText: {
        color: colors.text.primary,
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.semibold,
    },
});

export default ErrorState;
