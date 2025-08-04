import Colors from '@/src/constants/colors'
import imagePath from '@/src/constants/imagePath'
import React from 'react'
import { View ,Image} from 'react-native'

const Index = () => {
  // render
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background,justifyContent:'center',alignItems:'center'}}>
      <Image 
      resizeMode='contain'
      source={imagePath.SplashScreen} style={{height:'20%',aspectRatio:1}}  />
    </View>
  )
}

export default Index;
