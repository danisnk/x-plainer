import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, SafeAreaView, Modal } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Foundation, MaterialIcons } from 'react-native-vector-icons';
import { getFirestore, collection, query, getDocs, where, doc, deleteDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const NoteScreen = ({ navigation }) => {
    const [notes, setNotes] = useState([]);
    const [deleteNoteId, setDeleteNoteId] = useState(null);
    const db = getFirestore();
    const notesCollectionRef = collection(db, 'notes');
    let user;
    const [searchQuery, setSearchQuery] = useState('');


    useEffect(() => {
        const retrieveUserToken = async () => {
            try {
                const userToken = await AsyncStorage.getItem('userToken');
                if (userToken !== null) {
                    const user = { uid: userToken };
                    fetchNotes(user);
                } else {
                    console.log('User token not found');
                }
            } catch (error) {
                console.error('Error retrieving user token:', error);
            }
        };

        const fetchNotes = async (user) => {
            try {
                let q = query(notesCollectionRef, where('userId', '==', user.uid));
                if (searchQuery) {
                    const uppercaseSearchQuery = searchQuery.toUpperCase();
                    q = query(q, where('noteValue', '>=', uppercaseSearchQuery));
                }
        
                const querySnapshot = await getDocs(q);
                const notesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setNotes(notesData);
            } catch (error) {
                console.log('Error fetching notes:', error);
            }
        };

        retrieveUserToken();
    }, [searchQuery]);

    const handleDeleteNote = (noteId) => {
        setDeleteNoteId(noteId);
    };

    const confirmDeleteNote = async () => {
        try {
            const noteRef = doc(db, 'notes', deleteNoteId);
            await deleteDoc(noteRef);
            setNotes(notes.filter((note) => note.id !== deleteNoteId));
            setDeleteNoteId(null);
        } catch (error) {
            console.log('Error deleting note:', error);
        }
    };

    const cancelDeleteNote = () => {
        setDeleteNoteId(null);
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <ScrollView contentContainerStyle={styles.container}>
                <TextInput
                style={styles.searchInput}
                placeholder="Search notes"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
                <Text style={styles.saved}>Saved Notes:</Text>
                {notes.length === 0 ? (
                    <Text style={styles.noNotesText}>No notes available</Text>
                ) : (
                    <ScrollView>
                        {notes.map((note) => (
                            <TouchableOpacity
                                key={note.id}
                                style={styles.noteButton}
                                onPress={() => navigation.navigate('FullNoteScreen', { note: note.noteValue })}
                            >
                                <View style={styles.noteContainer}>
                                    <Text style={styles.noteText}>{note.noteValue.split('\n')[0]}</Text>
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => handleDeleteNote(note.id)}
                                    >
                                        <Foundation name="page-delete" size={20} color="black" />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
            </ScrollView>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                <MaterialIcons name="arrow-back-ios" size={18} color="black" />
            </TouchableOpacity>

            <Modal visible={deleteNoteId !== null} transparent animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Are you sure you want to delete this note?</Text>
                        <View style={styles.modalButtonsContainer}>
                            <TouchableOpacity style={styles.modalButton} onPress={cancelDeleteNote}>
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButton} onPress={confirmDeleteNote}>
                                <Text style={styles.modalButtonText}>Delete</Text>
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
        padding: 16,
        borderWidth: 1.5,
        borderRadius: 10,
        borderRightWidth: 6,
        borderBottomWidth: 5,
        backgroundColor: '#f5f5f5',
    },
    noteText: {
        fontSize: 16,
        color: 'black',
        paddingBottom: 3,
    },
    buttonText: {
        alignSelf: 'center',
    },
    noteContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        padding: 5,
        margin: 8,
        borderColor: 'black',
        backgroundColor: '#bff5ea',
        borderRadius: 4,
        borderRightWidth: 3,
        borderBottomWidth: 4,
    },
    saved: {
        fontWeight: 'bold',
        marginBottom: 10,
        fontSize: 16,
    },
    deleteButton: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#fadede',
        borderWidth: 1.5,
        borderColor: 'black',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRightWidth: 4,
        borderBottomWidth: 5,
        opacity: 1,
    },
    searchInput: {
        borderWidth: 1.5,
        borderRightWidth: 5,
        borderBottomWidth: 6,
        borderColor: 'black',
        borderRadius: 30,
        padding: 10,
        marginBottom: 10,
        margin: 5,
        backgroundColor: 'white',
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
        borderRightWidth: 4,
        borderBottomWidth: 5,
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
    modalButton: {
        backgroundColor: '#fadede',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: 'black',
        borderBottomWidth: 5,
        borderRightWidth: 4,
    },
    modalButtonText: {
        fontSize: 16,
        color: '#000000',
    },
});

export default NoteScreen;
