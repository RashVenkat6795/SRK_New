import React, { useEffect } from 'react'
import { ActivityIndicator, View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import { useDispatch, useSelector } from 'react-redux'
import FontAwesome from 'react-native-vector-icons/FontAwesome5'
import Feather from 'react-native-vector-icons/Feather'
import { useTheme } from '@/Hooks'
import { Drawer, List } from 'react-native-paper'

const MenuDrawer = (props) => {
  const { state, navigation } = props
  const { Colors, Layout, Fonts, Gutters } = useTheme()
  const dispatch = useDispatch()

  return(
    <DrawerContentScrollView {...props}>
      {/* Profile section */}
      <View style={[Layout.row, Gutters.regularHPadding, { alignItems:'center', marginBottom: 20 }]}>
        <FontAwesome name={'user-circle'} color={Colors.primary} size={60} solid style={{ alignSelf:'center' }}/>
        <View style={[Layout.fill, { marginLeft: 7 }]}>
          <Text style={[Fonts.titleTiny, { fontWeight:'bold', color: Colors.text }]}>{'profile?.name'}</Text>
          <Text style={[Fonts.textSmall,{ fontSize: 14 }]}>{'profile?.email_id'}</Text>
        </View>
      </View>

      <Drawer.Section>
        <DrawerItem
          label={'Home'} 
          icon={({color, size}) => ( <FontAwesome name={'home'} color={Colors.primary} size={16}/> )}
          onPress={() => props.navigation.navigate('Home')}
          labelStyle={[Fonts.titleTiny, { marginLeft: -15, color: 'grey' }]}
          activeTintColor={Colors.secondary}
          inactiveTintColor={'grey'}
        />
        
        <List.Section>
          <List.Accordion 
            title={'Stock Details'}
            left={props => <FontAwesome name={'book'} color={Colors.primary} size={16} solid/>}
            style={[Gutters.regularLPadding, { backgroundColor: Colors.white }]}
            titleStyle={[Fonts.titleTiny,{ marginLeft: 15, color: 'grey' }]}
          >
            <DrawerItem
              label={'Stock List'}
              icon={({color, size}) => (
                <FontAwesome name={'list-alt'} color={Colors.primary} size={16} solid/>
              )}
              onPress={() => props.navigation.navigate('StockList')}
              labelStyle={[Fonts.titleTiny,{ marginLeft: -15, color: 'grey' }]}
              activeTintColor={Colors.secondary}
              inactiveTintColor={'grey'}
              style={{ paddingLeft: 0, marginLeft: 25 }}
            />

            <DrawerItem
              label={'Material Request'}
              icon={({color, size}) => (
                <Feather name={'file-plus'} color={Colors.primary} size={16}/>
              )}
              onPress={() => props.navigation.navigate('MaterialRequest')}
              labelStyle={[Fonts.titleTiny,{ marginLeft: -15, color: 'grey' }]}
              activeTintColor={Colors.secondary}
              inactiveTintColor={'grey'}
              style={{ paddingLeft: 0, marginLeft: 25 }}
            />

            <DrawerItem
              label={'Stock Consumption'}
              icon={({color, size}) => (
                <FontAwesome name={'list-alt'} color={Colors.primary} size={16}/>
              )}
              onPress={() => props.navigation.navigate('StockConsumption')}
              labelStyle={[Fonts.titleTiny,{ marginLeft: -15, color: 'grey' }]}
              activeTintColor={Colors.secondary}
              inactiveTintColor={'grey'}
              style={{ paddingLeft: 0, marginLeft: 25 }}
            />

            <DrawerItem
              label={'Consumption History'}
              icon={({color, size}) => (
                <FontAwesome name={'calendar-alt'} color={Colors.primary} size={16}/>
              )}
              onPress={() => props.navigation.navigate('ConsumptionHistory')}
              labelStyle={[Fonts.titleTiny,{ marginLeft: -15, color: 'grey' }]}
              activeTintColor={Colors.secondary}
              inactiveTintColor={'grey'}
              style={{ paddingLeft: 0, marginLeft: 25 }}
            />
          </List.Accordion>
        </List.Section>

        <DrawerItem
          label={'Attendance'} 
          icon={({color, size}) => ( <FontAwesome name={'users'} color={Colors.primary} size={16} solid/> )}
          onPress={() => props.navigation.navigate('Attendance')}
          labelStyle={[Fonts.titleTiny, { marginLeft: -15, color: 'grey' }]}
          activeTintColor={Colors.secondary}
          inactiveTintColor={'grey'}
        />

        <DrawerItem
          label={'Work Report'} 
          icon={({color, size}) => ( <FontAwesome name={'star'} color={Colors.primary} size={16} solid/> )}
          onPress={() => props.navigation.navigate('WorkReport')}
          labelStyle={[Fonts.titleTiny, { marginLeft: -15, color: 'grey' }]}
          activeTintColor={Colors.secondary}
          inactiveTintColor={'grey'}
        />

        <DrawerItem
          label={'Profile'} 
          icon={({color, size}) => ( <FontAwesome name={'user'} color={Colors.primary} size={16} solid/> )}
          onPress={() => props.navigation.navigate('Profile')}
          labelStyle={[Fonts.titleTiny, { marginLeft: -15, color: 'grey' }]}
          activeTintColor={Colors.secondary}
          inactiveTintColor={'grey'}
        />

        <DrawerItem
          label={'Logout'}
          icon={({color, size}) => (
            <FontAwesome name={'sign-out-alt'} color={Colors.error} size={16}/>
          )}
          onPress={() => {}}
          labelStyle={[Fonts.titleTiny,{ marginLeft: -15, color: Colors.error }]}
          activeTintColor={Colors.secondary}
          inactiveTintColor={'grey'}
        />
      </Drawer.Section>

    </DrawerContentScrollView>
  )
}

export default MenuDrawer