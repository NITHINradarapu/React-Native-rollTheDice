import {
  Text,
  StyleSheet,
  View,
  Image,
  Pressable,
  ImageSourcePropType,
  Animated,
  Easing,
} from 'react-native';
import type { PropsWithChildren } from 'react';
import React, { useState, useRef } from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import DiceOne from '../assets/One.png';
import DiceTwo from '../assets/Two.png';
import DiceThree from '../assets/Three.png';
import DiceFour from '../assets/Four.png';
import DiceFive from '../assets/Five.png';
import DiceSix from '../assets/Six.png';

type DiceProps = PropsWithChildren<{
  imageUrl: ImageSourcePropType;
  spinAnim: Animated.Value;
  bounceAnim: Animated.Value;
  fadeAnim: Animated.Value;
}>;

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const Dice = ({ imageUrl, spinAnim, bounceAnim, fadeAnim }: DiceProps): React.JSX.Element => {
  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'],
  });

  return (
    <Animated.View
      style={[
        styles.diceContainer,
        {
          transform: [{ rotate: spin }, { scale: bounceAnim }],
          opacity: fadeAnim,
        },
      ]}>
      <Image style={styles.diceImage} source={imageUrl} />
    </Animated.View>
  );
};

function App(): React.JSX.Element {
  const [diceImage, setDiceImage] = useState<ImageSourcePropType>(DiceOne);
  const [isRolling, setIsRolling] = useState(false);

  const spinValue = useRef(new Animated.Value(0)).current;
  const bounceValue = useRef(new Animated.Value(1)).current;
  const fadeValue = useRef(new Animated.Value(1)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const animateButtonPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const animateButtonPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const rollDiceOnTap = () => {
    if (isRolling) return;
    setIsRolling(true);

    // Reset animation values
    spinValue.setValue(0);
    bounceValue.setValue(1);

    // Run spin + bounce + fade animations in parallel
    Animated.parallel([
      // Spin animation (720° rotation)
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      // Bounce: shrink then spring back
      Animated.sequence([
        Animated.timing(bounceValue, {
          toValue: 0.4,
          duration: 150,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(bounceValue, {
          toValue: 1,
          friction: 3,
          tension: 80,
          useNativeDriver: true,
        }),
      ]),
      // Fade out then back in
      Animated.sequence([
        Animated.timing(fadeValue, {
          toValue: 0.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeValue, {
          toValue: 1,
          duration: 200, 
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => setIsRolling(false));

    // Set the new dice face mid-spin
    setTimeout(() => {
      const randomNumber = Math.floor(Math.random() * 6) + 1;

      switch (randomNumber) {
        case 1:
          setDiceImage(DiceOne);
          break;
        case 2:
          setDiceImage(DiceTwo);
          break;
        case 3:
          setDiceImage(DiceThree);
          break;
        case 4:
          setDiceImage(DiceFour);
          break;
        case 5:
          setDiceImage(DiceFive);
          break;
        case 6:
          setDiceImage(DiceSix);
          break;
        default:
          setDiceImage(DiceOne);
          break;
      }
    }, 150);

    ReactNativeHapticFeedback.trigger('impactLight', options);
  };

  return (
    <View style={styles.container}>
      <Dice
        imageUrl={diceImage}
        spinAnim={spinValue}
        bounceAnim={bounceValue}
        fadeAnim={fadeValue}
      />
      <Pressable
        onPress={rollDiceOnTap}
        onPressIn={animateButtonPressIn}
        onPressOut={animateButtonPressOut}
        disabled={isRolling}>
        <Animated.Text
          style={[
            styles.rollDiceBtnText,
            { transform: [{ scale: buttonScale }] },
            isRolling && styles.rollDiceBtnDisabled,
          ]}>
          {isRolling ? 'Rolling...' : 'Roll the dice'}
        </Animated.Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF2F2',
  },
  diceContainer: {
    margin: 12,
  },
  diceImage: {
    width: 200,
    height: 200,
  },
  rollDiceBtnText: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#E5E0FF',
    fontSize: 16,
    color: '#8EA7E9',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  rollDiceBtnDisabled: {
    opacity: 0.5,
  },
});

export default App;
