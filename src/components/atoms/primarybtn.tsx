import React from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

type CustomButtonProps = {
  text: string ;
  btnStyle?: StyleProp<ViewStyle>;
  btnTextStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
};

const PrimaryButton = ({ text, btnStyle, btnTextStyle, onPress }: CustomButtonProps) => {
  return (
    <TouchableOpacity style={[styles.btn, btnStyle]} onPress={onPress} activeOpacity={0.7}>
      <Text style={[styles.textStyle, btnTextStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7CFC00',
    borderRadius: moderateScale(16)
  },
  textStyle: {
    color: '#00000',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default PrimaryButton;
