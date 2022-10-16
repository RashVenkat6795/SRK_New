import React, { useEffect } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import FontAwesome from 'react-native-vector-icons/FontAwesome5'
import Feather from 'react-native-vector-icons/Feather'
import { useDispatch, useSelector } from 'react-redux'
import { Touchable, TouchableOpacity, View } from 'react-native'
import { useTheme } from '@/Hooks'
import { 
  Login, ForgotPassword,
  Home, MaterialRequest, MaterialRequestDetail, Profile, StockConsumption, WorkReport,  ConsumptionHistory, Attendance,
  Stock, StockList, StockDetails, StockTransfer, MaterialRequestStatus, DailyReport, MonthlyReport, Notification, NotificationDetail, SendMaterial, ReceiveMaterial, AttendanceMain, LabourAttendance
} from '@/Containers'
import { SvgIcons } from '@/Components'
import { navigate } from './utils'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()

export const AppNavigation = (props) => {
  const { Common, Fonts, Gutters, Layout, Colors, Images, MessageTypes } = useTheme()
  const dispatch = useDispatch()

  /* Props state */
  const isLoggedIn = useSelector(state => state.user.isLoggedIn)
  const accessToken = useSelector(state => state.user.accessToken)

  useEffect(() => {
  },[])



  const AuthStack = () => {
    return(
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={'Login'} component={Login}/>
        <Stack.Screen name={'ForgotPassword'} component={ForgotPassword}/>
      </Stack.Navigator>
    )
  }

  const HeaderRightBtn = () => (
    <TouchableOpacity onPress={() => navigate('Notification')} style={{ padding: 10, marginRight: 10 }}>
      <FontAwesome name={'bell'} color={Colors.primary} size={22} solid/>
    </TouchableOpacity>
  )

  const TabStack = () => {
    return(
      <Tab.Navigator
        screenOptions={({ navigation, route }) => ({ 
          tabBarIcon: ({ focused, color, size }) => {
            if(route.name == 'Dashboard'){
              return <SvgIcons name={'dashboard'} color={color}/>
            } else if(route.name == 'Stocks'){
              return <SvgIcons name={'stock'} color={color}/>
            } else if(route.name == 'Attendance'){
              return <SvgIcons name={'attendance'} color={color}/>
            } else if(route.name == 'Work Report'){
              return <SvgIcons name={'report'} color={color}/>
            } else if(route.name == 'Profile'){
              return <SvgIcons name={'profile'} color={color}/>
            }
          },
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.grey,
          headerShown: true,
          tabBarHideOnKeyboard: true
        })}
        initialRouteName={'Dashboard'}
      >
        <Tab.Screen name={'Dashboard'} component={Home} options={{ headerRight: () => <HeaderRightBtn/>, headerTintColor: Colors.primary }}/>
        <Tab.Screen name={'Stocks'} component={Stock} options={{ headerRight: () => <HeaderRightBtn/>, headerTintColor: Colors.primary }}/>
        <Tab.Screen name={'Attendance'} component={AttendanceMain} options={{ headerRight: () => <HeaderRightBtn/>, headerTintColor: Colors.primary }}/>
        <Tab.Screen name={'Work Report'} component={WorkReport} options={{ headerRight: () => <HeaderRightBtn/>, headerTintColor: Colors.primary }}/>
        <Tab.Screen name={'Profile'} component={Profile} options={{ headerRight: () => <HeaderRightBtn/>, headerTintColor: Colors.primary }}/>
      </Tab.Navigator>
    )
  }

  const LoggedInStack = () => {
    return(
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        <Stack.Screen name={'Main'} component={TabStack} options={{ headerShown: false }}/>
        <Stack.Screen name={'MaterialRequest'} component={MaterialRequest} options={{ headerRight: () => <HeaderRightBtn/>, headerBackTitle: ' ', headerTintColor: Colors.primary }}/>
        <Stack.Screen name={'MaterialRequestDetail'} component={MaterialRequestDetail} options={{ headerRight: () => <HeaderRightBtn/>, headerBackTitle: ' ', headerTintColor: Colors.primary }}/>
        <Stack.Screen name={'Profile'} component={Profile} options={{ headerRight: () => <HeaderRightBtn/>, headerBackTitle: ' ', headerTintColor: Colors.primary }}/>
        <Stack.Screen name={'StockList'} component={StockList} options={{ headerRight: () => <HeaderRightBtn/>, headerBackTitle: ' ', headerTintColor: Colors.primary }}/>
        <Stack.Screen name={'StockConsumption'} component={StockConsumption} options={{ headerRight: () => <HeaderRightBtn/>, headerBackTitle: ' ', headerTintColor: Colors.primary }}/>
        <Stack.Screen name={'StockDetails'} component={StockDetails} options={{ headerRight: () => <HeaderRightBtn/>, headerBackTitle: ' ', headerTintColor: Colors.primary }}/>
        <Stack.Screen name={'ConsumptionHistory'} component={ConsumptionHistory} options={{ headerRight: () => <HeaderRightBtn/>, headerBackTitle: ' ' }}/>
        <Stack.Screen name={'StockTransfer'} component={StockTransfer} options={{ headerRight: () => <HeaderRightBtn/>, headerBackTitle: ' ', headerTintColor: Colors.primary }}/>
        <Stack.Screen name={'MaterialRequestStatus'} component={MaterialRequestStatus} options={{ headerRight: () => <HeaderRightBtn/>, headerBackTitle: ' ', headerTintColor: Colors.primary }}/>
        <Stack.Screen name={'MonthlyReport'} component={MonthlyReport} options={{ headerRight: () => <HeaderRightBtn/>, headerBackTitle: ' ', headerTintColor: Colors.primary }}/>
        <Stack.Screen name={'DailyReport'} component={DailyReport} options={{ headerRight: () => <HeaderRightBtn/>, headerBackTitle: ' ', headerTintColor: Colors.primary }}/>
        <Stack.Screen name={'Notification'} component={Notification} options={{ headerRight: () => <HeaderRightBtn/>, headerBackTitle: ' ', headerTintColor: Colors.primary }}/>
        <Stack.Screen name={'NotificationDetail'} component={NotificationDetail} options={{ headerRight: () => <HeaderRightBtn/>, headerBackTitle: ' ', headerTintColor: Colors.primary }}/>
        <Stack.Screen name={'Attendance'} component={Attendance} options={{ headerRight: () => <HeaderRightBtn/>, headerBackTitle: ' ', headerTintColor: Colors.primary }}/>
        <Stack.Screen name={'LabourAttendance'} component={LabourAttendance} options={{ headerRight: () => <HeaderRightBtn/>,headerBackTitle: ' ', headerTintColor: Colors.primary }}/>
        <Stack.Screen name={'SendMaterial'} component={SendMaterial} options={{ headerRight: () => <HeaderRightBtn/>, headerBackTitle: ' ', headerTintColor: Colors.primary }}/>
        <Stack.Screen name={'ReceiveMaterial'} component={ReceiveMaterial} options={{ headerRight: () => <HeaderRightBtn/>, headerBackTitle: ' ', headerTintColor: Colors.primary }}/>
      </Stack.Navigator>

    )
  }

  return(
    <View style={[Layout.fill]}>
      {isLoggedIn ? <LoggedInStack/> : <AuthStack/>}
    </View>
  )
}
/* const MainNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={ExampleContainer}
        options={{
          tabBarIconStyle: { display: 'none' },
          tabBarLabelPosition: 'beside-icon',
        }}
      />
    </Tab.Navigator>
  )
}

export default MainNavigator */
