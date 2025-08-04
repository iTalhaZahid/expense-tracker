import { useAuth } from '@/contexts/authContext'
import HomeCard from '@/src/components/molecules/homeCard'
import RecentTransactions from '@/src/components/molecules/recentTransactions'
import Colors from '@/src/constants/colors'
import useFetchData from '@/src/hooks/useFetchData'
import { TransactionType } from '@/types'
import Feather from '@expo/vector-icons/Feather'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { limit, orderBy, where } from 'firebase/firestore'
import * as Icons from "phosphor-react-native"; // Import all icons dynamically
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { widthPercentageToDP } from 'react-native-responsive-screen'
import { SafeAreaView } from 'react-native-safe-area-context'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'

const Index = () => {
    const router=useRouter();
    const modal = () => {router.push('/(modals)/transactionModal')}
    const {user}=useAuth();
    const constraints=[
        where ("uid",'==', user?.uid),
        orderBy("date",'desc'),
        limit(30)
    ];
    const search =() => router.push('/(modals)/searchModal')
     const {
            data: recentTransactions,
            error,
            loading: transactionLoding,
        } = useFetchData<TransactionType>("transactions", constraints);
    // render
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background, }} edges={['top','left','right']}>
            <StatusBar style='light' />
            <View style={styles.container}>

                <View style={styles.header}>
                    <View style={{ gap: verticalScale(4) }}>
                        <Text style={{ fontSize: moderateScale(16), color: "#A3A3A3" }}>Hello,</Text>
                        <Text style={{ fontSize: moderateScale(20), color: "white", fontWeight: '500',}}>{user?.name}</Text>
                    </View>
                    <TouchableOpacity style={styles.searchIcon} onPress={search}>
                        <Feather name="search" size={scale(22)} color="#E5E5E5" />
                    </TouchableOpacity>
                </View>
                <HomeCard />
                <RecentTransactions data={recentTransactions} loading={transactionLoding} title='Recent Transactions'
                emptyListMessage='No Transaction added yet!' />
                <TouchableOpacity style={styles.floatingButton} activeOpacity={0.7} onPress={modal}>
                    <Icons.Plus color='black'  weight='bold' size={verticalScale(24)}/>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: widthPercentageToDP(3),
        marginTop: verticalScale(16),
        gap: verticalScale(6),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    searchIcon: {
        borderRadius: moderateScale(50),
        backgroundColor: '#6b7280',
        padding: moderateScale(6),
    },
     floatingButton:{
        height:verticalScale(40),
        width:verticalScale(40),
        borderRadius:moderateScale(100),
        position:'absolute',
        bottom:verticalScale(8),
        right:verticalScale(14),
        backgroundColor:Colors.green,
        justifyContent:'center',
        alignItems:'center',
        opacity:0.5,
    },
})
export default Index
