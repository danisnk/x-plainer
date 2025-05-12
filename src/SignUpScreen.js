import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native'
import { useState } from 'react';
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
const SignupScreen = ({ navigation }) => {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const auth = getAuth();

  const handlePasswordInputChange = (text) => {
    setPasswordInput(text);
    setPasswordsMatch(text === confirmPasswordInput);
  };

  const handleConfirmPasswordInputChange = (text) => {
    setConfirmPasswordInput(text);
    setPasswordsMatch(text === passwordInput);
  };

  const handleSignUp = () => {
    if (!passwordsMatch) {

      alert("Passwords do not match");
      return;
    }

    if (passwordInput.length < 6) {

      alert("Password should be at least 6 characters long");
      return;
    }

    createUserWithEmailAndPassword(auth, emailInput, passwordInput)
      .then((userCredential) => {

        const user = userCredential.user;
        console.log("User signed up:", user);
        navigation.navigate("LoginScreen")
      })
      .catch((error) => {

        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Signup error:", errorCode, errorMessage);
      });
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps='handled'>
        <View style={styles.inputContainer}>
          <Text style={styles.heads}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter email"
            keyboardType='email-address'
            placeholderTextColor="gray"
            onChangeText={text => setEmailInput(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.heads}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            secureTextEntry
            placeholderTextColor="gray"
            onChangeText={handlePasswordInputChange}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.heads}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm password"
            secureTextEntry
            placeholderTextColor="gray"
            onChangeText={handleConfirmPasswordInputChange}
          />
        </View>
        {!passwordsMatch && (
          <Text style={styles.errorText}>Passwords do not match</Text>
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.signupButton,
              { opacity: !emailInput || !passwordInput || !confirmPasswordInput || !passwordsMatch ? 0.7 : 1 },
            ]}
            disabled={!emailInput || !passwordInput || !confirmPasswordInput || !passwordsMatch}
            onPress={handleSignUp}
          >
            <Text style={styles.buttonText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default SignupScreen;

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
