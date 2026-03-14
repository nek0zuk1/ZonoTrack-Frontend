import React, { useContext, useMemo, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import { Colors } from '../../../core/theme/Colors';
import { AuthContext } from '../../../core/auth/AuthContext';
import AdminUsers from '../components/AdminUsers';
import AdminAnalytics from '../components/AdminAnalytics';
import { MaterialIcons } from '@expo/vector-icons';

type AdminTab = 'Dashboard' | 'Users' | 'Reports';

const NAV_ITEMS: { key: AdminTab; icon: keyof typeof MaterialIcons.glyphMap }[] = [
    { key: 'Dashboard', icon: 'dashboard' },
    { key: 'Users', icon: 'people' },
    { key: 'Reports', icon: 'assessment' },
];

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<AdminTab>('Dashboard');
    const { logout } = useContext(AuthContext);
    const { width } = useWindowDimensions();
    const isCompact = width < 980;
    const dateLabel = useMemo(
        () =>
            new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            }),
        []
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'Users':
                return <AdminUsers />;
            case 'Reports':
                return <AdminAnalytics />;
            case 'Dashboard':
            default:
                return (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.homeContentWrap}>
                        <View style={styles.heroCard}>
                            <Text style={styles.heroTitle}>Welcome to the Admin Portal</Text>
                            <Text style={styles.heroSubtitle}>
                                Monitor operational status, manage accounts, and review reports from one command center.
                            </Text>
                        </View>

                        <View style={styles.kpiRow}>
                            <View style={styles.kpiCard}>
                                <Text style={styles.kpiLabel}>Active Sensors</Text>
                                <Text style={styles.kpiValue}>12</Text>
                            </View>
                            <View style={styles.kpiCard}>
                                <Text style={styles.kpiLabel}>Open Incidents</Text>
                                <Text style={[styles.kpiValue, { color: Colors.statusWarning }]}>8</Text>
                            </View>
                            <View style={styles.kpiCard}>
                                <Text style={styles.kpiLabel}>Filed Reports</Text>
                                <Text style={styles.kpiValue}>45</Text>
                            </View>
                        </View>

                        <View style={styles.quickActionsCard}>
                            <Text style={styles.sectionTitle}>Quick Actions</Text>
                            <View style={styles.quickActionsRow}>
                                <TouchableOpacity style={styles.quickButton} onPress={() => setActiveTab('Users')}>
                                    <MaterialIcons name="person-add" size={18} color={Colors.primaryDark} />
                                    <Text style={styles.quickButtonText}>Create User</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.quickButton} onPress={() => setActiveTab('Reports')}>
                                    <MaterialIcons name="summarize" size={18} color={Colors.primaryDark} />
                                    <Text style={styles.quickButtonText}>View Reports</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                );
        }
    };

    const renderNav = () => (
        <View style={[styles.navWrap, isCompact && styles.navWrapCompact]}>
            <View>
                <Text style={styles.logo}>Bagumbayan Admin</Text>
                <Text style={styles.logoSub}>Noise Monitoring Control</Text>
            </View>

            <View style={[styles.navLinks, isCompact && styles.navLinksCompact]}>
                {NAV_ITEMS.map((item) => {
                    const isActive = activeTab === item.key;
                    return (
                        <TouchableOpacity
                            key={item.key}
                            onPress={() => setActiveTab(item.key)}
                            style={[styles.navItem, isActive && styles.navItemActive]}
                        >
                            <MaterialIcons
                                name={item.icon}
                                size={18}
                                color={isActive ? Colors.textOnDark : Colors.textOnDarkSub}
                            />
                            <Text style={[styles.navText, isActive && styles.navTextActive]}>{item.key}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                <MaterialIcons name="logout" size={18} color={Colors.statusCritical} />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={[styles.container, isCompact && styles.containerCompact]}>
            {renderNav()}
            <View style={styles.content}>
                <View style={styles.topBar}>
                    <View>
                        <Text style={styles.topBarTitle}>{activeTab}</Text>
                        <Text style={styles.topBarSub}>Administrative workspace</Text>
                    </View>
                    <Text style={styles.dateText}>{dateLabel}</Text>
                </View>

                <View style={styles.contentCard}>
                    {renderContent()}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: Colors.bgBase,
    },
    containerCompact: {
        flexDirection: 'column',
    },
    navWrap: {
        width: 260,
        backgroundColor: Colors.primaryDark,
        padding: 24,
        borderRightWidth: 1,
        borderRightColor: Colors.transparentWhite12,
    },
    navWrapCompact: {
        width: '100%',
        borderRightWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: Colors.transparentWhite12,
    },
    logo: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.textOnDark,
        marginBottom: 2,
    },
    logoSub: {
        color: Colors.textOnDarkSub,
        fontSize: 12,
    },
    navLinks: {
        marginTop: 28,
        gap: 10,
        flex: 1,
    },
    navLinksCompact: {
        flexDirection: 'row',
        marginTop: 16,
        flexWrap: 'wrap',
        gap: 8,
        flex: 0,
    },
    navItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: Colors.transparent,
    },
    navItemActive: {
        backgroundColor: Colors.transparentWhite16,
    },
    navText: {
        fontSize: 15,
        color: Colors.textOnDarkSub,
    },
    navTextActive: {
        color: Colors.textOnDark,
        fontWeight: '700',
    },
    content: {
        flex: 1,
        padding: 24,
        backgroundColor: Colors.bgBase,
    },
    topBar: {
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    topBarTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    topBarSub: {
        fontSize: 13,
        color: Colors.textSecondary,
    },
    dateText: {
        fontSize: 13,
        color: Colors.textMuted,
    },
    contentCard: {
        flex: 1,
        backgroundColor: Colors.bgCard,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        padding: 20,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 2,
    },
    homeContentWrap: {
        gap: 16,
        paddingBottom: 12,
    },
    heroCard: {
        backgroundColor: Colors.bgMuted,
        borderRadius: 14,
        padding: 18,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.primaryDark,
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        lineHeight: 20,
    },
    kpiRow: {
        flexDirection: 'row',
        gap: 12,
        flexWrap: 'wrap',
    },
    kpiCard: {
        flex: 1,
        minWidth: 160,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderRadius: 12,
        backgroundColor: Colors.bgCard,
        padding: 14,
    },
    kpiLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginBottom: 6,
    },
    kpiValue: {
        fontSize: 26,
        fontWeight: '700',
        color: Colors.primaryDark,
    },
    quickActionsCard: {
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderRadius: 12,
        padding: 14,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 10,
    },
    quickActionsRow: {
        flexDirection: 'row',
        gap: 10,
        flexWrap: 'wrap',
    },
    quickButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: Colors.bgMuted,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    quickButtonText: {
        fontSize: 13,
        color: Colors.primaryDark,
        fontWeight: '600',
    },
    logoutButton: {
        marginTop: 18,
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: 'rgba(255,0,0,0.1)',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    logoutText: {
        color: Colors.statusCritical,
        fontWeight: '700',
    },
});
