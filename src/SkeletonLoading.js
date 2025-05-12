import { View, StyleSheet, Animated } from 'react-native';
import React, { useEffect } from 'react';

const SkeletonLoading = () => {
  const shimmerAnimation = new Animated.Value(0);

  useEffect(() => {
    shimmer();
  }, [shimmerAnimation]);

  const shimmer = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const shimmerTranslate = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-25, 25],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.skeleton,
          { transform: [{ translateX: shimmerTranslate }] },
        ]}
      />
      <Animated.View
        style={[
          styles.skeleton,
          { transform: [{ translateX: shimmerTranslate }] },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  skeleton: {
    backgroundColor: '#ebebeb',
    borderRadius: 5,
    marginBottom: 10,
    width: '90%',
    height: 20,
  },
});

export default SkeletonLoading;
