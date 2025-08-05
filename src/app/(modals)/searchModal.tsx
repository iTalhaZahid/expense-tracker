import { useAuth } from '@/contexts/authContext'
import BackButton from '@/src/components/atoms/backButton'
import RecentTransactions from '@/src/components/molecules/recentTransactions'
import Colors from '@/src/constants/colors'
import useFetchData from '@/src/hooks/useFetchData'
import { TransactionType } from '@/types'
import { orderBy, where } from 'firebase/firestore'
import React, { useState } from 'react'
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import { SafeAreaView } from 'react-native-safe-area-context'
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters'

const SearchModal = () => {
    const { user } = useAuth();

    const constraints = [
        where("uid", '==', user?.uid),
        orderBy("date", 'desc'),
    ];

    const {
        data: allTransactions,
        error,
        loading: transactionLoding,
    } = useFetchData<TransactionType>("transactions", constraints);

    const [search, setSearch] = useState('');

    const filteredTransactions = allTransactions.filter((item) => {
        if (search.length > 1) {
            if
                (
                item?.category?.toLowerCase()?.includes(search?.toLowerCase()) ||
                item?.type?.toLowerCase()?.includes(search?.toLowerCase()) ||
                item?.description?.toLowerCase()?.includes(search?.toLowerCase())
            ) {
                return true;
            }
            return false;
        }
        return true;
    })

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
                            <Text style={styles.title}>Search</Text>
                        </View>
                    </View>
                    {/* Input */}
                    <View style={{ gap: moderateVerticalScale(8),marginBottom:moderateVerticalScale(8) }}>
                        <Text style={styles.inputLabel}>Wallet Name</Text>
                        <TextInput style={styles.inputContainer} placeholder='e.g., Salary' placeholderTextColor={Colors.placeHolder}
                            value={search}
                            onChangeText={(value) =>
                                setSearch(value)}

                        />
                    </View>
                    {/* Transaction Search */}
                    <RecentTransactions
                        loading={transactionLoding}
                        data={filteredTransactions}
                        emptyListMessage='No Transaction Found' />

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

export default SearchModal
