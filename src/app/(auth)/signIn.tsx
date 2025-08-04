import React, { useRef, useState } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native'
import CustomStatusBar from '../../components/atoms/customStatusBar'
import PrimaryButton from '../../components/atoms/primarybtn'
import BackButton from '../../components/atoms/backButton'
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters'
import Entypo from '@expo/vector-icons/Entypo'
import AntDesign from '@expo/vector-icons/AntDesign'
import { useRouter } from 'expo-router'
import { useAuth } from '@/contexts/authContext'
import Colors from '@/src/constants/colors'


const SignIn = () => {
    const router = useRouter();
    const signUp = () => router.replace('/signUp');
    const emailref = useRef("");
    const passwordref = useRef("");
    const [isLoading, setisLoading] = useState(false);
    const { login: loginUser } = useAuth();
    const validation = async () => {
        if (!passwordref.current || !emailref) {
            Alert.alert("Sign in", "Please fill all details!")
            return;
        }
        setisLoading(true);
        const res = await loginUser(emailref.current, passwordref.current);
        if (!res.success) {
            Alert.alert("Login Failed", res.msg)
            setisLoading(false);
        }

    }
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false} keyboardShouldPersistTaps="handled">
                <View style={styles.topContainer}>
                    <View>
                        <CustomStatusBar />
                        <BackButton btnStyle={{ marginBottom: moderateVerticalScale(38) }} />
                        <Text style={styles.mainText}>Hey,</Text>
                        <Text style={styles.mainText}>Welcome Back</Text>

                        <View style={{ gap: moderateVerticalScale(16), marginVertical: moderateVerticalScale(32) }}>
                            <Text style={styles.subText}>Login now to track all your expenses</Text>

                            <View style={styles.inputContainer}>
                                <Entypo name="email" size={22} color="white" />
                                <TextInput
                                    placeholder="Enter your Email"
                                    placeholderTextColor={'#8C8C8C'}
                                    style={styles.inputFields}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    onChangeText={value => { emailref.current = value }}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <AntDesign name="lock1" size={24} color="white" />
                                <TextInput
                                    secureTextEntry
                                    placeholder="Enter your Password"
                                    placeholderTextColor={'#8C8C8C'}
                                    style={styles.inputFields}
                                    onChangeText={value => { passwordref.current = value }}
                                />
                            </View>

                            <Pressable style={{ alignSelf: 'flex-end' }} >
                                <Text style={{ color: 'white' }}>
                                    Forgot Password?
                                </Text>
                            </Pressable >
                            <View>
                                {
                                    !isLoading && (
                                        <PrimaryButton text="Sign In" onPress={validation} />
                                    )
                                }
                                {
                                    isLoading && (
                                        <ActivityIndicator color={Colors.green} size={'large'} />
                                    )
                                }

                            </View>
                        </View>
                    </View>

                    <View style={{ justifyContent: 'flex-start', flex: 1 }} >
                        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: moderateScale(2) }}>
                            <Text style={{ color: 'white', fontSize: moderateScale(14) }}>
                                Don't have an account?
                            </Text>
                            <Pressable onPress={signUp} accessibilityRole="button">
                                <Text style={{ color: '#7CFC00', fontWeight: '400', fontSize: moderateScale(14) }}>
                                    Sign Up
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    topContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        padding: moderateScale(16),
        justifyContent: 'space-between',
    },
    mainText: {
        color: 'white',
        fontSize: moderateScale(32),
        fontWeight: 'bold',
    },
    subText: {
        color: '#cccccc',
        fontSize: moderateScale(16),
        fontWeight: '400',
    },
    inputContainer: {
        flexDirection: 'row',
        borderWidth: moderateScale(1),
        borderColor: '#cccccc',
        alignItems: 'center',
        borderRadius: moderateScale(18),
        paddingVertical: moderateVerticalScale(12),
        paddingHorizontal: moderateScale(8),
        gap: moderateScale(4),
    },
    inputFields: {
        fontSize: moderateScale(16),
        color: 'white',
        flex: 1,
        paddingHorizontal: moderateVerticalScale(4),
    },
});

export default SignIn;
