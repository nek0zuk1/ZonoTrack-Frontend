import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface AnimatedScreenProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

/**
 * Stripped down screen wrapper to disable sliding/fading features.
 */
export default function AnimatedScreen({ children, style }: AnimatedScreenProps) {
    return (
        <View style={[styles.container, style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
