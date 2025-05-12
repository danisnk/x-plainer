import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar, SafeAreaView, ScrollView, BackHandler, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import { createStackNavigator } from '@react-navigation/stack';
import { Entypo, FontAwesome } from 'react-native-vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const Stack = createStackNavigator();

const ConceptMe = ({ navigation }) => {
  const [textInput, setTextInput] = useState('');
  const [ageInput, setAgeInput] = useState('5');

  

  const handleSend = async () => {
    const age = parseInt(ageInput);
    if (isNaN(age) || age < 5 || age > 25) {
      alert('Please enter a valid age between 5 and 70.');
      return;
    }
    navigation.navigate('ResponseScreen', { topic: textInput, age: ageInput });
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'Exit App',
          'Are you sure you want to exit?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Exit', onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: false }
        );
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => backHandler.remove();
    }, [])
  );
  return (
    <SafeAreaView style={styles.mainContainer}>
      <View  style={styles.buttonContainer}>
      <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('ProfileScreen')}>
      <FontAwesome name="user-circle-o" size={22} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.noteButton} onPress={() => navigation.navigate('NoteScreen')}>
        <Entypo name="book" size={22} color="black" />
      </TouchableOpacity>
      </View>
      <View style={styles.mottoContainer}>
        <Text style={styles.mottoText}>Break Barriers,</Text>
        <Text style={styles.mottoText}>Be Extraordinary </Text>
      </View>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps='handled'>
        <Text style={styles.title}>X-Plainer</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={textInput}
            placeholder="Enter topic"
            placeholderTextColor="gray"
            onChangeText={text => setTextInput(text)}
          />
          <View style={styles.sliderContainer}>
            <Text style={styles.ageText}>Age: {ageInput}</Text>
            <Slider
              style={styles.slider}
              minimumValue={5}
              maximumValue={25}
              step={1}
              value={Number(ageInput)}
              onValueChange={value => setAgeInput(value.toString())}
              trackStyle={styles.sliderTrack}
            />
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.button,
            { opacity: !textInput || !ageInput ? 0.7 : 1 },
          ]}
          disabled={!textInput || !ageInput}
          onPress={handleSend}
        >
          <Text style={styles.buttonText}>Go</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};


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
  title: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 26,
    marginBottom: 20,
    marginTop: 10,
    
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
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
  ageText: {
    marginTop: 10,
    color: 'black',
    marginRight: 5,
    fontWeight: 'bold',
    
  },
  slider: {
    width: '100%',
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
  button: {
    backgroundColor: '#55a1a1',
    width: '50%',
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
  noteButton: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#a7dbd8',
    borderWidth: 1.5,
    borderColor: 'black',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 5,
    marginRight : 8,
    borderRightWidth: 4,
    borderBottomWidth: 5,
    justifyContent: 'center',
    width: 50,
  },
  mottoText: {
    marginTop: 5,
    alignSelf: 'center',
    
    fontWeight: 900,
    fontSize: 26,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#000000',
    marginBottom: 10,
  },
  mottoContainer: {
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 12,
    borderWidth: 1.5,
    width:'70%',
    padding: 15,
    borderRightWidth: 5,
    borderBottomWidth: 6,
    borderRadius: 5,
    backgroundColor: '#ecb9fa',

  },

  profileButton: {
      alignSelf: 'flex-start',
      alignItems: 'center',
      backgroundColor: '#a7dbd8',
      borderWidth: 1.5,
      borderColor: 'black',
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginTop: 5,
      marginLeft: 8,
      borderRightWidth: 4,
      borderBottomWidth: 5,
      justifyContent: 'center',
      width: 50,
  },
  buttonContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});
export default ConceptMe;


