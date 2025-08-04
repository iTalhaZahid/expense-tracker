import { auth } from '@/config/firebase'
import { useAuth } from '@/contexts/authContext'
import { getProfileImage } from '@/services/imgServices'
import SecondaryButton from '@/src/components/atoms/secondarybtn'
import Colors from '@/src/constants/colors'
import AntDesign from '@expo/vector-icons/AntDesign'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { signOut } from 'firebase/auth'
import React from 'react'
import { Alert, StyleSheet, Text, View, } from 'react-native'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import { SafeAreaView } from 'react-native-safe-area-context'
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters'

const Profile = () => {
    const router = useRouter();
    const editProfile = () => router.push('/(modals)/profileModal')
    //user Details
    const {user}=useAuth();
    // render
    const rightIcon = () => { return (<AntDesign name="right" size={22} color="grey" />) };
    const handleLogout = () => {
        // Show confirmation alert
        Alert.alert(
            "Confirm Logout",
            "Are you sure you want to log out?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Log Out",
                    onPress: async () => {
                        try {
                            await signOut(auth); 
                            // console.log("User logged out");
                        } catch (error) {
                            // console.log("Error during logout:", error.message);
                        }
                    },
                    style: "destructive",
                },
            ],
            { cancelable: false } 
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
            <StatusBar style='light' />
            <View style={{ gap: moderateVerticalScale(12) }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: moderateScale(24) }}>Profile</Text>
                <Image source={getProfileImage(user?.image)} style={styles.img} contentFit='cover'/>
                <Text style={{ textAlign: 'center', color: 'white', fontSize: moderateScale(22), fontWeight: 'bold', }}>{user?.name}</Text>
                <Text style={{ textAlign: 'center', color: '#8C8C8C', fontSize: moderateScale(14), fontWeight: '600', }}>{user?.email}</Text>
            </View>
            <View style={{ gap: moderateVerticalScale(4), marginTop: heightPercentageToDP(2) }}>
                <SecondaryButton text='Edit Profile'
                    containerStyle={styles.btnStyles}
                    rightIcon={rightIcon()}
                    lefticon={<Ionicons name="person" size={24} color="white" />}
                    leftIconContainer={[styles.leftIconContainer, { backgroundColor: 'purple' }]}
                    textStyle={{ flex: 1 }} onPress={editProfile} />
                <SecondaryButton text='Settings'
                    containerStyle={styles.btnStyles}
                    rightIcon={rightIcon()}
                    lefticon={<SimpleLineIcons name="settings" size={24} color="white" />}
                    leftIconContainer={[styles.leftIconContainer, { backgroundColor: 'green' }]}
                    textStyle={{ flex: 1 }}
                />
                <SecondaryButton
                    text='Privacy Policy'
                    containerStyle={styles.btnStyles}
                    rightIcon={rightIcon()}
                    lefticon={<MaterialIcons name="lock" size={24} color="white" />}
                    leftIconContainer={[styles.leftIconContainer, { backgroundColor: 'grey' }]}
                    textStyle={{ flex: 1 }}

                />
                <SecondaryButton
                    text='Logout'
                    containerStyle={styles.btnStyles}
                    rightIcon={rightIcon()}
                    lefticon={<FontAwesome name="power-off" size={24} color="white" />}
                    leftIconContainer={[styles.leftIconContainer, { backgroundColor: 'red' }]}
                    textStyle={{ flex: 1 }}
                    onPress={handleLogout}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    btnStyles: {
        backgroundColor: 'transparent',
        width: widthPercentageToDP(94),
    },
    leftIconContainer: {
        width: widthPercentageToDP(11),
        padding: moderateScale(8),
        borderRadius: moderateScale(12),
        justifyContent: 'center',
        alignItems: 'center'
    },
    img:{
        alignSelf:'center',
        height:moderateScale(135),
        width:moderateScale(135),
        borderRadius:200,
        borderWidth:1,
        borderColor:'#737373'
    }
})
export default Profile

