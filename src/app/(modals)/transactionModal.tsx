import { useAuth } from '@/contexts/authContext'
import { createOrUpdateTransaction, deleteTransaction } from '@/services/transactionService'
import BackButton from '@/src/components/atoms/backButton'
import ImageUpload from '@/src/components/atoms/ImageUpload'
import PrimaryButton from '@/src/components/atoms/primarybtn'
import SecondaryButton from '@/src/components/atoms/secondarybtn'
import Colors from '@/src/constants/colors'
import { expenseCategories, transactionTypes } from '@/src/constants/data'
import useFetchData from '@/src/hooks/useFetchData'
import { TransactionType, WalletType } from '@/types'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { orderBy, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import * as Icons from 'phosphor-react-native'

import {
    ActivityIndicator,
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import { SafeAreaView } from 'react-native-safe-area-context'
import { moderateScale, moderateVerticalScale, verticalScale } from 'react-native-size-matters'

const TransactionModal = () => {
    const [transaction, setTransaction] = useState<TransactionType>({
        type: '',
        amount: 0,
        description: "",
        category: "",
        date: new Date(),
        walletId: "",
        image: null,
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { user } = useAuth();

    type paramType = {
        id: string,
        type: string,
        amount: string,
        category?: string,
        date: string,
        description?: string,
        image?: string,
        uid?: string,
        walletId: string,

    }

    const oldTransaction: paramType =
        useLocalSearchParams();

    if (oldTransaction?.id) transaction.id = oldTransaction.id;

    const { data: wallets, error: walletError, loading: walletLoading } = useFetchData<WalletType>("wallets", [
        where("uid", "==", user?.uid),
        orderBy("created", "desc")
    ]);


    useEffect(() => {
        if (oldTransaction?.id) {
            setTransaction({
                type: oldTransaction?.type,
                amount: Number(oldTransaction.amount),
                description: oldTransaction.description || "",
                category: oldTransaction.category,
                image: oldTransaction?.image,
                date: new Date(oldTransaction.date),
                walletId: oldTransaction.walletId,
            })
        }
    }, [wallets])





    const onDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || transaction.date;
        setshowDatePicker(Platform.OS === 'ios'); // iOS stays open, Android closes
        setTransaction({ ...transaction, date: currentDate });
    };


    const [showDatePicker, setshowDatePicker] = useState(false);

    const onSubmit = async () => {
        const { type, amount, description, category, date, walletId, image } = transaction;

        let transactionData: TransactionType = {
            type,
            amount,
            description,
            category,
            date,
            walletId,
            image: image ? image : null,
            uid: user?.uid
        };

        setLoading(true);
        const res = await createOrUpdateTransaction(transactionData);


        setLoading(false);
        if (res.success) {
            router.back();
        }
        else {
            Alert.alert("Transaction", res.msg);
        }

    }



    const showDeleteAlert = () => {
        Alert.alert(
            "Confirm",
            "Are you sure?",
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


    const onDelete = async () => {
        if (!oldTransaction?.id) return;
        setLoading(true);
        const res = await deleteTransaction(oldTransaction?.id, oldTransaction.walletId);
        if (res.success) {
            router.back();
        } else {
            Alert.alert("Transaction", "Error deleting transaction!");
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={moderateScale(60)}
                >
                    <View style={{ flex: 1 }}>

                        {/* Header */}
                        <View style={styles.header}>
                            <View style={styles.headerSide}>
                                <BackButton />
                            </View>
                            <View style={styles.headerCenter}>
                                <Text style={styles.title}>{oldTransaction?.id ? "Update Transaction" : "Add Transaction"}</Text>
                            </View>
                        </View>
                        <ScrollView
                            contentContainerStyle={{ flexGrow: 1 }}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                        >
                            {/* Input Section */}

                            {/* Type  */}
                            <View style={{ gap: moderateVerticalScale(8) }}>
                                <Text style={styles.inputLabel}>Type</Text>
                                <Dropdown
                                    style={styles.dropdownContainer}
                                    placeholderStyle={styles.dropdownPlaceholder}
                                    selectedTextStyle={styles.dropdownSelectedText}
                                    iconStyle={styles.dropdownIcon}
                                    containerStyle={styles.dropdownListContainer}
                                    itemTextStyle={{ color: 'white' }}
                                    itemContainerStyle={styles.dropdownItemContainer}
                                    activeColor='#404040'
                                    data={transactionTypes}
                                    maxHeight={250}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select Type"
                                    value={transaction.type}
                                    onChange={(item) => {
                                        setTransaction({ ...transaction, type: item.value })
                                    }}
                                />

                            </View>

                            {/* Wallet */}

                            <View style={{ gap: moderateVerticalScale(8) }}>
                                <Text style={styles.inputLabel}>Wallet Name</Text>
                                <Dropdown
                                    style={styles.dropdownContainer}
                                    placeholderStyle={styles.dropdownPlaceholder}
                                    selectedTextStyle={styles.dropdownSelectedText}
                                    iconStyle={styles.dropdownIcon}
                                    containerStyle={styles.dropdownListContainer}
                                    itemTextStyle={{ color: 'white' }}
                                    itemContainerStyle={styles.dropdownItemContainer}
                                    activeColor='#404040'
                                    data={wallets.map(wallet => ({
                                        label: `${wallet?.name} ($${wallet?.amount})`,
                                        value: wallet?.id,
                                    }))}
                                    maxHeight={250}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select Wallet"
                                    value={transaction.walletId}
                                    onChange={(item) => {
                                        setTransaction({ ...transaction, walletId: item.value || "" })
                                    }}
                                />

                            </View>

                            {/* Expense Category */}

                            <View style={{ gap: moderateVerticalScale(8) }}>
                                <Text style={styles.inputLabel}>Expense Category</Text>
                                <Dropdown
                                    style={styles.dropdownContainer}
                                    placeholderStyle={styles.dropdownPlaceholder}
                                    selectedTextStyle={styles.dropdownSelectedText}
                                    iconStyle={styles.dropdownIcon}
                                    containerStyle={styles.dropdownListContainer}
                                    itemTextStyle={{ color: 'white' }}
                                    itemContainerStyle={styles.dropdownItemContainer}
                                    activeColor='#404040'
                                    data={Object.values(expenseCategories)}
                                    maxHeight={250}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select Category"
                                    value={transaction.category}
                                    onChange={(item) => {
                                        setTransaction({ ...transaction, category: item.value || "" })
                                    }}
                                />
                            </View>




                            {/* Date */}



                            <View style={{ gap: moderateVerticalScale(8) }}>
                                <Text style={styles.inputLabel}>Date</Text>
                            </View>

                            {
                                showDatePicker && (
                                    <View >
                                        <DateTimePicker
                                            maximumDate={new Date()} // For no future dates
                                            themeVariant='dark'
                                            value={transaction.date as Date}
                                            textColor='white'
                                            mode='date'
                                            display='spinner'
                                            onChange={onDateChange}
                                        />

                                        {
                                            Platform.OS == 'ios' && (
                                                <TouchableOpacity
                                                    style={styles.datePickerButton}
                                                    onPress={() => setshowDatePicker(false)}>
                                                    <Text style={{ fontSize: moderateScale(15), fontWeight: '500', color: 'black', textAlign: 'center' }}>Ok</Text>

                                                </TouchableOpacity>
                                            )
                                        }

                                    </View>
                                )

                            }

                            {
                                !showDatePicker && (
                                    <Pressable style={styles.datePicker} onPress={() => { setshowDatePicker(true) }}>
                                        <Text style={{ fontSize: moderateScale(16), color: 'black', textAlign: 'center', fontWeight: '400' }}>{(transaction.date).toLocaleString()}</Text>
                                    </Pressable>
                                )
                            }


                            {/* Amount */}



                            <View style={{ gap: moderateVerticalScale(8) }}>
                                <Text style={styles.inputLabel}>Amount</Text>
                            </View>


                            <TextInput
                                style={[styles.dropdownContainer, { color: 'white' }]}
                                placeholder="Enter Amount"
                                placeholderTextColor="#ccc"
                                keyboardType='number-pad'
                                value={transaction?.amount.toString()}
                                onChangeText={(value) => setTransaction({ ...transaction, amount: Number(value) })}
                            />



                            {/* Description */}



                            <View style={{ gap: moderateVerticalScale(8) }}>
                                <Text style={styles.inputLabel}>Description
                                    <Text style={{ color: Colors.placeHolder, fontSize: moderateScale(12) }}>(Optional)</Text>
                                </Text>
                            </View>


                            <TextInput
                                style={[styles.dropdownContainer, { color: 'white', flexDirection: 'row', alignItems: 'flex-start', paddingVertical: moderateVerticalScale(15) }]}
                                multiline
                                placeholder="Description"
                                placeholderTextColor="#ccc"
                                value={transaction?.description}
                                onChangeText={(value) => setTransaction({ ...transaction, description: value })}
                            />


                            {/* Upload File */}
                            <View style={{ gap: moderateVerticalScale(8) }}>
                                <Text style={styles.inputLabel}>Transaction Receipt
                                    <Text style={{ color: Colors.placeHolder, fontSize: moderateScale(12) }}>(Optional)</Text>
                                </Text>
                                {/* Image Icon Upload */}
                                <ImageUpload
                                    placeholder='Upload Image'
                                    file={transaction.image}
                                    onSelect={(file) => setTransaction({ ...transaction, image: file })}
                                    onClear={() => setTransaction({ ...transaction, image: null })} />
                            </View>


                        </ScrollView>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <View style={styles.divider} />
                            <View style={{ gap: moderateVerticalScale(8,), flexDirection: 'row', justifyContent: 'center' }}>

                                {loading ? (
                                    <ActivityIndicator size="large" color={Colors.placeHolder} />
                                ) : (
                                    <>
                                        {/* Delete Button — if editing an existing transaction */}
                                        {oldTransaction?.id && (
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
                                        )}

                                        {/* Submit / Update Button */}
                                        <PrimaryButton
                                            text={oldTransaction?.id ? "Update" : "Submit"}
                                            btnStyle={{ paddingVertical: moderateVerticalScale(16) }}
                                            btnTextStyle={{ fontSize: moderateScale(16), fontWeight: '700', width: widthPercentageToDP(50) }}
                                            onPress={onSubmit}

                                        />
                                    </>
                                )}
                            </View>
                        </View>

                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView >
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
        marginTop: heightPercentageToDP(2.5)
    },
    dropdownContainer: {
        height: verticalScale(54),
        borderWidth: 1,
        borderColor: '#a4a4a4',
        paddingHorizontal: moderateScale(15),
        borderRadius: moderateScale(12),
        borderCurve: 'continuous',
        zIndex: 10,
    },
    dropdownSelectedText: {
        color: 'white',
        fontSize: verticalScale(14),
    },
    dropdownPlaceholder: {
        fontSize: verticalScale(14),
        color: 'white'
    },
    dropdownIcon: {
        height: verticalScale(13),
        tintColor: '#d4d4d4'
    },
    dropdownListContainer: {
        backgroundColor: '#171717',
        borderRadius: moderateScale(15),
        borderCurve: 'continuous',
        paddingVertical: moderateScale(17),
        top: 8,
        borderColor: "#737373",
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 1,
        shadowRadius: 15,
        elevation: 5
    },
    dropdownItemContainer: {
        borderRadius: moderateScale(15),
        marginHorizontal: moderateScale(7)
    },
    footer: {
        backgroundColor: Colors.background,
        paddingBottom: heightPercentageToDP(2),
    },
    divider: {
        height: 1,
        backgroundColor: '#717171',
        marginBottom: moderateVerticalScale(8),
    },
    datePicker: {

    },
    iosDatePicker: {

    },
    datePickerButton: {
        width: widthPercentageToDP(50),
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'white',
        paddingVertical: moderateScale(8),
        borderRadius: moderateScale(12),
        borderCurve: 'continuous',
        backgroundColor: '#1e1e1e',

    }
})

export default TransactionModal
