import React, { useEffect, useState } from 'react'
import { ActivityIndicator, View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { Button, TextInput } from 'react-native-paper'
import { Brand, Loader } from '@/Components'
import { setDefaultTheme } from '@/Store/Theme'
import { navigateAndSimpleReset } from '@/Navigators/utils'
import DateTimePickerModal from "react-native-modal-datetime-picker"
import moment from 'moment'
import Request from '@/Requests/Core'
import FontAwesome from 'react-native-vector-icons/FontAwesome5'
import { Config } from '@/Config'
import { useSelector } from 'react-redux'

const DailyReport = () => {
  const { Layout, Gutters, Fonts, Colors } = useTheme()
  const { t } = useTranslation()

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
  const [date, setDate] = useState(moment(new Date()).format('DD/MM/YYYY'))
  const [list_data, setListData] = useState([])
  const [listemptMsg, setListEmptMsg] = useState()
  const [loading, setLoading] = useState(false)

  const UserProject = useSelector(state => state.user.selectedProject)

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    // console.warn("A date has been picked: ", date);
    setDate(moment(date).format('DD/MM/YYYY'))
    hideDatePicker();
    getData();
  };

  useEffect(() => {
    getData()
  },[])

  const getData = () => {
    let param = {
      "project_structure_id": UserProject,
      "program_date": moment(date).format('YYYY-MM-DD'), //"2022-09-26"
    }
    setLoading(true)
    console.log("get dailydata param", param)
    Request({
      method: 'POST',
      url: Config.DAILY_REPORT,
      data: param
    }).then(resp => {
      // console.log("get dailydata resp", resp)
      if(resp?.project_daily_program?.length > 0){
        setListData(resp?.project_daily_program)
        setLoading(false)
      } else {
        setListEmptMsg(resp?.project_daily_program?.message)
        setLoading(false)
      }
    }).catch(error => {
      setLoading(false)
      console.log("get dailydata error", error)
    })
  }

  return (
    <View style={Layout.fill}>
      {loading && <Loader/>}
      <View style={[Gutters.smallHPadding, Gutters.smallVPadding, Layout.rowHCenter, Layout.fullWidth ]}>
        {/* <View style={Layout.fill, Gutters.regularRMargin}> */}
        <View style={[Layout.fill]}>
          <Text style={[Fonts.titleTiny, Gutters.tinyBMargin, { color: Colors.primary}]}>Date</Text>
          
          <TouchableOpacity onPress={showDatePicker} 
            style={[Gutters.largeRMargin, Layout.row, { borderWidth: 1, borderColor: Colors.grey, padding: 10 }]}
          >
            <Text style={[Fonts.textRegular, Gutters.regularRMargin, { color: Colors.primary }]}>{date}</Text>
            <FontAwesome name ={'calendar-day'} color={Colors.primary} size={20}/>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[Gutters.largeLMargin, { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary, alignItems:'center', justifyContent:'center' }]}
          onPress={getData}
        >
          <FontAwesome name={'arrow-right'} color={Colors.white} size={22}/>
        </TouchableOpacity>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      {list_data?.length > 0 ? 
        <FlatList
          data={list_data}
          keyExtractor={(item, index) => item + index}
          renderItem={({item,index}) => {
            return(
              <View key={index} style={[Gutters.smallHMargin, Gutters.smallHPadding, Gutters.smallVPadding, Gutters.smallBMargin,{ backgroundColor: Colors.white, borderRadius: 10 }]}>
                <View style={Layout.rowHSpaced}>
                  <Text style={[Fonts.titleTiny]}>{item?.structure}</Text>
                  <Text style={[Fonts.titleTiny, Layout.selfEnd]}>{'STATUS'}</Text>
                </View>
                <View style={[Gutters.smallVPadding]}>
                  <Text style={[Fonts.titleTiny, { color: Colors.primary }]}>{item?.description} - {item?.unit}</Text>
                  <View style={[Layout.rowHSpaced, Gutters.tinyTMargin]}>
                    <Text style={[Fonts.textTiny]}>From Loc: <Text style={Fonts.textSmall}>{item?.from_location}</Text></Text>
                    <Text style={[Fonts.textTiny]}>To Loc: <Text style={Fonts.textSmall}>{item?.to_location}</Text></Text>
                  </View>
                  <View style={[Layout.rowHSpaced, Gutters.smallTMargin]}>
                    <View style={[Layout.fill, Layout.center]}>
                      <Text style={[Fonts.textTiny, Gutters.tinyBMargin]}>Side</Text>
                      <Text style={Fonts.textSmall}>{item?.side}</Text>
                    </View>
                    <View style={[Layout.fill, Layout.center]}>
                      <Text style={[Fonts.textTiny, Gutters.tinyBMargin]}>Planned Qty</Text>
                      <Text style={Fonts.textSmall}>{item?.planned_quantity}</Text>
                    </View>
                    <View style={[Layout.fill, Layout.center]}>
                      <Text style={[Fonts.textTiny, Gutters.tinyBMargin]}>Achieved Qty</Text>
                      <Text style={Fonts.textSmall}>{item?.achieved_quantity}</Text>
                    </View>
                  </View>
                </View>
              </View>
            )
          }}
        />
      :
        <View style={[Layout.fill, Layout.colCenter]}>
          <Text style={[Fonts.textSmall]}>{listemptMsg}</Text>
        </View>
      }
    </View>
  )
}

export default DailyReport
