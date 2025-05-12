import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { getAuth, getUserByEmail } from 'firebase/auth';
import { MaterialIcons, Entypo } from 'react-native-vector-icons';

const LeaderboardScreen = ({navigation}) => {
    const [loading, setLoading] = useState(true);
    const [leaderboard, setLeaderboard] = useState([]);

    const handleGoBack = () => {
        navigation.goBack();
      };

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const db = getFirestore();
                const usersCollection = collection(db, 'users');
                const usersQuery = query(usersCollection, orderBy('score', 'desc'));
                const querySnapshot = await getDocs(usersQuery);

                const leaderboardData = [];
                const auth = getAuth();

                for (const doc of querySnapshot.docs) {
                    const userData = doc.data();
                    const userId = doc.id;
                    const name = userData.name || 'Unknown';
                    leaderboardData.push({ name, score: userData.score || 0 });
                }

                setLeaderboard(leaderboardData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const renderLeaderboardItem = ({ item, index }) => (
        <View style={[styles.itemContainer, index % 2 === 0 ? styles.itemEven : styles.itemOdd]}>
            <Text style={styles.rank}>{index + 1}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.score}>{item.score}</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.mainContainer}>
            <View style={styles.borderContainer}>
                <Text style={styles.header}>Leaderboard</Text>
                <ScrollView style={styles.scrollView}>
                    <FlatList
                        data={leaderboard}
                        renderItem={renderLeaderboardItem}
                        keyExtractor={(item, index) => index.toString()}
                        scrollEnabled={false}
                    />
                    
                </ScrollView>
                
            </View>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <MaterialIcons name="arrow-back-ios" size={17} color="black" />
        </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    borderContainer: {
        flex: 1,
        borderWidth: 1.5,
        borderRadius: 10,
        borderRightWidth: 6,
        borderBottomWidth: 5,
        backgroundColor: '#f5f5f5',
        padding: 10,
        margin: 15,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        padding: 16,
        borderWidth: 1.5,
        borderRadius: 10,
        borderRightWidth: 6,
        borderBottomWidth: 5,
        backgroundColor: '#f5f5f5',
        marginBottom: 15,
    },
        
    itemEven: {
        backgroundColor: '#fff3b8',
    },
    itemOdd: {
        backgroundColor: '#f5f5f5',
    },
    rank: {
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
        color: 'black',
    },
    name: {
        flex: 3,
        textAlign: 'left',
        marginLeft: 16,
        fontSize: 16,
        color: 'black',
    },
    score: {
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
        color: 'black',
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
        marginBottom: 10,
        borderRightWidth: 3,
        borderBottomWidth: 4,
        opacity: 1,
    },
});

export default LeaderboardScreen;
