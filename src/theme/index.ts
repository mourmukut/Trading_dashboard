export const colors = {
    bg: {
        primary: '#0A0E1A',
        secondary: '#111827',
        card: '#1A1F2E',
        cardElevated: '#222839',
        overlay: 'rgba(0, 0, 0, 0.6)',
    },
    text: {
        primary: '#F1F5F9',
        secondary: '#94A3B8',
        tertiary: '#64748B',
        muted: '#475569',
    },
    accent: {
        green: '#00E676',
        greenDim: 'rgba(0, 230, 118, 0.15)',
        greenGlow: 'rgba(0, 230, 118, 0.4)',
        red: '#FF1744',
        redDim: 'rgba(255, 23, 68, 0.15)',
        redGlow: 'rgba(255, 23, 68, 0.4)',
        blue: '#448AFF',
        blueDim: 'rgba(68, 138, 255, 0.15)',
        yellow: '#FFD600',
        yellowDim: 'rgba(255, 214, 0, 0.15)',
    },
    status: {
        connected: '#00E676',
        connecting: '#FFD600',
        reconnecting: '#FF9100',
        error: '#FF1744',
        disconnected: '#64748B',
    },

    border: {
        default: '#2A3042',
        light: '#1E2433',
    },
};

export const typography = {
    sizes: {
        xs: 10,
        sm: 12,
        md: 14,
        lg: 16,
        xl: 18,
        '2xl': 22,
        '3xl': 28,
        '4xl': 34,
    },
    weights: {
        regular: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
        heavy: '800' as const,
    },
    families: {
        mono: 'Menlo' as const,
    },
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
};

export const borderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 999,
};

export const shadows = {
    card: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    cardGlow: (color: string) => ({
        shadowColor: color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
    }),
};

export const animations = {
    priceFlash: 600,
    arrowTransition: 300,
    shimmerCycle: 1500,
    spring: {
        damping: 15,
        stiffness: 150,
        mass: 0.5,
    },
};
