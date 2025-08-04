import Colors from '@/src/constants/colors';
import { expenseCategories, incomeCategory } from '@/src/constants/data';
import { RecentTransactionType, TransactionItemProps, TransactionType } from '@/types';
import { FlashList } from "@shopify/flash-list";
import { router } from 'expo-router';
import { Timestamp } from 'firebase/firestore';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { moderateScale, verticalScale } from 'react-native-size-matters';



const RecentTransactions = ({
    data,
    title,
    loading,
    emptyListMessage,
}: RecentTransactionType) => {
    const handleClick = (item: TransactionType) => {
        router.push({
            pathname:'/(modals)/transactionModal',
            params:{
                id:item?.id,
                type:item?.type,
                description:item?.description,
                amount: item?.amount.toString(),
                category: item?.category,
                date: (item.date as Timestamp)?.toDate()?.toISOString(),
                image: item?.image,
                uid: item?.uid,
                walletId: item?.walletId,
            }
        })
        // console.log("Pushing transaction:", item);
        
    };
    const TransactionItem = ({ item, index, handleClick }: TransactionItemProps
    ) => {
        let category = item?.type == 'income' ? incomeCategory : expenseCategories[item.category!];
        const IconComponent = category.icon;
        const date = (item?.date as Timestamp)?.toDate()?.toLocaleDateString("en-GB", { day: 'numeric', month: 'short' })
        return (
            <Animated.View
                entering={FadeInDown.delay(index * 70).springify().damping(14)}>
            
                <TouchableOpacity style={styles.row} onPress={() => { handleClick(item) }}>
                    <View style={[styles.icon, { backgroundColor: category.bgColor }]}>
                        {IconComponent &&
                            (<IconComponent
                                size={verticalScale(25)}
                                weight='fill'
                                color='white'
                            />
                            )

                        }

                    </View>
                    <View style={styles.categoryDes}>
                        <Text style={{ fontSize: moderateScale(17) }}>{category.label}</Text>
                        <Text style={{ fontSize: moderateScale(12), color: '#A3A3A3', }} >{item.description}</Text>
                    </View>
                    <View style={styles.amountDate}>
                        <Text style={{ fontWeight: '500', color: item?.type === 'income' ? Colors.green : 'red' }}>

                            {
                                `${item?.type == 'income' ? "+" : "-"} $${item?.amount}`
                            }

                        </Text>
                        <Text style={{ fontWeight: '300', color: '#A3A3A3' }}>{date}</Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>)
    }
    // render
    return (
        <View style={styles.container}>
            {title && (
                <Text style={styles.title}>{title}</Text>
            )}

            {loading ? (
                <ActivityIndicator color={Colors.green} size='large' style={{ marginTop: moderateScale(15) }} />
            ) : data.length === 0 ? (
                <Text
                    style={{
                        fontSize: moderateScale(15),
                        textAlign: 'center',
                        marginTop: moderateScale(15),
                        color: '#A3A3A3',
                    }}
                >
                    {emptyListMessage}
                </Text>
            ) : (
                <View style={styles.list}>
                    <FlashList
                    showsVerticalScrollIndicator={false}
                   
                        data={data}
                        renderItem={({ item, index }) => (
                            <TransactionItem
                                item={item}
                                index={index}
                                handleClick={handleClick}
                            />
                        )}
                        estimatedItemSize={60}
                    />
                </View>
            )}




        </View>
    )
}


const styles = StyleSheet.create({
    title: {
        color: "white",
        fontSize: moderateScale(20),
        fontWeight: '500',
    },
    container: {
        gap: moderateScale(17),
        flex: 1,
        // backgroundColor:'red'
    },
    list: {
        flex: 1,
        // minHeight: verticalScale(320),
    },
    row: {
        gap: moderateScale(12),
        marginBottom: moderateScale(12),
        backgroundColor: '#616161',
        borderRadius: moderateScale(14),
        padding: moderateScale(10),
        paddingHorizontal: moderateScale(10),
        flexDirection: 'row',
    },
    icon: {
        height: verticalScale(44),
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: moderateScale(12),
        borderCurve: 'continuous',
    },
    categoryDes: {
        flex: 1,
        gap: moderateScale(2.5),
    },
    amountDate: {
        alignItems: 'flex-end',
        gap: moderateScale(3),
    },


})
export default RecentTransactions
