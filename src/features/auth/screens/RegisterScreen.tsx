import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Animated,
    ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, withAlpha } from '../../../core/theme/Colors';
import { AuthContext } from '../../../core/auth/AuthContext';
import AnimatedScreen from '../../../components/AnimatedScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RegisterScreen() {
    const navigation = useNavigation<any>();
    const { loginWithUser } = useContext(AuthContext);
    const insets = useSafeAreaInsets();

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const slideAnim = React.useRef(new Animated.Value(28)).current;

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
        ]).start();
    }, [fadeAnim, slideAnim]);

    const handleRegister = async () => {
        // Validation check (basic)
        if (!name || !username || !password || password !== confirmPassword) return;

        // Prevent registration with the fixed admin username
        if (username.toLowerCase() === 'admin') {
            alert('The username "admin" is reserved.');
            return;
        }

        await loginWithUser({
            id: String(Date.now()),
            email: `${username.toLowerCase()}@user.com`,
            username: username.toLowerCase(),
            name,
            isAdmin: false,
        });
    };

    const isFormValid = name && username && password && password === confirmPassword;

    return (
        <AnimatedScreen>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                >
                    {/* ── Hero Background ── */}
                    <View style={[styles.hero, { paddingTop: insets.top + 16 }]}>
                        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                            <Text style={styles.heroTitle}>Create Account</Text>
                        </Animated.View>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.form}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Full Name</Text>
                                <View style={styles.inputContainer}>
                                    <MaterialIcons name="person" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your full name"
                                        placeholderTextColor={Colors.textMuted}
                                        value={name}
                                        onChangeText={setName}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Username</Text>
                                <View style={styles.inputContainer}>
                                    <MaterialIcons name="alternate-email" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Choose a username"
                                        placeholderTextColor={Colors.textMuted}
                                        autoCapitalize="none"
                                        value={username}
                                        onChangeText={setUsername}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Password</Text>
                                <View style={styles.inputContainer}>
                                    <MaterialIcons name="lock" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Create a password"
                                        placeholderTextColor={Colors.textMuted}
                                        secureTextEntry
                                        value={password}
                                        onChangeText={setPassword}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Confirm Password</Text>
                                <View style={styles.inputContainer}>
                                    <MaterialIcons name="lock-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Confirm your password"
                                        placeholderTextColor={Colors.textMuted}
                                        secureTextEntry
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                    />
                                </View>
                                {password !== '' && confirmPassword !== '' && password !== confirmPassword && (
                                    <Text style={styles.errorText}>Passwords do not match</Text>
                                )}
                            </View>

                            <TouchableOpacity
                                style={[
                                    styles.registerButton,
                                    !isFormValid && styles.registerButtonDisabled
                                ]}
                                activeOpacity={0.8}
                                onPress={handleRegister}
                                disabled={!isFormValid}
                            >
                                <Text style={styles.registerButtonText}>Create Account</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.footerLink}>Sign in here</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgBase,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    // Hero
    hero: {
        backgroundColor: Colors.primaryDark,
        paddingHorizontal: 24,
        paddingBottom: 64, // Extra padding to let the form overlap
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
        overflow: 'hidden',
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.22,
        shadowRadius: 20,
        elevation: 10,
    },
    heroTitle: {
        fontSize: 34, fontWeight: '800', color: Colors.textOnDark,
        lineHeight: 42, marginBottom: 12,
        textShadowColor: Colors.transparentBlack15,
        textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 8,
    },
    heroSub: {
        fontSize: 14, color: Colors.textOnDarkSub, lineHeight: 22,
    },

    formContainer: {
        paddingHorizontal: 24,
        marginTop: -32, // Overlap the hero
    },
    form: {
        backgroundColor: Colors.bgCard,
        borderRadius: 24,
        padding: 24,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 6,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.textSecondary,
        marginBottom: 8,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.bgBase,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        height: 56,
        paddingHorizontal: 16,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: Colors.textPrimary,
        height: '100%',
    },
    errorText: {
        color: Colors.statusCritical,
        fontSize: 12,
        marginTop: 6,
        marginLeft: 4,
    },
    registerButton: {
        backgroundColor: Colors.primaryDark,
        borderRadius: 16,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        shadowColor: Colors.primaryDark,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 6,
    },
    registerButtonDisabled: {
        backgroundColor: Colors.textMuted,
        shadowOpacity: 0,
        elevation: 0,
    },
    registerButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textOnDark,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
    },
    footerText: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    footerLink: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.primaryMid,
    },
});
