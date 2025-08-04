import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Switch,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { moderateScale, verticalScale } from 'react-native-size-matters';

type CustomButtonProps = {
  text?: string;
  containerStyle?: StyleProp<ViewStyle>;
  leftIconContainer?: StyleProp<ViewStyle>;
  rightIconContainer?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
  lefticon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  switchbtn?: boolean;
};


const SecondaryButton = ({
  text,
  containerStyle,
  textStyle,
  onPress,
  lefticon,
  leftIconContainer,
  switchbtn,
  rightIcon,
  rightIconContainer,
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.background, containerStyle]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      {text ? (
        <View style={styles.row}>
          {lefticon && (
            <View style={[styles.leftIconContainer, leftIconContainer]}>{lefticon}</View>
          )}
          <Text style={[styles.text, textStyle]}>{text}</Text>
          <View style={rightIconContainer}>
            {rightIcon && <View style={{ justifyContent: 'center', alignItems: 'center' }}>{rightIcon}</View>}
            {typeof switchbtn === 'boolean' && (
              <Switch value={switchbtn} onValueChange={onPress} />
            )}
          </View>
        </View>
      ) : (
        // ✅ If no text, center icon alone
        <View style={[styles.centeredIconOnly]}>
          {lefticon}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'rgb(222, 91, 91)',
    paddingVertical: verticalScale(10),
    width: wp(80),
    borderRadius: moderateScale(12),
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
  },
  leftIconContainer: {
    width: moderateScale(30), // fixed width
    alignItems: 'center',
    marginRight: moderateScale(10),
  },
  text: {
    color: 'white',
    fontSize: moderateScale(16),
    textAlign: 'left',
  },
  centeredIconOnly: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default SecondaryButton;
