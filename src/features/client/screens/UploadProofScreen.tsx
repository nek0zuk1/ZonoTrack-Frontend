import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../core/theme/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AnimatedScreen from '../../../components/AnimatedScreen';

export default function UploadProofScreen() {
    const insets = useSafeAreaInsets();
    const [imageUri, setImageUri] = useState<string | null>(null);

    const pickImage = async () => {
        // Request permissions
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert("Permission to access camera roll is required!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleUpload = () => {
        if (!imageUri) return;
        // In a real app we'd upload this image to a server.
        // For MVP, we'll just mock it.
        Alert.alert("Success", "Proof uploaded successfully!");
        setImageUri(null); // Reset after upload
    };

    return (
        <AnimatedScreen>
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ paddingBottom: 120, paddingTop: insets.top + 20 }}
            >
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Upload Proof</Text>
                    <Text style={styles.headerDesc}>
                        Please upload an image as proof of the reported noise activity.
                    </Text>
                </View>

                <View style={styles.content}>
                    <TouchableOpacity style={styles.imagePicker} onPress={pickImage} activeOpacity={0.8}>
                        {imageUri ? (
                            <Image source={{ uri: imageUri }} style={styles.image} />
                        ) : (
                            <View style={styles.placeholderContainer}>
                                <MaterialIcons name="add-a-photo" size={48} color={Colors.textMuted} />
                                <Text style={styles.placeholderText}>Tap to select an image</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {imageUri && (
                        <TouchableOpacity style={styles.uploadButton} onPress={handleUpload} activeOpacity={0.8}>
                            <MaterialIcons name="cloud-upload" size={24} color={Colors.textOnDark} style={{ marginRight: 8 }} />
                            <Text style={styles.uploadButtonText}>Upload Image</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </AnimatedScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgBase,
    },
    header: {
        paddingHorizontal: 24,
        marginBottom: 32,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    headerDesc: {
        fontSize: 15,
        color: Colors.textSecondary,
        lineHeight: 22,
    },
    content: {
        paddingHorizontal: 24,
    },
    imagePicker: {
        backgroundColor: Colors.bgCard,
        borderRadius: 24,
        height: 300,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: Colors.borderLight,
        borderStyle: 'dashed',
        marginBottom: 24,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholderContainer: {
        alignItems: 'center',
    },
    placeholderText: {
        marginTop: 12,
        fontSize: 16,
        color: Colors.textSecondary,
    },
    uploadButton: {
        backgroundColor: Colors.primaryDark,
        borderRadius: 16,
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primaryDark,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 6,
    },
    uploadButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textOnDark,
    },
});
