import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    ActivityIndicator,
    FlatList,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import { Colors } from '../../../core/theme/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { apiClient } from '../../../core/api/apiClient';

type UserData = {
    id: string;
    name: string;
    username: string;
};

type AdminAccount = {
    username: string;
    holderName: string;
};

export default function AdminUsers() {
    const { width } = useWindowDimensions();
    const isWide = width >= 1180;

    const [users, setUsers] = useState<UserData[]>([]);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [search, setSearch] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    const [adminAccount, setAdminAccount] = useState<AdminAccount>({
        username: 'admin',
        holderName: 'Administrator',
    });
    const [adminHolderName, setAdminHolderName] = useState('');
    const [currentAdminPassword, setCurrentAdminPassword] = useState('');
    const [newAdminPassword, setNewAdminPassword] = useState('');
    const [confirmAdminPassword, setConfirmAdminPassword] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadUsers();
        loadAdminAccount();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await apiClient.get('/api/admin/users');
            const apiUsers = (response.data?.users ?? []) as Array<Record<string, unknown>>;

            const normalizedUsers = apiUsers
                .filter((entry) => String(entry.username ?? '').toLowerCase() !== 'admin')
                .map((entry) => ({
                    id: String(entry._id ?? ''),
                    name: String(entry.name ?? 'Unknown User'),
                    username: String(entry.username ?? '').toLowerCase(),
                }))
                .filter((entry) => entry.id && entry.username);

            setUsers(normalizedUsers);
        } catch (error: any) {
            const message = error?.response?.data?.error || 'Failed to load users from server.';
            setStatusType('error');
            setStatusMessage(message);
            Alert.alert('Load error', message);
        }
    };

    const loadAdminAccount = async () => {
        try {
            const response = await apiClient.get('/api/admin/account');
            const account = response.data?.admin;
            if (!account) {
                return;
            }

            const normalized = {
                username: String(account.username ?? 'admin'),
                holderName: String(account.holder_name ?? 'Administrator'),
            };
            setAdminAccount(normalized);
            setAdminHolderName(normalized.holderName);
        } catch (error: any) {
            Alert.alert('Load error', error?.response?.data?.error || 'Failed to load admin account details.');
        }
    };

    const resetForm = () => {
        setName('');
        setUsername('');
        setPassword('');
        setEditingId(null);
    };

    const handleSaveUser = async () => {
        const trimmedName = name.trim();
        const trimmedUsername = username.trim().toLowerCase();

        if (!trimmedName || !trimmedUsername) {
            setStatusType('error');
            setStatusMessage('Name and username are required.');
            Alert.alert('Error', 'Name and username are required.');
            return;
        }

        if (trimmedUsername === 'admin') {
            setStatusType('error');
            setStatusMessage('The username admin is fixed for the system administrator.');
            Alert.alert('Reserved username', 'The username admin is fixed for the system administrator.');
            return;
        }

        if (trimmedUsername.length < 4) {
            setStatusType('error');
            setStatusMessage('Username must be at least 4 characters.');
            Alert.alert('Invalid username', 'Username must be at least 4 characters.');
            return;
        }

        if (!editingId && password.trim().length < 6) {
            setStatusType('error');
            setStatusMessage('Password must be at least 6 characters for new users.');
            Alert.alert('Invalid password', 'Password must be at least 6 characters for new users.');
            return;
        }

        try {
            setIsSubmitting(true);
            setStatusMessage('');
            if (editingId) {
                const updatePayload: Record<string, string> = {
                    name: trimmedName,
                    username: trimmedUsername,
                };

                if (password.trim()) {
                    updatePayload.password = password.trim();
                }

                await apiClient.put(`/api/admin/users/${editingId}`, updatePayload);
            } else {
                await apiClient.post('/api/admin/create_user', {
                    name: trimmedName,
                    username: trimmedUsername,
                    password: password.trim(),
                });
            }

            await loadUsers();
            resetForm();
            setStatusType('success');
            setStatusMessage(editingId ? 'User updated successfully.' : 'User created successfully.');
            Alert.alert('Success', editingId ? 'User updated successfully.' : 'User created successfully.');
        } catch (error: any) {
            const message = error?.response?.data?.error || 'Failed to save user account.';
            setStatusType('error');
            setStatusMessage(message);
            Alert.alert('Save failed', message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (user: UserData) => {
        setEditingId(user.id);
        setName(user.name);
        setUsername(user.username);
        setPassword('');
    };

    const handleDelete = (id: string) => {
        const deleteUser = async () => {
            try {
                setIsSubmitting(true);
                setStatusMessage('');
                await apiClient.delete(`/api/admin/users/${id}`);
                await loadUsers();
                if (editingId === id) {
                    resetForm();
                }
                setStatusType('success');
                setStatusMessage('User deleted successfully.');
            } catch (error: any) {
                const message = error?.response?.data?.error || 'Failed to delete user.';
                setStatusType('error');
                setStatusMessage(message);
                Alert.alert('Delete failed', message);
            } finally {
                setIsSubmitting(false);
            }
        };

        if (typeof window !== 'undefined' && Platform.OS === 'web') {
            const confirmed = window.confirm('Delete user? This action cannot be undone.');
            if (confirmed) {
                void deleteUser();
            }
            return;
        }

        Alert.alert('Delete user', 'This action cannot be undone.', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () => {
                    void deleteUser();
                },
            },
        ]);
    };

    const handleUpdateAdminAccount = async () => {
        const trimmedHolder = adminHolderName.trim();

        if (!currentAdminPassword || !newAdminPassword || !confirmAdminPassword) {
            Alert.alert('Missing fields', 'Please complete all admin password fields.');
            return;
        }

        if (newAdminPassword.length < 6) {
            Alert.alert('Weak password', 'New admin password must be at least 6 characters.');
            return;
        }

        if (newAdminPassword !== confirmAdminPassword) {
            Alert.alert('Mismatch', 'New admin password and confirmation do not match.');
            return;
        }

        if (!trimmedHolder) {
            Alert.alert('Missing name', 'Please enter the name of the current admin holder.');
            return;
        }

        try {
            setIsSubmitting(true);
            setStatusMessage('');
            await apiClient.put('/api/admin/account', {
                current_password: currentAdminPassword,
                new_password: newAdminPassword,
                holder_name: trimmedHolder,
            });

            setCurrentAdminPassword('');
            setNewAdminPassword('');
            setConfirmAdminPassword('');
            await loadAdminAccount();
            setStatusType('success');
            setStatusMessage('Fixed admin account updated successfully.');
            Alert.alert('Admin account updated', 'Fixed admin account password has been changed and handed over.');
        } catch (error: any) {
            const message = error?.response?.data?.error || 'Failed to update admin account.';
            setStatusType('error');
            setStatusMessage(message);
            Alert.alert('Update failed', message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredUsers = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) {
            return users;
        }

        return users.filter(
            (user) =>
                user.name.toLowerCase().includes(query) ||
                user.username.toLowerCase().includes(query)
        );
    }, [search, users]);

    const renderUser = ({ item }: { item: UserData }) => (
        <View style={styles.userCard}>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userUsername}>@{item.username}</Text>
            </View>
            <View style={styles.userActions}>
                <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionButton}>
                    <MaterialIcons name="edit" size={20} color={Colors.primaryDark} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionButton}>
                    <MaterialIcons name="delete" size={20} color={Colors.statusCritical} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.title}>Account Management</Text>
                    <Text style={styles.subtitle}>Create and maintain user accounts with a fixed admin credential.</Text>
                </View>
            </View>

            {!!statusMessage && (
                <View style={[styles.statusBanner, statusType === 'error' ? styles.errorBanner : styles.successBanner]}>
                    <Text style={styles.statusText}>{statusMessage}</Text>
                </View>
            )}

            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Total User Accounts</Text>
                    <Text style={styles.statValue}>{users.length}</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Fixed Admin Username</Text>
                    <Text style={styles.statValue}>{adminAccount.username}</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Current Admin Holder</Text>
                    <Text style={styles.statValueSmall}>{adminAccount.holderName}</Text>
                </View>
            </View>

            <View style={styles.adminCard}>
                <Text style={styles.cardTitle}>Fixed Admin Account Handover</Text>
                <Text style={styles.cardSubTitle}>Use this section when passing the admin account to the next administrator.</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Current admin holder name"
                    value={adminHolderName}
                    onChangeText={setAdminHolderName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Current admin password"
                    secureTextEntry
                    value={currentAdminPassword}
                    onChangeText={setCurrentAdminPassword}
                />
                <TextInput
                    style={styles.input}
                    placeholder="New admin password"
                    secureTextEntry
                    value={newAdminPassword}
                    onChangeText={setNewAdminPassword}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirm new admin password"
                    secureTextEntry
                    value={confirmAdminPassword}
                    onChangeText={setConfirmAdminPassword}
                />
                <TouchableOpacity style={styles.button} onPress={handleUpdateAdminAccount}>
                    {isSubmitting ? <ActivityIndicator color={Colors.textOnDark} /> : <Text style={styles.buttonText}>Update Admin Password</Text>}
                </TouchableOpacity>
            </View>

            <View style={[styles.mainGrid, isWide && styles.mainGridWide]}>
                <View style={[styles.formContainer, isWide && styles.formContainerWide]}>
                    <Text style={styles.sectionLabel}>User Provisioning</Text>
                    <Text style={styles.formTitle}>{editingId ? 'Edit User Profile' : 'Create User Account'}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={editingId ? 'New Password (optional)' : 'Password'}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <View style={styles.formActions}>
                        {editingId && (
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={resetForm}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity style={styles.button} onPress={handleSaveUser}>
                            {isSubmitting ? <ActivityIndicator color={Colors.textOnDark} /> : <Text style={styles.buttonText}>{editingId ? 'Save Changes' : 'Create User'}</Text>}
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.listPanel}>
                    <View style={styles.listHeader}>
                        <Text style={styles.sectionLabel}>Directory</Text>
                        <Text style={styles.listTitle}>User Accounts</Text>
                        <Text style={styles.listMeta}>{filteredUsers.length} visible account(s)</Text>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search by name or username"
                            value={search}
                            onChangeText={setSearch}
                        />
                    </View>

                    <FlatList
                        data={filteredUsers}
                        keyExtractor={(item) => item.id}
                        renderItem={renderUser}
                        contentContainerStyle={styles.listContainer}
                        scrollEnabled={false}
                        nestedScrollEnabled
                        ListEmptyComponent={<Text style={styles.emptyState}>No users found.</Text>}
                    />
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
    scrollContent: {
        paddingBottom: 28,
    },
    headerRow: {
        marginBottom: 16,
    },
    statusBanner: {
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginBottom: 14,
        borderWidth: 1,
    },
    errorBanner: {
        backgroundColor: '#FDECEC',
        borderColor: '#F5B5B5',
    },
    successBanner: {
        backgroundColor: '#EAF8EE',
        borderColor: '#B7DFC2',
    },
    statusText: {
        fontSize: 13,
        color: Colors.textPrimary,
        fontWeight: '600',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 14,
        flexWrap: 'wrap',
    },
    statCard: {
        flex: 1,
        minWidth: 180,
        backgroundColor: Colors.bgCard,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderRadius: 12,
        padding: 14,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.primaryDark,
    },
    statValueSmall: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.primaryDark,
    },
    adminCard: {
        backgroundColor: Colors.bgCard,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderRadius: 14,
        padding: 16,
        marginBottom: 14,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    sectionLabel: {
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        color: Colors.textMuted,
        marginBottom: 6,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    cardSubTitle: {
        fontSize: 13,
        color: Colors.textSecondary,
        marginBottom: 12,
    },
    mainGrid: {
        gap: 14,
    },
    mainGridWide: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    formContainer: {
        flex: 1,
        backgroundColor: Colors.bgCard,
        padding: 20,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    formContainerWide: {
        maxWidth: 420,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: Colors.textPrimary,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.borderMuted,
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
        fontSize: 14,
        backgroundColor: Colors.bgCard,
        color: Colors.textPrimary,
    },
    formActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    button: {
        backgroundColor: Colors.primaryDark,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 10,
    },
    cancelButton: {
        backgroundColor: Colors.textMuted,
    },
    buttonText: {
        color: Colors.textOnDark,
        fontWeight: 'bold',
    },
    listPanel: {
        flex: 1,
        minHeight: 200,
        backgroundColor: Colors.bgCard,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        padding: 14,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    listHeader: {
        marginBottom: 10,
    },
    listTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    listMeta: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginBottom: 8,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: Colors.borderMuted,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: Colors.bgCard,
        color: Colors.textPrimary,
    },
    listContainer: {
        paddingBottom: 8,
    },
    userCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.bgCard,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 1,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    userUsername: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 2,
    },
    userActions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        padding: 8,
    },
    emptyState: {
        textAlign: 'center',
        paddingVertical: 24,
        color: Colors.textSecondary,
    },
});
