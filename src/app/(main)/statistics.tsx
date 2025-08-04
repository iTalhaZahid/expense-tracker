import Colors from '@/src/constants/colors'
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { moderateScale, moderateVerticalScale, scale, verticalScale } from 'react-native-size-matters'
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { BarChart } from "react-native-gifted-charts";
import { heightPercentageToDP } from 'react-native-responsive-screen'
import { useAuth } from '@/contexts/authContext'
import { fetchMonthlyStats, fetchWeeklyStats, fetchYearlyStats } from '@/services/transactionService'
import RecentTransactions from '@/src/components/molecules/recentTransactions'


const Statistics = () => {
    const [activeIndex, setactiveIndex] = useState(0);
    const [chartData, setChartData] = useState([]);
    const [chartLoading, setchartLoading] = useState(false)
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);

    const getWeeklyStats = async () => {
        setchartLoading(true);
        let res = await fetchWeeklyStats(user?.uid as string);
        setchartLoading(false);
        if (res.success) {
            setChartData(res?.data?.stats);
            setTransactions(res?.data?.transactions)
        }
        else {
            Alert.alert("Chart", res.msg)
        }
    };
    const getMonthlyStats = async () => {
        setchartLoading(true);
        let res = await fetchMonthlyStats(user?.uid as string);
        setchartLoading(false);
        if (res.success) {
            setChartData(res?.data?.stats);
            setTransactions(res?.data?.transactions)
        }
        else {
            Alert.alert("Chart", res.msg)
        }


    };
    const getYearlyStats = async () => {

        setchartLoading(true);
        let res = await fetchYearlyStats(user?.uid as string);
        setchartLoading(false);
        if (res.success) {
            setChartData(res?.data?.stats);
            setTransactions(res?.data?.transactions)
        }
        else {
            Alert.alert("Chart", res.msg)
        }

    };

    useEffect(() => {
        if (activeIndex == 0) {
            getWeeklyStats();
        }
        if (activeIndex == 1) {
            getMonthlyStats();
        }
        if (activeIndex == 2) {
            getYearlyStats();
        }
    }, [activeIndex])
    // render
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
            <View style={styles.container}>
                <View >
                    <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: moderateScale(32) }}>Statistics</Text>
                    <ScrollView
                        horizontal={false}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            gap: moderateScale(20),
                            paddingTop: verticalScale(5),
                            paddingBottom: verticalScale(100),
                        }}
                        showsVerticalScrollIndicator={false}
                    >
                        <SegmentedControl
                            values={['Weekly', 'Monthly', 'Yearly']}
                            selectedIndex={activeIndex}
                            onChange={(event) => {
                                setactiveIndex(event.nativeEvent.selectedSegmentIndex);
                            }}
                            tintColor='#898989'
                            backgroundColor='#171A1C'
                            appearance='dark'
                            activeFontStyle={styles.segmentFontStyle}
                            style={styles.segmentStyle}
                            fontStyle={{ ...styles.segmentFontStyle, color: 'white' }}
                        />
                        <View style={styles.chartContainer}>
                            {
                                chartData.length > 0 ? (
                                    <BarChart
                                        data={chartData}
                                        barWidth={scale(12)}
                                        spacing={[1, 2].includes(activeIndex) ? scale(25) : scale(16)}
                                        roundedTop
                                        roundedBottom
                                        hideRules
                                        yAxisLabelPrefix='$'
                                        yAxisLabelWidth={[1, 2].includes(activeIndex) ? scale(35) : scale(38)}
                                        yAxisThickness={1}
                                        xAxisThickness={1}
                                        yAxisColor={'white'}
                                        xAxisColor={'white'}
                                        yAxisTextStyle={{ color: 'white' }}
                                        xAxisLabelTextStyle={{ color: 'white', fontSize: verticalScale(10) }}
                                        noOfSections={3}
                                        minHeight={5}
                                    />

                                ) : (
                                    <View style={styles.noChart}></View>
                                )
                            }
                            {
                                chartLoading && (
                                    <View style={styles.chartLoadingContainer}>
                                        <ActivityIndicator color={Colors.green} size={'large'} />
                                    </View>
                                )
                            }
                        </View>


                        {/* Transactions */}
                        <View>
                            <RecentTransactions
                                title='Transactions'
                                emptyListMessage='No Transactions Found'
                                data={transactions}
                            />
                        </View>
                    </ScrollView>
                </View>
            </View >
        </SafeAreaView >
    )
}

export default Statistics
const styles = StyleSheet.create({
    chartContainer: {
        // width:'100%',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    chartLoadingContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: moderateScale(12),
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',

    },
    noChart: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        height: verticalScale(210),
    },
    segmentStyle: {
        height: verticalScale(36),
    },
    segmentFontStyle: {
        fontSize: moderateScale(14),
        fontWeight: 'bold',
        color: 'black'
    },
    container: {
        paddingHorizontal: moderateScale(20),
        paddingVertical: heightPercentageToDP(2),
        gap: moderateVerticalScale(10),
    },
})
