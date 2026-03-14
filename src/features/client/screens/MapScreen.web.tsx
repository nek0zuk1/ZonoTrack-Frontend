import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../core/theme/Colors';
import AnimatedScreen from '../../../components/AnimatedScreen';
import { MaterialIcons } from '@expo/vector-icons';

export default function MapScreen() {
    const insets = useSafeAreaInsets();

    const resetView = () => {
        // No-op for web fallback
    };

    return (
        <AnimatedScreen>
            <View style={styles.root}>
                {/* Header - Identical to MapScreen.tsx */}
                <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
                    <View>
                        <Text style={styles.headerTitle}>Noise Heatmap</Text>
                        <Text style={styles.headerSub}>Bagumbayan Norte • Naga City</Text>
                    </View>
                    <TouchableOpacity style={styles.resetBtn} onPress={resetView} activeOpacity={0.7}>
                        <MaterialIcons name="my-location" size={20} color={Colors.primary} />
                    </TouchableOpacity>
                </View>

                {/* Empty State / Fallback for Web */}
                <View style={styles.fallbackContainer}>
                    <View style={styles.iconContainer}>
                        <MaterialIcons name="map" size={48} color={Colors.primary} />
                    </View>
                    <Text style={styles.fallbackTitle}>Map Not Supported on Web</Text>
                    <Text style={styles.fallbackText}>
                        The noise heatmap feature requires native map components which are currently only supported on our iOS and Android applications.
                    </Text>
                    <Text style={styles.fallbackText}>
                        Please use a mobile device to view the interactive heatmap.
                    </Text>
                </View>
            </View>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: Colors.bgBase },

    header: {
        backgroundColor: Colors.bgHeader,
        paddingHorizontal: 20,
        paddingBottom: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
        zIndex: 10,
    },
    headerTitle: { fontSize: 20, fontWeight: '700', color: Colors.textOnDark },
    headerSub: { fontSize: 12, color: Colors.textOnDarkSub, marginTop: 2 },
    resetBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: Colors.bgCard,
        alignItems: 'center', justifyContent: 'center',
        shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12, shadowRadius: 4, elevation: 3,
    },

    fallbackContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingBottom: 80, // Space for bottom tab bar
    },
    iconContainer: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: Colors.bgMuted,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 1,
        borderColor: Colors.borderLight,
    },
    fallbackTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 12,
        textAlign: 'center',
    },
    fallbackText: {
        fontSize: 15,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 8,
        lineHeight: 22,
    },
});
