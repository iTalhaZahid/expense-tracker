import imagePath from '@/src/constants/imagePath'
import React from 'react'
import { View, Text, ImageBackground, StyleSheet } from 'react-native'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useAuth } from '@/contexts/authContext'
import useFetchData from '@/src/hooks/useFetchData'
import { WalletType } from '@/types'
import { orderBy, where } from 'firebase/firestore'

const HomeCard = () => {
    // render

    const { user } = useAuth();
    const {
        data: wallets,
        error,
        loading: walletloading,
    } = useFetchData<WalletType>("wallets", [
        where("uid", "==", user?.uid),
        orderBy("created", "desc"),
    ]);


    const getTotals = () => {
        return wallets.reduce((totals: any, item: WalletType) => {
            totals.balance += Number(item.amount);
            totals.income += Number(item.totalIncome);
            totals.expense += Number(item.totalExpenses); 
            return totals;
        }, { balance: 0, income: 0, expense: 0 });
    }

    return (
        <ImageBackground
            source={imagePath.HomeCard}
            resizeMode='stretch'
            style={styles.bgImg}
        >
            <View style={styles.container}>
                <View>

                    {/* Total Balance */}
                    <View style={styles.totalBalanceRow}>
                        <Text style={{ fontSize: moderateScale(17), fontWeight: '500' }}>Total Balance</Text>
                        <Entypo name="dots-three-horizontal" size={verticalScale(23)} color="black" />
                    </View>
                    <Text style={{ fontWeight: 'bold', fontSize: moderateScale(30) }}>${walletloading ? "-----" : getTotals()?.balance}</Text>
                </View>
                {/* total expenses and Income */}
                <View style={styles.stats}>
                    {/* income */}
                    <View style={{ gap: verticalScale(5) }} >
                        <View style={styles.incomeExpense}>
                            <View style={styles.statsIcon}>
                                <AntDesign name="arrowdown" size={verticalScale(15)} color="black" />
                            </View>
                            <Text style={{ fontSize: moderateScale(16), fontWeight: '500' }}>Income</Text>
                        </View>
                        <View style={{ alignSelf: 'center' }}>
                            <Text style={{ fontSize: moderateScale(17), color: 'green', fontWeight: '600' }}>${walletloading ? "---" : getTotals()?.income}</Text>
                        </View>
                    </View>
                    {/* expenses */}
                    <View style={{ gap: verticalScale(5) }} >
                        <View style={styles.incomeExpense}>
                            <View style={styles.statsIcon}>
                                <AntDesign name="arrowup" size={verticalScale(15)} color="black" />
                            </View>
                            <Text style={{ fontSize: moderateScale(16), fontWeight: '500' }}>Expenses</Text>
                        </View>
                        <View style={{ alignSelf: 'center' }}>
                            <Text style={{ fontSize: moderateScale(17), color: 'red', fontWeight: '600' }}>${walletloading ? "---" : getTotals()?.expense}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </ImageBackground>
    )
}
const styles = StyleSheet.create({
    bgImg: {
        height: scale(210),
        width: "100%",
    },
    container: {
        padding: widthPercentageToDP(4),
        paddingHorizontal: scale(23),
        height: "87%",
        width: "100%",
        justifyContent: 'space-between',
    },
    totalBalanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    incomeExpense: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: heightPercentageToDP(0.7),
    },
    statsIcon: {
        borderRadius: moderateScale(50),
        backgroundColor: '#d1d5db',
        padding: heightPercentageToDP(0.5),
    },
})

export default HomeCard
