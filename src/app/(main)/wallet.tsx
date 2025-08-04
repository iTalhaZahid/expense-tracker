import { useAuth } from '@/contexts/authContext'
import WalletItem from '@/src/components/atoms/walletItem'
import Colors from '@/src/constants/colors'
import useFetchData from '@/src/hooks/useFetchData'
import { WalletType } from '@/types'
import AntDesign from '@expo/vector-icons/AntDesign'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { orderBy, where } from 'firebase/firestore'
import React from 'react'
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { moderateScale } from 'react-native-size-matters'

const Wallet = () => {
    // render
    const { user } = useAuth();
    const getTotalBalance = () =>
        wallets.reduce((total, item) => {
            total = total + (item.amount || 0);
            return total;
        }, 0)

    const { data: wallets, error, loading } = useFetchData<WalletType>("wallets", [
        where("uid", "==", user?.uid),
        orderBy("created", "desc")
    ]);
    const router = useRouter();
    const addWallet = () => router.push('/(modals)/addWallet')
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#000000", }} edges={['top', 'left', 'right']}>
            <StatusBar style='light' />
            <View style={styles.header}>
                <Text style={styles.headerBalance}>${getTotalBalance().toLocaleString()}</Text>
                <Text style={styles.totalBalance}>Total Balance</Text>
            </View>
            <View style={{ flex: 1 }}>
                <View style={styles.main}>
                    <View style={{ flexDirection: 'row', }}>

                        <View style={styles.mainTitle}>
                            <Text style={styles.mainTitleText}>My Wallets</Text>
                            <Pressable onPress={addWallet}>
                                <AntDesign name="pluscircle" size={28} color={Colors.green} />
                            </Pressable>
                        </View>
                    </View>

                    {loading ? (
                        <ActivityIndicator size={'large'} color={Colors.green} />
                    ) : (
                        <FlatList
                            data={wallets}
                            keyExtractor={(item) => item.id} // Required for list rendering
                            renderItem={({ item, index }) => (
                                <WalletItem item={item} index={index} router={router} /> // 
                            )}
                            ListEmptyComponent={
                                <View style={{ alignItems: 'center', marginTop: 40 }}>
                                    <AntDesign name="wallet" size={40} color="#666" />
                                    <Text style={{ color: 'white', fontSize: 16, marginTop: 10 }}>
                                        No wallets found.
                                    </Text>
                                </View>
                            }
                            contentContainerStyle={styles.listStyle}
                        />
                    )}
                </View>
            </View>

        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    header: {
        padding: moderateScale(24),
    },

    headerBalance: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: moderateScale(46)
    },
    totalBalance: {
        color: Colors.placeHolder,
        textAlign: 'center',
        fontSize: moderateScale(20),
        fontWeight: '400'
    }, main: {
        flex: 1,
        backgroundColor: '#1e1e1e',
        borderTopLeftRadius: moderateScale(28),
        borderTopRightRadius: moderateScale(28),
        padding: moderateScale(20),
    },
    mainTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
    },
    mainTitleText: {
        color: 'white',
        fontSize: moderateScale(20),
        fontWeight: '700',
    },
    listStyle: {
        marginTop: moderateScale(10),
    }
},
)
export default Wallet
