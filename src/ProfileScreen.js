import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Octicons, MaterialIcons } from 'react-native-vector-icons';

const ProfileScreen = ({ navigation }) => {
    const auth = getAuth();
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        const checkAuthState = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (!token) {
                    navigation.navigate('LoginScreen');
                }
            } catch (error) {
                console.error('Error checking auth state:', error);
            }
        };

        checkAuthState();
    }, []);

    const handleNavigateToQuiz = () => {
        navigation.navigate('QuizScreen');
    };

    const handleLogout = () => {
        setShowConfirmation(true);
    };

    const confirmLogout = () => {
        signOut(auth)
            .then(() => {
                AsyncStorage.removeItem('userToken');
                navigation.navigate('LoginScreen');
            })
            .catch((error) => {
                console.error('Error signing out:', error);
            });
    };

    const cancelLogout = () => {
        setShowConfirmation(false);
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleLeaderboard = () => {
        navigation.navigate("LeaderboardScreen");
    };

    const handleEditProfile = () => {
        navigation.navigate("EditProfileScreen");
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.container}>
                <View style={styles.optionsContainer}>
                    <TouchableOpacity style={styles.optionButton} onPress={handleNavigateToQuiz}>
                        <Octicons name="question" size={24} color="black" />
                        <Text style={styles.optionText}>Start Quiz</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionButton} onPress={handleEditProfile}>
                        <Octicons name="pencil" size={24} color="black" />
                        <Text style={styles.optionText}>Edit Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionButton} onPress={handleLeaderboard}>
                        <Octicons name="graph" size={24} color="black" />
                        <Text style={styles.optionText}>Leaderboard</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Octicons name="sign-out" size={24} color="black" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                <MaterialIcons name="arrow-back-ios" size={18} color="black" />
            </TouchableOpacity>

            {/* Confirmation Modal */}
            <Modal
                visible={showConfirmation}
                animationType="fade"
                transparent={true}
                onRequestClose={cancelLogout}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Are you sure you want to logout?</Text>
                        <View style={styles.modalButtonsContainer}>
                            <TouchableOpacity style={styles.modalButtonCancel} onPress={cancelLogout}>
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButtonLogout} onPress={confirmLogout}>
                                <Text style={styles.modalButtonText}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionsContainer: {
        marginBottom: 20,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    optionButton: {
        backgroundColor: '#fadede',
        width: '30%',
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'black',
        paddingVertical: 12,
        borderRightWidth: 3,
        borderBottomWidth: 4,
    },
    optionText: {
        fontSize: 14,
        marginTop: 6,
    },
    logoutButton: {
        backgroundColor: '#fadede',
        width: '30%',
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'black',
        paddingVertical: 12,
        borderRightWidth: 3,
        borderBottomWidth: 4,

    },
    logoutText: {
        fontSize: 14,
        marginTop: 6,
    },
    backButton: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#fdfd96',
        borderWidth: 1.5,
        borderColor: 'black',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 10,
        borderRightWidth: 3,
        borderBottomWidth: 4,
        opacity: 1,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 8,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
    },
    modalButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    modalButtonLogout: {
        backgroundColor: '#fadede',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: 'black',
        borderRightWidth: 3,
        borderBottomWidth: 4,
    },
    modalButtonCancel: {
        backgroundColor: '#d9fffc',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: 'black',
        borderRightWidth: 3,
        borderBottomWidth: 4,
    },
    modalButtonText: {
        fontSize: 16,
    },
});

export default ProfileScreen;
