import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, StyleProp } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { moderateScale } from 'react-native-size-matters';
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import { useRouter } from 'expo-router';

type CustomButtonProps = {
  btnStyle?: StyleProp<ViewStyle>;
};
const BackButton = ({btnStyle}:CustomButtonProps) => {
// render
const router=useRouter();
    return (
      <TouchableOpacity onPress={router.back}>
        <View style={[styles.btnContainer,btnStyle]}>
            <Ionicons name="chevron-back" size={24} color="white" />
        </View>
      </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
btnContainer:{
    width:widthPercentageToDP(8),
    height:heightPercentageToDP(4),
    backgroundColor:'rgba(179, 171, 171, 0.53)',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:moderateScale(8),
},
})

export default BackButton

