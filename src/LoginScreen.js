import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const LoginScreen = ({ navigation }) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const { user } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          navigation.navigate('ConceptMe');
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
      }
    };

    checkAuthState();
  }, []);
  const handleLogin = () => {
    setLoading(true);

    signInWithEmailAndPassword(auth, emailInput, passwordInput)
      .then((userCredential) => {
        const user = userCredential.user;
        setEmailInput('');
        setPasswordInput('');
        setErrorMessage('');
        AsyncStorage.setItem('userToken', user.uid)
          .then(() => {
            navigation.navigate('ConceptMe');
          })
          .catch((error) => {
            console.error('Error saving user token:', error);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (
          errorCode === 'auth/invalid-email' ||
          errorCode === 'auth/wrong-password' ||
          errorCode === 'auth/user-not-found'
        ) {
          setErrorMessage('Invalid email or password');
        } else {
          setErrorMessage(errorMessage);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };


  const handleSignUp = () => {
    navigation.navigate('SignUpScreen');
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.inputContainer}>
          <Text style={styles.heads}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter email"
            keyboardType="email-address"
            placeholderTextColor="gray"
            onChangeText={(text) => setEmailInput(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.heads}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            placeholderTextColor="gray"
            secureTextEntry
            onChangeText={(text) => setPasswordInput(text)}
          />
        </View>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.loginButton,
              { opacity: !emailInput || !passwordInput ? 0.7 : 1 },
            ]}
            disabled={!emailInput || !passwordInput}
            onPress={handleLogin}
          >
            {loading ? (
              <ActivityIndicator color="black" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 8,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
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
  heads: {
    marginBottom: 5,
  },
  loginButton: {
    backgroundColor: '#a7dbd8',
    width: '40%',
    height: 50,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRightWidth: 5,
    borderBottomWidth: 6,
    borderColor: 'black',
    marginBottom: 10,
    marginRight: 40,
  },
  signupButton: {
    backgroundColor: '#dbfd00',
    width: '40%',
    height: 50,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRightWidth: 5,
    borderBottomWidth: 6,
    borderColor: 'black',
    marginBottom: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
  },
});
