import React from 'react';
import { Text, StyleSheet, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MaterialIcons } from 'react-native-vector-icons';

const FullNoteScreen = ({ navigation, route }) => {
  const { note } = route.params;


  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.heading}>{note.split('\n')[0]}</Text>
          <View style={styles.divider}></View>
          <Text style={styles.fullNoteText} numberOfLines={0}>{note.split('\n').slice(1).join("\n")}</Text>
        </ScrollView>
      </ScrollView>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <MaterialIcons name="arrow-back-ios" size={18} color="black" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 16,
    borderWidth: 1.5,
    borderRadius: 10,
    borderBottomWidth: 6,
    borderRightWidth: 5,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  fullNoteText: {
    fontSize: 16,
    
  },
  scrollContent: {
    margin: 5,
    flexGrow: 1,
    justifyContent: 'center',
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
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#000000',
    marginBottom: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    
    textAlign: 'center',
  },

});

export default FullNoteScreen;
