import { useAuth } from '@/contexts/authContext'
import { createOrUpdateWallet, deleteWallet } from '@/services/walletService'
import BackButton from '@/src/components/atoms/backButton'
import ImageUpload from '@/src/components/atoms/ImageUpload'
import PrimaryButton from '@/src/components/atoms/primarybtn'
import SecondaryButton from '@/src/components/atoms/secondarybtn'
import Colors from '@/src/constants/colors'
import { UserDataType, WalletType } from '@/types'
import { useLocalSearchParams, useRouter } from 'expo-router'
import * as Icons from 'phosphor-react-native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import { SafeAreaView } from 'react-native-safe-area-context'
import { moderateScale, moderateVerticalScale, verticalScale } from 'react-native-size-matters'
import * as ImagePicker from 'expo-image-picker';


const WalletModal = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
  
    const [wallet, setWallet] = useState<WalletType>({
        name: "",
        image: null,
    });

    const onDelete = async () => {
        if (!oldWallet?.id) return;
        setLoading(true);
        const res = await deleteWallet(oldWallet?.id);
        setLoading(false);
        if (res.success) {

            Alert.alert("Action Success", "Wallet Deleted successfully", [
                {
                    text: "OK",
                    onPress: () => router.back(), // safer than back
                }
            ]);
        }
        else {
            Alert.alert('Wallet', res.msg);
        }
    }

       const oldWallet: { name: string; image: string; id: string } =
        useLocalSearchParams();


    useEffect(() => {
        if (oldWallet?.id) {
            setWallet({
                name: oldWallet?.name,
                image: oldWallet?.image

            })
        }
    }, [oldWallet?.id])


    const showDeleteAlert = () => {
        Alert.alert(
            "Confirm",
            "Are you sure? This will also remove all transactions made through this wallet.",
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: onDelete,
                    style: 'destructive',
                },
            ],
            { cancelable: false }
        );
    };


 
    

    const onSubmit = async () => {
        let { name, image } = wallet;
        if (!name.trim() || !image) {
            Alert.alert("Wallet", "Please fill all the fields")
            return;
        };
        const data: WalletType = {
            name,
            image,
            uid: user?.uid
        };
        if (oldWallet?.id) data.id = oldWallet?.id
        // if (oldWallet?.image== null )
        setLoading(true);
        const res = await createOrUpdateWallet(data)
        setLoading(false);
        // console.log("result",res)
        if (res.success) {
            router.back();
        } else {
            Alert.alert("Wallet", res.msg);
        }

    };
    return (
        <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={moderateScale(60)}
                >

                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerSide}>
                            <BackButton />
                        </View>
                        <View style={styles.headerCenter}>
                            <Text style={styles.title}>Add Wallet</Text>
                        </View>
                    </View>
                    {/* Input */}
                    <View style={{ gap: moderateVerticalScale(8) }}>
                        <Text style={styles.inputLabel}>Wallet Name</Text>
                        <TextInput style={styles.inputContainer} placeholder='e.g., Salary' placeholderTextColor={Colors.placeHolder}
                            value={wallet.name}
                            onChangeText={(value) => {
                                setWallet({ ...wallet, name: value })
                            }}
                        />
                    </View>
                    {/* Upload File */}
                    <View style={{ gap: moderateVerticalScale(8) }}>
                        <Text style={styles.inputLabel}>Wallet Icon</Text>
                        {/* Image Icon Upload */}
                        <ImageUpload
                            placeholder='Upload Image'
                            file={wallet.image}
                            onSelect={(file) => setWallet({ ...wallet, image: file })}
                            onClear={() => setWallet({ ...wallet, image: null })} />
                    </View>
                    {/* Footer */}
                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                        <View style={{ height: 1, backgroundColor: '#717171', marginBottom: moderateVerticalScale(8) }} />
                        {
                            !loading && !oldWallet.id && (
                                <PrimaryButton
                                    text="Add Wallet"
                                    btnStyle={{ paddingVertical: moderateVerticalScale(16) }}
                                    btnTextStyle={{ fontSize: moderateScale(16), fontWeight: '700', width: widthPercentageToDP(80) }}
                                    onPress={onSubmit}

                                />
                            )
                        }

                        {!loading && oldWallet?.id && (
                            <View style={{ gap: moderateVerticalScale(8,), flexDirection: 'row', justifyContent: 'center' }}>
                                <SecondaryButton
                                    lefticon={
                                        <Icons.TrashIcon color="white" size={verticalScale(20)} weight="bold" />
                                    }
                                    containerStyle={{
                                        width: widthPercentageToDP(14),
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        paddingHorizontal: 0,
                                        paddingVertical: moderateVerticalScale(16)
                                    }}
                                    leftIconContainer={{ flexGrow: 1 }}
                                    onPress={showDeleteAlert}
                                />

                                <PrimaryButton
                                    text="Update Wallet"
                                    btnStyle={{ paddingVertical: moderateVerticalScale(16) }}
                                    btnTextStyle={{ fontSize: moderateScale(16), fontWeight: '700', width: widthPercentageToDP(50) }}
                                    onPress={onSubmit}

                                />
                            </View>
                        )}

                        {
                            loading && (
                                <ActivityIndicator color={Colors.green} size={'large'} />
                            )
                        }

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
})

export default WalletModal
