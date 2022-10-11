import React, { useEffect, useState } from 'react'
import { ActivityIndicator, View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList, Touchable } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { Button, TextInput } from 'react-native-paper'
import { Brand } from '@/Components'
import { setDefaultTheme } from '@/Store/Theme'
import { navigateAndSimpleReset, navigate } from '@/Navigators/utils'
import { useDispatch, useSelector } from 'react-redux'
import { getNotifications } from '@/Store/User'
import moment from 'moment'

const Notification = () => {
  const { Layout, Gutters, Fonts, Colors, Common } = useTheme()
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const Data = useSelector(state => state.user.notifications)
  const LoginInfo = useSelector(state => state.user.loginInfo)
// console.log("Data...", Data)
  useEffect(() => {
    dispatch(getNotifications({ employee_id: LoginInfo?.employee_id }))
  },[])

  return (
    <View style={[Layout.fill]}>
      <FlatList
        data={Data?.data}
        keyExtractor={(item, index) => item + index}
        renderItem={({item,index}) => {
          return(
            <TouchableOpacity key={index} 
              style={[Gutters.smallHMargin, Gutters.smallHPadding, Gutters.smallVPadding, Gutters.smallTMargin, Layout.rowHCenter, Common.boxShadow, { backgroundColor: Colors.white, borderRadius: 10, borderLeftWidth: 4, borderLeftColor: item?.read_status == 'Read' ? Colors.light_grey : Colors.success }]}
              onPress={() => navigate('NotificationDetail', item)}
            >
              <View style={[Layout.fill]}>
                <Text style={[Fonts.textSmall]} numberOfLines={3} ellipsizeMode={'tail'}>{item?.message} {item?.message}</Text>
              </View>
              <View style={[Gutters.smallLMargin, Layout.center]}>
                <Text style={[Fonts.textTiny]}>{moment(item?.date_time).format('D')} {moment(item?.date_time).format('MMM')}</Text>
                <Text style={[Fonts.textTiny]}>{moment(item?.date_time).format('ddd')}</Text>
                <Text style={[Fonts.textTiny]}>{moment(item?.date_time).format('h:mm:ss a')}</Text>
              </View>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  )
}

export default Notification
