import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import { SafeAreaView } from 'react-native-safe-area-context'
import { moderateScale, moderateVerticalScale, scale, verticalScale } from 'react-native-size-matters'
import { useAuth } from '@/contexts/authContext'
import { updateUser } from '@/services/userService'
import BackButton from '@/src/components/atoms/backButton'
import PrimaryButton from '@/src/components/atoms/primarybtn'
import Colors from '@/src/constants/colors'
import { UserDataType } from '@/types'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import * as Icons from 'phosphor-react-native'
import * as ImagePicker from 'expo-image-picker';
import { getProfileImage } from '@/services/imgServices'



const ProfileModal = () => {
    const { user, updateUserData } = useAuth();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });

        if (!result.canceled) {
            setUserData({ ...userData, image: result.assets[0] });

        }
    }

    const [userData, setUserData] = useState<UserDataType>({
        name: "",
        image: null,
    });
    useEffect(() => {
        setUserData({
            name: user?.name || "",
            image: user?.image || null,
        });
    }, [user]);

    const onSubmit = async () => {
        let { name, image } = userData;
        if (!name.trim()) {
            Alert.alert("User", "Please fill all the fields");
            return;
        }
        //to-do
        setLoading(true);
        const res = await updateUser(user?.uid as string, userData)
        if (res.success) {
            await updateUserData(user?.uid as string);
            setLoading(false);
            router.back();
        } else {
            setLoading(false);
            Alert.alert("User", res.msg);
        }
    }
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={moderateScale(60)}
                >
                    <View style={{ flex: 1 }}>
                        <ScrollView
                            contentContainerStyle={{ flexGrow: 1 }}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                        >
                            {/* Header */}
                            <View style={styles.header}>
                                <View style={styles.headerSide}>
                                    <BackButton />
                                </View>
                                <View style={styles.headerCenter}>
                                    <Text style={styles.title}>Profile Modal</Text>
                                </View>

                            </View>

                            {/* User Image */}
                            <View style={styles.avatarContainer}>
                                <Image source={getProfileImage(userData?.image)} style={styles.img} contentFit='cover' transition={100} />
                                <TouchableOpacity style={styles.editImage} onPress={pickImage}>
                                    <Icons.PencilIcon size={verticalScale(20)} color='#171A1C' />

                                </TouchableOpacity>
                            </View>

                            {/* Input */}
                            <View style={{ gap: moderateVerticalScale(8) }}>
                                <Text style={styles.inputLabel}>Name</Text>
                                <TextInput style={styles.inputContainer} placeholder='Name' placeholderTextColor={Colors.placeHolder} value={userData.name}
                                    onChangeText={(value) => setUserData((prev) => ({ ...prev, name: value }))}
                                />
                            </View>
                        </ScrollView>
                        {/* Footer */}
                        <View style={{
                            backgroundColor: Colors.background,
                            paddingBottom: heightPercentageToDP(2),
                        }}>
                            <View style={styles.divider} />
                            {
                                !loading && (
                                    <PrimaryButton text='Update Profile' btnStyle={{ paddingVertical: moderateVerticalScale(16) }}
                                        btnTextStyle={{ fontSize: moderateScale(16), fontWeight: '700' }} onPress={onSubmit} />
                                )
                            }
                            {
                                loading && (
                                    <ActivityIndicator size={'large'} color={Colors.green} />
                                )
                            }

                        </View>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: heightPercentageToDP(2),
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: moderateVerticalScale(16),
    },
    headerSide: {
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: 'white',
        fontSize: moderateScale(32),
        fontWeight: 'bold',
    },
    inputLabel: {
        color: 'white',
        fontSize: moderateScale(18),
        fontWeight: '600',
        marginTop: heightPercentageToDP(4)
    },
    inputContainer: {
        borderWidth: moderateVerticalScale(1),
        borderColor: 'white',
        borderRadius: moderateScale(12),
        fontSize: moderateScale(18),
        color: 'white',
        paddingHorizontal: widthPercentageToDP(6),
        paddingVertical: widthPercentageToDP(4),
    },
    divider: {
        height: 1,
        backgroundColor: '#717171',
        marginBottom: moderateVerticalScale(8),
    },
    img: {
        alignSelf: 'center',
        height: moderateScale(135),
        width: moderateScale(135),
        borderRadius: 200,
        borderWidth: 1,
        borderColor: '#737373'
    },
    avatarContainer: {
        position: 'relative',
        alignSelf: 'center'
    },
    editImage: {
        position: 'absolute',
        bottom: moderateScale(5),
        right: moderateScale(7),
        backgroundColor: '#C0CCC2',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 10,
        elevation: 4,
        padding: 7,
        borderRadius: 50,
    }
})

export default ProfileModal
