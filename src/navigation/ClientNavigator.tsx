import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../core/theme/Colors';

import HomeScreen from '../features/client/screens/HomeScreen';
import DashboardScreen from '../features/client/screens/DashboardScreen';
import MapScreen from '../features/client/screens/MapScreen';
import UploadProofScreen from '../features/client/screens/UploadProofScreen';
import AboutScreen from '../features/client/screens/AboutScreen';

const Tab = createBottomTabNavigator();

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

const TABS: { name: string; icon: IconName; label: string; hideTabBar?: boolean }[] = [
    { name: 'Home', icon: 'home', label: 'Home', hideTabBar: true },
    { name: 'Dashboard', icon: 'sensors', label: 'Monitor' },
    { name: 'Map', icon: 'map', label: 'Map' },
    { name: 'UploadProof', icon: 'add-a-photo', label: 'Upload Proof' },
    { name: 'About', icon: 'info', label: 'About' },
];

const SCREENS: Record<string, React.ComponentType<any>> = {
    Home: HomeScreen,
    Dashboard: DashboardScreen,
    Map: MapScreen,
    UploadProof: UploadProofScreen,
    About: AboutScreen,
};

export function ClientNavigator() {
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: Colors.borderMuted,
                    backgroundColor: Colors.tabBar,
                },
                tabBarActiveTintColor: Colors.tabActive,
                tabBarInactiveTintColor: Colors.tabInactive,
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    marginTop: -4,
                },
                tabBarIcon: ({ color, size, focused }) => {
                    const tab = TABS.find((t) => t.name === route.name);
                    return (
                        <MaterialIcons
                            name={tab?.icon ?? 'circle'}
                            size={focused ? size + 2 : size}
                            color={color}
                        />
                    );
                },
            })}
        >
            {TABS.map((tab) => (
                <Tab.Screen
                    key={tab.name}
                    name={tab.name}
                    component={SCREENS[tab.name]}
                    options={{
                        tabBarLabel: tab.label,
                        ...(tab.hideTabBar && { tabBarStyle: { display: 'none' } }),
                    }}
                />
            ))}
        </Tab.Navigator>
    );
}
