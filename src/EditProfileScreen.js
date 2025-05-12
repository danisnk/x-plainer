import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const EditProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [saveDisabled, setSaveDisabled] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const db = getFirestore();
        const auth = getAuth();
        const user = auth.currentUser;
        
        // Get the user's ID
        const userId = user ? user.uid : null;

        // Reference to the user's document in the "users" collection
        const userDocRef = doc(db, 'users', userId);

        // Fetch the user's data
        const userDocSnap = await getDoc(userDocRef);
        const userData = userDocSnap.data();

        // Update the state with the fetched data
        if (userData) {
          setName(userData.name);
          setAge(userData.age);
          setSaveDisabled(false); // Enable save button if data exists
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      const db = getFirestore();
      const auth = getAuth();

      // Get the user's ID
      const user = auth.currentUser;
      const userId = user ? user.uid : null;

      // Reference to the user's document in the "users" collection
      const userDocRef = doc(db, 'users', userId);

      // Data to be stored in the user's document
      const userData = {
        name,
        age,
      };

      // Set the user's document with the profile data
      await updateDoc(userDocRef, userData);

      // Show success modal
      setShowSuccessModal(true);

      console.log('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleNameChange = (text) => {
    setName(text);
    setSaveDisabled(!text || !age);
  };

  const handleAgeChange = (text) => {
    setAge(text);
    setSaveDisabled(!name || !text);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={handleNameChange}
          placeholder="Enter your name"
        />

        <Text style={styles.label}>Age:</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={handleAgeChange}
          placeholder="Enter your age"
          keyboardType="numeric"
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.save, { opacity: saveDisabled ? 0.5 : 1 }]}
            onPress={handleSave}
            disabled={saveDisabled}
          >
            <Text>Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Profile saved successfully!</Text>
            <TouchableOpacity style={styles.okButton} onPress={handleGoBack}>
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    padding: 16,
  },
  container: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderWidth: 1.5,
    borderRadius: 10,
    borderRightWidth: 6,
    borderBottomWidth: 5,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    marginTop: 10,
    borderColor: 'black',
    color: 'black',
    height: 50,
    borderRadius: 5,
    borderRightWidth: 4,
    borderBottomWidth: 5,
    borderWidth: 1.5,
    paddingLeft: 16,
    marginBottom: 10,
    fontSize: 16,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  save: {
    backgroundColor: '#a7dbd8',
    borderWidth: 1.5,
    borderColor: 'black',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 10,
    borderRightWidth: 4,
    borderBottomWidth: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  okButton: {
    backgroundColor: '#fadede',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: 'black',
    borderBottomWidth: 5,
    borderRightWidth: 4,
  },
  okButtonText: {
    fontSize: 16,
    color: 'black',
  },
});

export default EditProfileScreen;
