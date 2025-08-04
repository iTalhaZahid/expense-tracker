import { WalletType } from '@/types'
import { Router, useRouter } from 'expo-router'
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
import * as Icons from 'phosphor-react-native'
import { Image } from 'expo-image'
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    Easing,
    FadeInDown,
} from 'react-native-reanimated';
const WalletItem = ({
    index,
    item,
    router
}: {
    item: WalletType,
    index: number,
    router: Router;
}) => {

    const openWallet = () => {
        router.push({
            pathname: '/(modals)/addWallet',
            params: {
            id: item?.id,
                name: item?.name,
                    image: item?.image
        }
    });
};

// render
return (
    <Animated.View
        entering={FadeInDown.delay(index * 50).springify().damping(13)}
    >
        <TouchableOpacity style={styles.container} activeOpacity={0.7} onPress={openWallet}>
            <View style={styles.imageContainer}>
                <Image
                    style={{ flex: 1 }}
                    source={item?.image}
                    contentFit='cover'
                    transition={100}
                />
            </View>
            <View style={styles.nameContainer}>
                <Text style={{ fontSize: moderateScale(16), color: 'white' }}>{item?.name}</Text>
                <Text style={{ fontSize: moderateScale(14), color: 'white' }}>${item?.amount}</Text>
            </View>
            <Icons.CaretRightIcon size={verticalScale(20)}
                weight='bold'
                color='white' />
        </TouchableOpacity>
    </Animated.View>
)
}

export default WalletItem
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(17),
    },
    imageContainer: {
        height: verticalScale(45),
        width: verticalScale(45),
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: moderateScale(12),
        borderCurve: 'continuous',
        overflow: 'hidden'
    },
    nameContainer: {
        flex: 1,
        gap: 2,
        marginLeft: scale(20),
    }
})