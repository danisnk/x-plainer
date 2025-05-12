import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, SafeAreaView } from 'react-native';
import { MaterialIcons, Entypo } from 'react-native-vector-icons';
import * as Animatable from 'react-native-animatable';
import axios from 'axios';
import SkeletonLoading from './SkeletonLoading';
import SkeletonLoading2 from './SkeletonLoading2';
import { useAuth } from './AuthContext';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';





const ResponseScreen = ({ navigation, route }) => {
  const [topicHead, setTopicHead] = useState(" ");
  const { topic, age } = route.params;
  const [subject, setSubject] = useState(topic);
  const [loading, setLoading] = useState(true);
  const [userUid, setUserUid] = useState(null);
  const [text, setText] = useState("");
  const [addToNoteDisabled, setAddToNoteDisabled] = useState(true);
  const [noteAdded, setNoteAdded] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [suggestedQueries, setSuggestedQueries] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const db = getFirestore();
  const notesCollectionRef = collection(db, 'notes');
  const quizRef = collection(db, 'quizzes');
  const { user } = useAuth();
  let query;


  const apiKey = 'API_KEY';
  const apiUrl = 'https://api.openai.com/v1/chat/completions';
  const combinedPrompt = `Please provide a descriptive explanation/answer for the topic/question "${subject}" that is suitable for a ${age}-year-old audience. The response should be between 125 and 400 words long. Use simple language and avoid complex terminology when explaining the topic to young users, while allowing for more complexity when the audience is older. 
    In addition, please suggest 4-5 related queries or questions that the user might have about "${subject}" in array format. Suggest 5 quiz questions based on response you gave for an assessment test in an array format.`;
  

  useEffect(() => {
    const fetchUserUid = async () => {
      try {
        const uid = await AsyncStorage.getItem('userToken');
        setUserUid(uid);

        // Make the API request here
        const apiRequest = async () => {
          try {
            setTopicHead(subject);
            setLoading(true);
            setAddToNoteDisabled(true);
            setNoteAdded(false);

            const response = await axios.post(
              apiUrl,
              {
                "model": "gpt-3.5-turbo-0613",
                "messages": [
                  {
                    "role": "user",
                    "content": combinedPrompt,
                  }
                ],
                "functions": [
                  {
                    "name": "get_explanation",
                    "description": "Please give an explanation of the given topic based on the age given.",
                    "parameters": {
                      "type": "object",
                      "properties": {
                        "explanation": {
                          "type": "string",
                          "description": "explanation for the topic based on the age given."
                        },
                        "queries": {
                          "type": "string",
                          "description": "suggest 4-5 related queries that the user might have about the given topic in an array format."
                        },
                        "questions": {
                          "type": "string",
                          "description": "Send only 5 one word questions based on the response you gave for an assessment test in ['Question 1', 'Question 2', 'Question 3', 'Question 4', 'Question 5'] in this format."
                        },
                        "answers": {
                          "type": "string",
                          "description": "Send answer in one word for corresponding questions in '[\"Answer 1\", \"Answer 2\", \"Answer 3\", , \"Answer 4\", , \"Answer 5\"]'"
                        },
                        "wrong_answers": {
                          "type": "string",
                          "description": "Send only 3 wrong answers for each question in '[[\"Wrong Answer 1\", \"Wrong Answer 2\", \"Wrong Answer 3\"], [\"Wrong Answer 1\", \"Wrong Answer 2\", \"Wrong Answer 3\"], [\"Wrong Answer 1\", \"Wrong Answer 2\", \"Wrong Answer 3\"]],, [\"Wrong Answer 1\", \"Wrong Answer 2\", \"Wrong Answer 3\"],, [\"Wrong Answer 1\", \"Wrong Answer 2\", \"Wrong Answer 3\"]'."
                        },
                      }
                    }
                  }
                ]
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${apiKey}`,
                },
              }
            );

            const args = response.data.choices[0].message.function_call.arguments;
            const { explanation, queries, questions, answers, wrong_answers } = JSON.parse(args);
            setSuggestedQueries(queries);
            setLoading(false);
            setText(explanation);
            setAddToNoteDisabled(false);
            setQuestions(questions);
            setAnswers(answers);
            setWrongAnswers(wrong_answers);
            try {
              const quizKey = `quiz_${Date.now()}`;
              const quizData = {
                quizKey,
                userId: uid,
                questions: {
                  question1: questions[0],
                  question2: questions[1],
                  question3: questions[2],
                  question4: questions[3],
                  question5: questions[4]
                },
                answers: {
                  answer1: answers[0],
                  answer2: answers[1],
                  answer3: answers[2],
                  answer4: answers[3],
                  answer5: answers[4]
                },
                wrongAnswers: {
                  question1: {
                    wrongAnswer1: wrong_answers[0][0],
                    wrongAnswer2: wrong_answers[0][1],
                    wrongAnswer3: wrong_answers[0][2]
                  },
                  question2: {
                    wrongAnswer1: wrong_answers[1][0],
                    wrongAnswer2: wrong_answers[1][1],
                    wrongAnswer3: wrong_answers[1][2]
                  },
                  question3: {
                    wrongAnswer1: wrong_answers[2][0],
                    wrongAnswer2: wrong_answers[2][1],
                    wrongAnswer3: wrong_answers[2][2]
                  },
                  question4: {
                    wrongAnswer1: wrong_answers[3][0],
                    wrongAnswer2: wrong_answers[3][1],
                    wrongAnswer3: wrong_answers[3][2]
                  },
                  question5: {
                    wrongAnswer1: wrong_answers[4][0],
                    wrongAnswer2: wrong_answers[4][1],
                    wrongAnswer3: wrong_answers[4][2]
                  }
                }
              };

              await setDoc(doc(quizRef, quizKey), quizData);
            } catch (error) {
              console.log('Error saving quiz data:', error);
            }
          } catch (error) {
            console.log('Error making API request:', error);
          }
        };

        await apiRequest();
      } catch (error) {
        console.log('Error fetching user UID from AsyncStorage:', error);
      }
    };

    fetchUserUid();
  }, [subject]);



 
  const handleGoBack = () => {
    navigation.goBack();
  };

  // useEffect(() => {
  //   apiRequest();
  // }, [subject]);


  const handleAddToNote = async () => {
    try {
      const noteKey = `note_${Date.now()}`;
      const noteValue = `${topicHead}\n${text}`;

      const noteData = {
        noteKey,
        noteValue,
        userId: userUid,
      };

      await setDoc(doc(notesCollectionRef, noteKey), noteData);

      setNoteAdded(true);
      setAnimating(true);

      setTimeout(() => {
        setNoteAdded(true);
      }, 500);
    } catch (error) {
      console.log('Error saving note:', error);
    }
  };


  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.noteButton} onPress={() => navigation.navigate('NoteScreen')}>
        <Entypo name="book" size={22} color="black" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContent} >

        <View style={[styles.responseContainer, { width: windowWidth * 0.92, height: windowHeight * 0.82 }]}>
          <Text style={styles.heading}>{topicHead}</Text>
          <View style={styles.divider}></View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {loading ? (
              <View style={[styles.skeleton, { width: windowWidth * 0.85 }]}>
                <SkeletonLoading />
                <SkeletonLoading />
                <SkeletonLoading />
                <SkeletonLoading />
                <SkeletonLoading />
                <SkeletonLoading2 />
                <SkeletonLoading2 />
                <SkeletonLoading2 />
              </View>
            ) : (
              <View>
                <Text style={styles.responseText}>{text}</Text>
                <View style={styles.suggestedQueries}>
                  {suggestedQueries?.map((query, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.queryButton}
                      onPress={() => { setSubject(query); }}
                    >
                      <Text style={styles.queryButtonText}>{query}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

            )}
          </ScrollView>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <MaterialIcons name="arrow-back-ios" size={17} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.AddToNote}
          onPress={handleAddToNote}
          disabled={addToNoteDisabled || noteAdded}
        >
          {animating ? (
            <Animatable.Text
              style={styles.addNoteButton}
              animation="fadeOut"
              duration={500}
              onAnimationEnd={() => setAnimating(false)}
            >
              Adding...
            </Animatable.Text>
          ) : (
            <Text style={styles.addNoteButton}>
              {noteAdded ? 'Added to Note' : 'Add to Note'}
            </Text>
          )}
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  responseContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    borderWidth: 1.5,
    borderRightWidth: 5,
    borderBottomWidth: 6,
    marginTop: 5,
    padding: 8,
    alignItems: 'center',
  },

  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },

  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#000000',
    marginBottom: 10,
  },

  responseText: {
    color: '#000000',
    fontSize: 16,
    textAlign: 'center',

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
  },
  skeleton: {
    width: '100%',
    marginBottom: 10,
    paddingTop: 10,
    borderRadius: 10,
  },
  skeletonLine: {
    height: 12,
    backgroundColor: '#ebebeb',
    marginBottom: 10,
    borderRadius: 5,
  },
  skeletonBlock: {
    height: 40,
    backgroundColor: '#ebebeb',
    marginBottom: 10,
    borderRadius: 5,
    margin: 10,
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
    marginTop: 10,
    borderRightWidth: 4,
    borderBottomWidth: 5,
    justifyContent: 'center',
    width: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  addNoteButton: {
    backgroundColor: '#a7dbd8',
    borderWidth: 1.5,
    borderColor: 'black',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 10,
    borderRightWidth: 3,
    borderBottomWidth: 4,
    marginLeft: 100,

  },
  disabledButton: {
    opacity: 0.5,
  },
  suggestedQueries: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  queryButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    margin: 5,
    borderWidth: 1,
    padding: 3,
    borderRightWidth: 3,
    borderBottomWidth: 4,
    backgroundColor: '#e3dff2',
  },
});

export default ResponseScreen;


