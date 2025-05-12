import ConceptMe from './src/ConceptMe';
import ResponseScreen from './src/ResponseScreen';
import NoteScreen from './src/NoteScreen';
import FullNoteScreen from './src/FullNoteScreen';
import { AuthProvider } from './src/AuthContext';
import LoginScreen from './src/LoginScreen';
import SignUpScreen from './src/SignUpScreen';
import ProfileScreen from './src/ProfileScreen';
import QuizScreen from './src/QuizScreen';
import { NavigationContainer } from '@react-navigation/native';
import {TransitionPresets  } from '@react-navigation/stack';
import { createStackNavigator} from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import LeaderboardScreen from './src/LeaderboardScreen';
import EditProfileScreen from './src/EditProfileScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <AuthProvider>
    <NavigationContainer>
      <StatusBar backgroundColor="#f5f5f5" barStyle="dark-content"/>
      <Stack.Navigator
        initialRouteName="LoginScreen"
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.FadeFromBottomAndroid, 
        }}
      > 
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="ConceptMe" component={ConceptMe} />
        <Stack.Screen name="ResponseScreen" component={ResponseScreen} />
        <Stack.Screen name="NoteScreen" component={NoteScreen} />
        <Stack.Screen name="FullNoteScreen" component={FullNoteScreen} />
        <Stack.Screen name="QuizScreen" component={QuizScreen} />
        <Stack.Screen name="LeaderboardScreen" component={LeaderboardScreen} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />

      </Stack.Navigator>
    </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
