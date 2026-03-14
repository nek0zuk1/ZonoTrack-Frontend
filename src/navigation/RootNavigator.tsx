import React, { useContext } from 'react';
import { Platform, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from '../core/auth/AuthContext';
import { ClientNavigator } from './ClientNavigator';
import { AdminNavigator } from './AdminNavigator';
import { AuthNavigator } from './AuthNavigator';
import { Colors } from '../core/theme/Colors';

export function RootNavigator() {
    const { user, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bgBase }}>
                <Text style={{ color: Colors.primary }}>Loading Bagumbayan Norte Systems...</Text>
            </View>
        );
    }

    // Simplistic mock: In reality, we'd render <AuthNavigator /> here if !user
    // But for architecture setup, we'll route straight to the application logic based on Platform.

    const isWeb = Platform.OS === 'web';

    // An additional enterprise check you would perform:
    // const showAdmin = isWeb && user?.isAdmin;

    return (
        <NavigationContainer>
            {!user ? (
                <AuthNavigator />
            ) : isWeb ? (
                <AdminNavigator />
            ) : (
                <ClientNavigator />
            )}
        </NavigationContainer>
    );
}
