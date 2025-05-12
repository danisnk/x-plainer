import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, StyleSheet, SafeAreaView } from 'react-native';
import { getFirestore, collection, query, getDocs, deleteDoc, doc, where, addDoc, setDoc, updateDoc, serverTimestamp , getDoc} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const QuizScreen = ({ navigation }) => {
  const [quizDataList, setQuizDataList] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const isFocused = useIsFocused();
  const [disableOptions, setDisableOptions] = useState(false);


  useEffect(() => {
    if (isFocused) {
      const retrieveUserToken = async () => {
        try {
          const userToken = await AsyncStorage.getItem('userToken');
          if (userToken !== null) {
            const user = { uid: userToken };
            fetchQuizData(user);
          } else {
            console.log('User token not found');
          }
        } catch (error) {
          console.error('Error retrieving user token:', error);
        }
      };

      const fetchQuizData = async (user) => {
        try {
          const db = getFirestore();
          const quizRef = collection(db, 'quizzes');
          const q = query(quizRef, where('userId', '==', user.uid));

          const querySnapshot = await getDocs(q);

          const fetchedQuizDataList = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const answers = data.answers;
            const updatedWrongAnswers = { ...data.wrongAnswers };
            Object.keys(updatedWrongAnswers).forEach((questionKey) => {
              const questionNumber = questionKey.replace('question', '');
              const answerKey = `answer${questionNumber}`;
              updatedWrongAnswers[questionKey].correctAnswer = answers[answerKey];
            });
            fetchedQuizDataList.push({ ...data, wrongAnswers: updatedWrongAnswers, docId: doc.id });
          });

          setQuizDataList(fetchedQuizDataList);
          setCurrentQuizIndex(0);
        } catch (error) {
          console.error('Error fetching quiz data:', error);
        }
      };

      retrieveUserToken();
    }
  }, [isFocused]);

  const handleAnswer = (questionId, selectedOption) => {
    setSelectedAnswers((prevSelectedAnswers) => ({
      ...prevSelectedAnswers,
      [questionId]: selectedOption,
    }));
  };


  const handleSubmit = async () => {
    try {
        const db = getFirestore();
        
        // Get the user's ID from AsyncStorage
        const userToken = await AsyncStorage.getItem('userToken');
        
        // Calculate the current score
        let currentScore = 0;
        Object.entries(selectedAnswers).forEach(([questionId, selectedOption]) => {
            const correctAnswer = quizDataList[currentQuizIndex].wrongAnswers[questionId].correctAnswer;
            if (selectedOption === correctAnswer) {
                currentScore++;
            }
        });

        // Check if a user document exists in the "users" collection
        const userDocRef = doc(db, 'users', userToken);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
            // If the document exists, update the score field
            const userData = userDocSnapshot.data();
            const existingScore = userData.score || 0;
            const updatedScore = existingScore + currentScore;

            await updateDoc(userDocRef, {
                score: updatedScore,
                timestamp: serverTimestamp()
            });
        } else {
            // If the document doesn't exist, create a new user document with the score
            await setDoc(userDocRef, {
                score: currentScore,
                timestamp: serverTimestamp()
            });
        }

        // Update the current score by adding the new score
        setScore(currentScore);

        setShowScoreModal(true);
        setDisableOptions(true);
    } catch (error) {
        console.error('Error handling quiz submission:', error);
    }
};



  const handleNextQuiz = () => {
    setShowScoreModal(false);
    setCurrentQuizIndex((prevIndex) => prevIndex + 1);
    setSelectedAnswers({});
    setScore(0);
    setDisableOptions(false);
  };

  const handleDone = async () => {
    try {
      const db = getFirestore();

      for (const quizData of quizDataList) {
        const quizRef = doc(db, 'quizzes', quizData.docId);
        await deleteDoc(quizRef);
      }

      setCurrentQuizIndex(0);
      setSelectedAnswers({});
      setScore(0);
      setShowScoreModal(false);
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting quiz data:', error);
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {quizDataList.length > 0 && currentQuizIndex < quizDataList.length ? (
            <View style={{ padding: 10 }}>
              <Text style={styles.heading}>Assessment</Text>
              {Object.entries(quizDataList[currentQuizIndex].questions).map(([questionId, question]) => (
                <View key={questionId}>
                  <View style={styles.divider}></View>
                  <Text style={styles.question}>{question}</Text>

                  {Object.entries(quizDataList[currentQuizIndex].wrongAnswers[questionId]).map(([key, option]) => option)
                    .sort()
                    .map((option) => {
                      const isCorrectAnswer = quizDataList[currentQuizIndex].wrongAnswers[questionId].correctAnswer === option;
                      const isSelectedAnswer = selectedAnswers[questionId] === option;
                      const shouldShowCorrectAnswer = score > 0 && isCorrectAnswer;
                      const shouldHighlightSelectedAnswer = isSelectedAnswer;
                      const answerStyle = {};

                      if (shouldShowCorrectAnswer) {
                        answerStyle.backgroundColor = '#9ef7a9';
                      } else if (shouldHighlightSelectedAnswer) {
                        answerStyle.backgroundColor = '#f78de3';
                      } else {
                        answerStyle.borderColor = 'black';
                      }

                      return (
                        <TouchableOpacity
                          key={option}
                          onPress={() => handleAnswer(questionId, option)}
                          style={[styles.answerOption, answerStyle]}
                          disabled={disableOptions}
                        >
                          <Text style={styles.option}>{option}</Text>
                        </TouchableOpacity>
                      );
                    })}
                </View>
              ))}
              {showScoreModal ? (
                <>
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <View style={styles.modalsBox}>
                        <Text style={styles.scoreText}>
                          You scored {score} out of {Object.keys(quizDataList[currentQuizIndex]?.questions || {}).length}
                        </Text>
                      </View>
                    </View>
                  </View>
                  {currentQuizIndex < quizDataList.length - 1 ? (
                    <TouchableOpacity onPress={handleNextQuiz} style={styles.nextQuizButton}>
                      <Text>Next Quiz</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={handleDone} style={styles.doneButton}>
                      <Text>Done</Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                  <Text>{currentQuizIndex === quizDataList.length - 1 ? 'Submit' : 'Submit'}</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <Text>
              {quizDataList.length > 0 ? (
                currentQuizIndex >= quizDataList.length ? (
                  'All quizzes completed'
                ) : (
                  'Loading quiz data...'
                )
              ) : (
                'No quiz data available'
              )}
            </Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  answerOption: {
    borderWidth: 1.5,
    borderRightWidth: 4,
    borderBottomWidth: 5,
    borderRadius: 4,
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#bff5ea',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1.5,
    borderRadius: 10,
    borderRightWidth: 6,
    borderBottomWidth: 5,
    backgroundColor: '#f5f5f5',
    marginBottom: 15,
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
  question: {
    marginTop: 16,
    fontWeight: 'bold',
    fontSize: 17,
  },
  option: {
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#b9cdfa',
    width: '50%',
    height: 50,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 1.5,
    borderRightWidth: 5,
    borderBottomWidth: 6,
    borderColor: 'black',
    padding: 10,
    paddingLeft: 16,
    paddingRight: 16,
  },
  nextQuizButton: {
    backgroundColor: '#b9cdfa',
    width: '50%',
    height: 50,
    borderRadius: 6,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRightWidth: 5,
    borderBottomWidth: 6,
    borderColor: 'black',
    padding: 10,
    paddingLeft: 16,
    paddingRight: 16,
  },
  doneButton: {
    backgroundColor: '#b9cdfa',
    width: '50%',
    height: 50,
    borderRadius: 6,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRightWidth: 5,
    borderBottomWidth: 6,
    borderColor: 'black',
    padding: 10,
    paddingLeft: 16,
    paddingRight: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  modalContent: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#fadede',
    width: '50%',
    height: 50,
    borderRadius: 6,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRightWidth: 5,
    borderBottomWidth: 6,
    borderColor: 'black',
    padding: 10,
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 20,
  },
  closeButtonText: {
    fontWeight: 'bold',
    color: 'black',
  },
  modalsBox: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    borderRightWidth: 4,
    borderBottomWidth: 5,
    backgroundColor: '#fce8fc',
  }
});

export default QuizScreen;
