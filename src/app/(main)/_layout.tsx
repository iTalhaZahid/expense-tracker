import { Tabs } from 'expo-router'
import React from 'react'
import CustomTabs from '@/src/components/atoms/customTabs';
const RootLayout = () => {
  // render
  return (
    <Tabs tabBar={props => <CustomTabs {...props} />}  screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name='statistics'/>
      <Tabs.Screen name='wallet' />
      <Tabs.Screen name='profile' />
    </Tabs>
  )
}

export default RootLayout
