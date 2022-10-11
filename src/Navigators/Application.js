import React from 'react'
import { SafeAreaView, StatusBar } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StartupContainer, Home, MaterialRequest, MaterialRequestDetail, Profile, StockConsumption, StockDetails, WorkReport, StockList, ConsumptionHistory, Attendance } from '@/Containers'
import FlashMessage from 'react-native-flash-message'
import { useTheme } from '@/Hooks'
import { AppNavigation } from './Main';
import { navigationRef } from './utils'
import { MenuDrawer } from '@/Components';

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator();

// @refresh reset
const ApplicationNavigator = () => {
  const { Layout, darkMode, NavigationTheme } = useTheme()
  const { colors } = NavigationTheme

  return (
    <SafeAreaView style={[Layout.fill, { backgroundColor: colors.card }]}>
      <NavigationContainer theme={NavigationTheme} ref={navigationRef}>
        <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
        <AppNavigation/>
        <FlashMessage floating={true}/>
      </NavigationContainer>
    </SafeAreaView>
  )
}

export default ApplicationNavigator
