import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../core/theme/Colors';
import AnimatedScreen from '../../../components/AnimatedScreen';

export default function AboutScreen() {
    const insets = useSafeAreaInsets();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(28)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
        ]).start();
    }, [fadeAnim, slideAnim]);

    return (
        <AnimatedScreen>
            <ScrollView
                style={styles.page}
                contentContainerStyle={{ paddingBottom: 110 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={[styles.hero, { paddingTop: insets.top + 44 }]}>
                    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                        <Text style={styles.heroTitle}>About</Text>
                        <Text style={styles.heroSub}>
                            Learn more about the Bagumbayan Norte Noise Monitoring initiative.
                        </Text>
                    </Animated.View>
                </View>

                {/* ── Content ── */}
                <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
                    <View style={styles.card}>
                        <Text style={styles.content}>
                            The Bagumbayan Norte Noise Monitoring System is a community-driven initiative
                            designed to track, analyze, and manage environmental noise pollution in our barangay.
                        </Text>
                        <Text style={styles.content}>
                            By deploying a network of real-time sound sensors, our goal is to foster a quieter,
                            healthier environment for all residents through actionable data and community awareness.
                        </Text>
                    </View>
                </Animated.View>
            </ScrollView>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.bgBase,
    },
    // Hero style (copied from HomeScreen)
    hero: {
        backgroundColor: Colors.primaryDark,
        paddingHorizontal: 24,
        paddingBottom: 48,
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
        overflow: 'hidden',
        shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.22, shadowRadius: 20, elevation: 10,
    },
    heroTitle: {
        fontSize: 34, fontWeight: '800', color: Colors.textOnDark,
        lineHeight: 42, marginBottom: 16,
        textShadowColor: Colors.transparentBlack15,
        textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 8,
    },
    heroSub: {
        fontSize: 14, color: Colors.textOnDarkSub, lineHeight: 22,
    },

    contentContainer: {
        paddingHorizontal: 24,
        marginTop: 24,
    },
    card: {
        backgroundColor: Colors.bgCard,
        borderRadius: 16,
        padding: 20,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
    },
    content: {
        fontSize: 15,
        color: Colors.textSecondary,
        lineHeight: 24,
        marginBottom: 16,
    },
    version: {
        fontSize: 13,
        color: Colors.textMuted,
        fontWeight: '600',
        marginTop: 8,
        textAlign: 'center',
    }
});
