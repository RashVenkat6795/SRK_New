import React, { useEffect } from 'react'
import { ActivityIndicator, View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { Brand, SvgIcons } from '@/Components'
import { setDefaultTheme } from '@/Store/Theme'
import { navigateAndSimpleReset } from '@/Navigators/utils'
import FontAwesome from 'react-native-vector-icons/FontAwesome5'
import FastImage from 'react-native-fast-image'
import { getHomeStats, setAuth, getProjects, setUserProject } from '@/Store/User'
import RNPickerSelect from 'react-native-picker-select'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

const Home = () => {
  const { Layout, Gutters, Fonts, NavigationTheme, darkMode, Colors, Images, Common } = useTheme()
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const today = moment(new Date()).format('YYYY-MM-DD')
  const LoginInfo = useSelector(state => state.user.loginInfo)
  const HomeStat = useSelector(state => state.user.homeStats)
  const UserProject = useSelector(state => state.user.selectedProject) || '1'
  const Projects = useSelector(state => state.user.projects)

  useEffect(() => {
    getStats()
    dispatch(getProjects({ employee_id: LoginInfo?.employee_id }))
  },[])

  const getStats = () => {
    let getStat_param = {
      employee_id: LoginInfo?.employee_id,
      project_structure_id: UserProject, // LoginInfo?.company_id,
      attendance_date: today
    }
    dispatch(getHomeStats(getStat_param))
  }

  const logoutAction = () => {
    dispatch(setAuth({ login: false }))
  }

  const _renderLabPres = (index, title, count) => {
    return(
      <View key={index} 
        style={[Gutters.tinyHMargin, Layout.center, Gutters.smallVPadding, { backgroundColor: Colors.background, flex: 1 }]}
      >
        <Text style={[Fonts.titleSmall]}>{count}</Text>
        <Text style={[Fonts.textSmall, Fonts.textCenter, Gutters.smallTMargin]}>{title}</Text>
      </View>
    )
  }

  return (
    <View style={[Layout.fill, Gutters.smallHPadding, Gutters.smallVPadding]}>
      <RNPickerSelect
        placeholder={{}}
        items={Projects}
        value={UserProject}
        onValueChange={value => {
          dispatch(setUserProject({ id: value }));
          getStats()
        }}
        // useNativeAndroidPickerStyle={false}
        style={{ ...Common.pickerSelectStyles, borderWidth: 1 }}
        Icon={() => Platform.OS == 'ios' ? (<FontAwesome name={'chevron-down'} size={20} color="gray" style={{ marginTop: 4 }}/>) : null}
      />

      <ScrollView style={[Layout.fill, Gutters.regularTMargin ]}>
        <FastImage source={Images.homeCard} style={[Layout.fullWidth, Gutters.regularHPadding, Gutters.regularVPadding, Styles.boxShadow, Layout.rowHCenter, { borderRadius: 10 }]} resizeMode={'cover'}>
          <View style={Layout.fill}>
            <Text style={[Fonts.titleTiny, Gutters.regularBMargin, { color: Colors.white }]}>Attendance Details</Text>
            <Text style={[Fonts.textSmall, { color: Colors.white }]}>Skilled : {HomeStat?.skilled_labour}</Text>
            <Text style={[Fonts.textSmall, Gutters.smallTMargin, { color: Colors.white }]}>Semi - Skilled : {HomeStat?.semi_skilled_labour}</Text>
            <Text style={[Fonts.textSmall, Gutters.smallTMargin, { color: Colors.white }]}>Non - Skilled : {HomeStat?.un_skilled_labour}</Text>
            <Text style={[Fonts.textSmall, Gutters.smallTMargin, { color: Colors.white }]}>Idle : {HomeStat?.idle_labour}</Text>
          </View>
          <SvgIcons name={'atten_bigwhite'}/>
        </FastImage>

        <FastImage source={Images.homeCard} style={[Layout.fullWidth, Gutters.regularHPadding, Gutters.regularVPadding, Styles.boxShadow, Gutters.largeTMargin, Layout.rowHCenter, { borderRadius: 10 }]} resizeMode={'cover'}>
          <View style={Layout.fill}>
            <Text style={[Fonts.titleTiny, Gutters.regularBMargin, { color: Colors.white }]}>Stock Details</Text>
            {/* <Text style={[Fonts.textSmall, { color: Colors.white }]}>Material Status : Stocks in Hand</Text> */}
            <Text style={[Fonts.textSmall, Gutters.smallTMargin, { color: Colors.white }]}>Material Request Status : {HomeStat?.material_request_status}</Text>
            <Text style={[Fonts.textSmall, Gutters.smallTMargin, { color: Colors.white }]}>Send Material Status  : {HomeStat?.send_material_status}</Text>
            <Text style={[Fonts.textSmall, Gutters.smallTMargin, { color: Colors.white }]}>Received Material Status : {HomeStat?.received_material_status} </Text>
          </View>
          <SvgIcons name={'stock_bigwhite'}/>
        </FastImage>


        <FastImage source={Images.homeCard} style={[Layout.fullWidth, Gutters.regularHPadding, Gutters.regularVPadding, Styles.boxShadow, Gutters.largeTMargin, Layout.rowHCenter, { borderRadius: 10 }]} resizeMode={'cover'}>
          <View style={Layout.fill}>
            <Text style={[Fonts.titleTiny, Gutters.regularBMargin, { color: Colors.white }]}>Work Report</Text>
            <Text style={[Fonts.textSmall, Gutters.smallTMargin, { color: Colors.white }]}>Today Project Status : {HomeStat?.project_status} </Text>
            <Text style={[Fonts.textSmall,  Gutters.smallTMargin, { color: Colors.white }]}>Partial Completion : {HomeStat?.partial_completion}</Text>
            <Text style={[Fonts.textSmall, Gutters.smallTMargin, { color: Colors.white }]}>Not Started : {HomeStat?.not_started}</Text>
            
          </View>
          <SvgIcons name={'rep_bigwhite'}/>
        </FastImage>
      </ScrollView>

      {/* <TouchableOpacity onPress={() => logoutAction()}>
        <Text>Logout</Text>
      </TouchableOpacity> */}
    </View>
  )
}

const Styles = StyleSheet.create({
  boxShadow: {
    shadowColor: '#2D9CDB',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  }
})

export default Home
