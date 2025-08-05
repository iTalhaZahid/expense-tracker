import { getWalletImage } from '@/services/imgServices';
import { ImageUploadProps } from '@/types';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as Icons from 'phosphor-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
const ImageUpload = ({

    file = null,
    onSelect,
    onClear,
    containerStyle,
    imageStyle,
    placeholder = "",
}: ImageUploadProps
) => {
    // render

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });

        if (!result.canceled) {
            onSelect(result.assets[0]);

        }
    }
    return (
        <View>
            {!file && (
                <TouchableOpacity style={[styles.inputContainer, containerStyle && containerStyle]} 
                onPress={pickImage}
                >
                    <Icons.UploadSimpleIcon color='white' />
                    {placeholder && <Text style={{ fontSize: moderateScale(18),color:'white' }}>{placeholder}</Text>}
                </TouchableOpacity>
            )}
            {
                file && (
                    <View style={[styles.image, imageStyle && imageStyle]}>
                        <Image
                            style={{ flex: 1 }}
                            source={getWalletImage(file)}
                            contentFit='cover'
                            transition={100} />
                        <TouchableOpacity style={styles.deleteIcon}
                        onPress={onClear}>
                            <Icons.XCircleIcon size={verticalScale(24)}
                                weight='fill'
                                color='white' />
                        </TouchableOpacity>
                    </View>

                )
            }
        </View>
    )
}

export default ImageUpload
const styles = StyleSheet.create({
    inputContainer: {
        height: verticalScale(54),
        backgroundColor: "#404040",
        borderRadius: moderateScale(15),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: moderateScale(10),
        borderWidth: 1,
        borderColor: 'white',
        borderStyle: 'dashed',
    },
    image: {
        height: heightPercentageToDP(12),
        width: widthPercentageToDP(24),
        borderRadius: 15,
        overflow: 'hidden',
        borderCurve: 'continuous'
    },
    deleteIcon: {
        position:'absolute',
        top:scale(6),
        right:scale(6),
        shadowColor:'black',
        shadowOffset:{width:0,height:5},
        shadowOpacity:1,
        shadowRadius:10
    }
})