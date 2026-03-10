import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { PriceDirection } from '../types/trading';
import { colors, animations } from '../theme';

interface Props {
    direction: PriceDirection;
}

const PriceDirectionArrow: React.FC<Props> = React.memo(({ direction }) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    React.useEffect(() => {
        if (direction !== PriceDirection.NEUTRAL) {
            scale.value = 1.4;
            scale.value = withSpring(1, animations.spring);
            opacity.value = 0.6;
            opacity.value = withTiming(1, { duration: animations.priceFlash });
        }
    }, [direction, scale, opacity]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    const arrowChar = direction === PriceDirection.UP ? '↑' : direction === PriceDirection.DOWN ? '↓' : '–';
    const arrowColor =
        direction === PriceDirection.UP
            ? colors.accent.green
            : direction === PriceDirection.DOWN
                ? colors.accent.red
                : colors.text.tertiary;

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            <Text style={[styles.arrow, { color: arrowColor }]}>{arrowChar}</Text>
        </Animated.View>
    );
});

PriceDirectionArrow.displayName = 'PriceDirectionArrow';

const styles = StyleSheet.create({
    container: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrow: {
        fontSize: 20,
        fontWeight: '700',
    },
});

export default PriceDirectionArrow;
