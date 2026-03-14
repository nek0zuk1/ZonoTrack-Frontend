// Unified Color Palette for Bagumbayan Norte Noise Monitoring System

export const Colors = {
    // Primary Greens
    primary: '#2E7D32',        // Main brand green
    primaryDark: '#1B5E20',    // Darkest green (hero headers)
    primaryMid: '#388E3C',     // Mid green (accents)
    primaryLight: '#4CAF50',   // Light green (active states)
    primaryPale: '#66BB6A',    // Very light green (subtle)

    // Backgrounds
    bgBase: '#F1F8F1',         // Main app background (soft green tint)
    bgCard: '#FFFFFF',         // Card background
    bgHeader: '#1B5E20',       // Screen header background
    bgMuted: '#E8F5E9',        // Muted/pale section background

    // Text
    textPrimary: '#1C2B1E',    // Primary text (near-black green tint)
    textSecondary: '#546E7A',  // Secondary / label text
    textMuted: '#90A4AE',      // Muted metadata text
    textOnDark: '#FFFFFF',     // Text on dark backgrounds
    textOnDarkSub: 'rgba(255,255,255,0.8)',

    // Status / Alert
    statusActive: '#00C853',   // Active sensor
    statusWarning: '#FF9800',  // Elevated noise / warning
    statusCritical: '#F44336', // Critical / high noise
    statusInactive: '#90A4AE', // Offline / inactive

    // Noise level thresholds
    noiseNormal: '#4CAF50',    // < 55 dB
    noiseElevated: '#FF9800',  // 55–70 dB
    noiseCritical: '#F44336',  // > 70 dB

    // Decorative
    borderLight: '#E0EFE0',
    borderMuted: '#CFD8DC',
    shadow: '#000000',
    tabActive: '#2E7D32',
    tabInactive: '#90A4AE',
    tabBar: 'rgba(255,255,255,0.97)',
    // Additional theme colors
    bgBlueMuted: '#E3F2FD',
    bgOrangeMuted: '#FFF3E0',
    chartBlue: '#2196F3',

    // Transparent / Alpha Colors
    transparentWhite12: 'rgba(255,255,255,0.12)',
    transparentWhite16: 'rgba(255,255,255,0.16)',
    transparentWhite22: 'rgba(255,255,255,0.22)',
    transparentWhite75: 'rgba(255,255,255,0.75)',
    transparentBlack10: 'rgba(0,0,0,0.10)',
    transparentBlack12: 'rgba(0,0,0,0.12)',
    transparentBlack15: 'rgba(0,0,0,0.15)',

    transparent: 'transparent',
};

// Append a 2-digit hex alpha to a 6-char hex color
export const withAlpha = (hex: string, alpha: number): string => {
    const a = Math.round(Math.max(0, Math.min(255, alpha * 255)))
        .toString(16)
        .padStart(2, '0');
    return hex + a;
};

export const getNoiseLevelColor = (db: number, active = true, isNight = false): string => {
    if (!active) return Colors.statusInactive;
    const critical = isNight ? 60 : 70;
    const elevated = isNight ? 45 : 55;
    if (db > critical) return Colors.noiseCritical;
    if (db > elevated) return Colors.noiseElevated;
    return Colors.noiseNormal;
};

export const getNoiseLevelLabel = (db: number, active = true, isNight = false): string => {
    if (!active) return 'Offline';
    const critical = isNight ? 60 : 70;
    const elevated = isNight ? 45 : 55;
    if (db > critical) return 'Critical';
    if (db > elevated) return 'Elevated';
    return 'Normal';
};
