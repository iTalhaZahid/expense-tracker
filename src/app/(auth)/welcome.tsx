import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import imagePath from '@/src/constants/imagePath';
import PrimaryButton from '@/src/components/atoms/primarybtn';
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CustomStatusBar from '@/src/components/atoms/customStatusBar';
import { useRouter } from 'expo-router';


const Welcome = () => {
  const router = useRouter();
  const signUp = () => router.push('/signUp');
  const signIn = () => router.push('/signIn')
  return (
    <View style={styles.container}>
      <CustomStatusBar />
      <View style={styles.wrapper}>
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.signInButton} activeOpacity={0.7} onPress={signIn}>
            <Text style={styles.signInText}>Sign in</Text>
          </TouchableOpacity>
          <Image
            style={styles.image}
            source={imagePath.welcome}
            resizeMode="contain"
          />
        </View>

        {/* Footer Section */}
        <View style={styles.footer}>
          <Text style={styles.title}>Always take control of your finances</Text>
          <Text style={styles.subtitle}>
            Finances must be managed to set a better lifestyle in future
          </Text>
          <PrimaryButton text="Get Started" btnStyle={styles.getStartedButton} onPress={signUp} btnTextStyle={styles.getStartedButtonText} />
        </View>
      </View>
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInButton: {
    width: wp(26),
    alignSelf: 'flex-end',
    position: 'absolute',
    top: moderateScale(12),
    right: moderateScale(-8),
  },
  signInText: {
    fontWeight: '500',
    fontSize: moderateScale(16),
    textAlign: 'center',
    color: 'white'
  },
  image: {
    width: wp(100),
    alignSelf: 'center',
  },
  footer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
    gap: moderateScale(16),
    padding: wp(6),
    borderTopLeftRadius: wp(6),
    borderTopRightRadius: wp(6),
  },
  title: {
    textAlign: 'center',
    color: 'white',
    fontSize: moderateScale(32),
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    color: '#cccccc',
    fontSize: moderateScale(16),
    fontWeight: '400',
  },
  getStartedButton: {
    marginBottom: hp(3),
    backgroundColor: '#7CFC00',
    borderRadius: moderateScale(16)
  },
  getStartedButtonText:{
     fontSize: moderateScale(24), fontWeight: '600', color: '#0a0a0a' ,
  }
});
