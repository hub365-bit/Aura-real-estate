import { Animated, Easing } from "react-native";

export const fadeIn = (
  animatedValue: Animated.Value,
  duration = 300,
  delay = 0
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: 1,
    duration,
    delay,
    easing: Easing.out(Easing.ease),
    useNativeDriver: true,
  });
};

export const fadeOut = (
  animatedValue: Animated.Value,
  duration = 300,
  delay = 0
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    delay,
    easing: Easing.in(Easing.ease),
    useNativeDriver: true,
  });
};

export const slideInFromBottom = (
  animatedValue: Animated.Value,
  duration = 400,
  delay = 0
): Animated.CompositeAnimation => {
  return Animated.spring(animatedValue, {
    toValue: 0,
    delay,
    tension: 50,
    friction: 7,
    useNativeDriver: true,
  });
};

export const slideOutToBottom = (
  animatedValue: Animated.Value,
  distance = 100,
  duration = 300,
  delay = 0
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: distance,
    duration,
    delay,
    easing: Easing.in(Easing.ease),
    useNativeDriver: true,
  });
};

export const scaleIn = (
  animatedValue: Animated.Value,
  duration = 300,
  delay = 0
): Animated.CompositeAnimation => {
  return Animated.spring(animatedValue, {
    toValue: 1,
    delay,
    tension: 50,
    friction: 7,
    useNativeDriver: true,
  });
};

export const scaleOut = (
  animatedValue: Animated.Value,
  duration = 300,
  delay = 0
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    delay,
    easing: Easing.in(Easing.ease),
    useNativeDriver: true,
  });
};

export const bounce = (
  animatedValue: Animated.Value,
  toValue = 1,
  duration = 600
): Animated.CompositeAnimation => {
  return Animated.spring(animatedValue, {
    toValue,
    friction: 3,
    tension: 40,
    useNativeDriver: true,
  });
};

export const pulse = (
  animatedValue: Animated.Value,
  minValue = 0.95,
  maxValue = 1.05,
  duration = 1000
): Animated.CompositeAnimation => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: maxValue,
        duration: duration / 2,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: minValue,
        duration: duration / 2,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ])
  );
};

export const shake = (animatedValue: Animated.Value): Animated.CompositeAnimation => {
  return Animated.sequence([
    Animated.timing(animatedValue, {
      toValue: 10,
      duration: 50,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: -10,
      duration: 50,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: 10,
      duration: 50,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 50,
      useNativeDriver: true,
    }),
  ]);
};

export const staggeredFadeIn = (
  animatedValues: Animated.Value[],
  staggerDelay = 100,
  duration = 300
): Animated.CompositeAnimation => {
  return Animated.stagger(
    staggerDelay,
    animatedValues.map(value => fadeIn(value, duration))
  );
};

export const parallaxScroll = (
  scrollY: Animated.Value,
  inputRange: number[],
  outputRange: number[]
) => {
  return scrollY.interpolate({
    inputRange,
    outputRange,
    extrapolate: "clamp",
  });
};

export const createAnimatedValue = (initialValue = 0): Animated.Value => {
  return new Animated.Value(initialValue);
};
