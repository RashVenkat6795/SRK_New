import React, { useEffect, useState } from 'react'
import { ActivityIndicator, View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { Button, TextInput } from 'react-native-paper'
import { Brand } from '@/Components'
import { setDefaultTheme } from '@/Store/Theme'
import { navigateAndSimpleReset, navigate } from '@/Navigators/utils'
import Request from '@/Requests/Core'
import { Config } from '@/Config'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { getNotifications } from '@/Store/User'

const NotificationDetail = (props) => {
  const { Layout, Gutters, Fonts, Colors } = useTheme()
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const Details = props.route.params

  const LoginInfo = useSelector(state => state.user.loginInfo)

  const [details, setDetails] = useState(null)

  useEffect(() => {
    getDetails()
  },[])

  const getDetails = () => {
    Request({
      method: 'POST',
      url: Config.NOTIFICATION_DETAIL,
      data: {
        "notification_id": Details?.notification_id
      }
    }).then(resp => {
      // console.log("getNotifdet resp", resp)
      if(resp?.notification){
        setDetails(resp?.notification)
        if(resp?.notification?.read_status != 'Read'){
          Request({
            method: 'POST',
            url: Config.NOTIFICATION_READ,
            data: {
              "notification_id": resp?.notification?.notification_id
            }
          }).then(resp => {
            console.log("notification read status", resp)
            dispatch(getNotifications({ employee_id: LoginInfo?.employee_id }))
          }).catch(error => {
            console.log("notification read error", error)
          })
        } else {
          console.log("notification is already read.......")
        }
      }
    }).catch(error => {
      console.log("getnotificdet err", error)
    })
  }

  return (
    <View style={Layout.fill}>
      <View style={[Gutters.smallHMargin, Gutters.regularVMargin, Gutters.regularHPadding, Gutters.regularVPadding, Layout.fill, { backgroundColor: Colors.white, borderRadius: 10 }]}>
        <View style={Layout.rowHSpaced}>
          <Text>{moment(details?.date_time).format('D')} {moment(details?.date_time).format('MMM')} - {moment(details?.date_time).format('h:mm:ss a')}</Text>
          <Text>{details?.read_status}</Text>
        </View>
        <Text style={[Fonts.textSmall, Gutters.largeTMargin]}>{details?.message}</Text>
      </View>
    </View>
  )
}

const Styles = StyleSheet.create({
  boxShadow: {
    shadowColor: 'grey',
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  }
})

export default NotificationDetail
