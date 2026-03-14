import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../../../core/theme/Colors';
import { MaterialIcons } from '@expo/vector-icons';

export default function AdminAnalytics() {
    const kpiCards = [
        { icon: 'people', value: '142', label: 'Total Users', tint: Colors.primaryDark },
        { icon: 'sensors', value: '12', label: 'Active Sensors', tint: Colors.statusWarning },
        { icon: 'report', value: '8', label: 'Violations Today', tint: Colors.statusCritical },
        { icon: 'add-a-photo', value: '45', label: 'Uploaded Proofs', tint: Colors.chartBlue },
    ] as const;

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.headerCard}>
                <Text style={styles.sectionLabel}>Operations Intelligence</Text>
                <Text style={styles.title}>System Summary and Reports</Text>
                <Text style={styles.subtitle}>
                    Consolidated operational metrics and incident activity from monitored zones.
                </Text>
            </View>

            <View style={styles.statsContainer}>
                {kpiCards.map((card) => (
                    <View key={card.label} style={styles.statCard}>
                        <View style={[styles.iconWrap, { backgroundColor: `${card.tint}20` }]}>
                            <MaterialIcons name={card.icon} size={20} color={card.tint} />
                        </View>
                        <Text style={styles.statNumber}>{card.value}</Text>
                        <Text style={styles.statLabel}>{card.label}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.insightRow}>
                <View style={styles.insightCard}>
                    <Text style={styles.sectionTitle}>Compliance Snapshot</Text>
                    <Text style={styles.insightHeadline}>83% zones within safe threshold</Text>
                    <Text style={styles.insightSub}>Most elevated cases occurred from 8:00 PM to 11:00 PM.</Text>
                </View>
                <View style={styles.insightCard}>
                    <Text style={styles.sectionTitle}>Trend Direction</Text>
                    <Text style={styles.insightHeadline}>-12% weekly violation rate</Text>
                    <Text style={styles.insightSub}>Improvement after stricter late-night enforcement.</Text>
                </View>
            </View>

            <View style={styles.reportSection}>
                <Text style={styles.sectionTitle}>Recent Noise Activity Timeline</Text>
                <View style={styles.reportItem}>
                    <View style={[styles.timelineDot, { backgroundColor: Colors.statusWarning }]} />
                    <View style={styles.reportTextWrap}>
                        <Text style={styles.reportTime}>Today, 10:45 AM</Text>
                    <Text style={styles.reportDesc}>Zone A exceeded 85 dB for 15 minutes.</Text>
                    </View>
                </View>
                <View style={styles.reportItem}>
                    <View style={[styles.timelineDot, { backgroundColor: Colors.statusCritical }]} />
                    <View style={styles.reportTextWrap}>
                        <Text style={styles.reportTime}>Yesterday, 09:20 PM</Text>
                    <Text style={styles.reportDesc}>Zone C registered sudden noise spike (110 dB).</Text>
                    </View>
                </View>
                <View style={styles.reportItem}>
                    <View style={[styles.timelineDot, { backgroundColor: Colors.primaryDark }]} />
                    <View style={styles.reportTextWrap}>
                        <Text style={styles.reportTime}>Yesterday, 03:15 PM</Text>
                        <Text style={styles.reportDesc}>3 new user proofs submitted for Zone B construction noise.</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.transparent,
    },
    headerCard: {
        backgroundColor: Colors.bgMuted,
        borderRadius: 14,
        padding: 18,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: Colors.borderLight,
    },
    sectionLabel: {
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        color: Colors.textMuted,
        marginBottom: 6,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        lineHeight: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 14,
    },
    statCard: {
        backgroundColor: Colors.bgCard,
        borderRadius: 12,
        padding: 16,
        flex: 1,
        minWidth: 190,
        borderWidth: 1,
        borderColor: Colors.borderLight,
    },
    iconWrap: {
        width: 38,
        height: 38,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statNumber: {
        fontSize: 28,
        fontWeight: '700',
        marginTop: 10,
        marginBottom: 4,
        color: Colors.primaryDark,
    },
    statLabel: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    insightRow: {
        flexDirection: 'row',
        gap: 12,
        flexWrap: 'wrap',
        marginBottom: 14,
    },
    insightCard: {
        flex: 1,
        minWidth: 240,
        backgroundColor: Colors.bgCard,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderRadius: 12,
        padding: 16,
    },
    insightHeadline: {
        marginTop: 4,
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    insightSub: {
        marginTop: 8,
        fontSize: 13,
        color: Colors.textSecondary,
        lineHeight: 18,
    },
    reportSection: {
        backgroundColor: Colors.bgCard,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 10,
        color: Colors.textPrimary,
    },
    reportItem: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
        paddingVertical: 12,
    },
    timelineDot: {
        width: 10,
        height: 10,
        borderRadius: 999,
        marginTop: 5,
    },
    reportTextWrap: {
        flex: 1,
    },
    reportTime: {
        fontSize: 12,
        color: Colors.textMuted,
        marginBottom: 4,
    },
    reportDesc: {
        fontSize: 15,
        color: Colors.textPrimary,
    },
});
