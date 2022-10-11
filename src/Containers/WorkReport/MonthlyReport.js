import React, { useEffect, useState, useCallback } from 'react'
import { ActivityIndicator, View, Text, ScrollView, TouchableOpacity, Touchable, FlatList } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { Button, TextInput } from 'react-native-paper'
import { Brand, Loader } from '@/Components'
import { setDefaultTheme } from '@/Store/Theme'
import { navigateAndSimpleReset } from '@/Navigators/utils'
// import MonthPicker from 'react-native-month-year-picker'
import FontAwesome from 'react-native-vector-icons/FontAwesome5'
import moment from 'moment'
import Request from '@/Requests/Core'
import { Config } from '@/Config'
import { useSelector, useDispatch } from 'react-redux'
import { isObject } from 'lodash'

const MonthlyReport = () => {
  const { Layout, Gutters, Fonts, Colors } = useTheme()
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const Months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [month, setMonth] = useState(Months[new Date().getMonth()])
  const [year, setYear] = useState(new Date().getFullYear())
  const [message, setMessage] = useState('')
  const [list_data, setListData] = useState([])

  const UserProject = useSelector(state => state.user.selectedProject)

  const showPicker = useCallback((value) => setShow(value), []);

  const onValueChange = useCallback((event, newDate) => {
    const selectedDate = newDate || date;
    setDate(selectedDate);
    setMonth(Months[new Date(date).getMonth()])
    setYear(new Date(date).getFullYear())
    showPicker(false);
    console.log("selectedDate", selectedDate, "month", Months[new Date(date).getMonth()], "year", year);
  },[date, showPicker])

  useEffect(() => {
    getData()
  },[])

  const getData = () => {
    let paramObj = {
      "project_structure_id": UserProject, //"2",
      "program_month": `${year}-${month}` // "2022-Sep"
    }
    console.log("paramObj....", paramObj)
    setLoading(true)
    Request({
      method: "POST",
      url: Config.MONTHLY_REPORT,
      data: paramObj
    }).then(response => {
      console.log("getData response", response)
      if(response?.project_work_program?.length > 0){
        response?.project_work_program?.map((parentItem,index) => {
          let details = []
          let data = Object.values(parentItem)
          data.map((item,index) => {
            if(isObject(item)){
              details.push(item)
            }
          })
          parentItem.data = details
        })
        // console.log("modified data", response?.project_work_program)
        setListData(response?.project_work_program)
        setLoading(false)
      } else {
        setMessage(response?.project_work_program?.message)
        setLoading(false)
      }
    }).catch(error => {
      console.log("error", error)
      setLoading(false)
    })
  }

  return (
    <View style={[Layout.fill]}>
      {loading && <Loader/>}
      <View style={[Gutters.smallHPadding, Gutters.smallVPadding, Layout.rowHCenter, Layout.fullWidth ]}>
        {/* <View style={Layout.fill, Gutters.regularRMargin}> */}
          {/* <Text style={[Fonts.titleTiny, Gutters.tinyBMargin, { color: Colors.primary}]}>Month - Year</Text> */}
          
          <TouchableOpacity onPress={() => {
            setMonth(null)
            setYear(null)
            showPicker(true)
          }} 
            style={[Gutters.largeRMargin, Gutters.largeHPadding, Gutters.smallVPadding, Layout.row, { borderWidth: 1, borderColor: Colors.grey, justifyContent:'space-between', flex: 1, alignItems:'center' }]}
          >
            <Text style={[Fonts.textRegular,{ color: Colors.primary }]}>{month} - {year}</Text>
            <FontAwesome name ={'chevron-down'} color={Colors.grey} size={14}/>
          </TouchableOpacity>
        {/* </View> */}

        <TouchableOpacity 
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary, alignItems:'center', justifyContent:'center' }}
          onPress={getData}
        >
          <FontAwesome name={'arrow-right'} color={Colors.white} size={22}/>
        </TouchableOpacity>
      </View>
      {/* {show && (
        <MonthPicker
          onChange={onValueChange}
          value={date}
          // minimumDate={new Date()}
          // maximumDate={new Date(2025, 5)}
          locale={'en'}
        />
      )} */}

      {list_data?.length > 0 ? 
        <FlatList
          data={list_data}
          keyExtractor={(item, index) => item + index}
          renderItem={({item,index}) => {
            return(
              <View key={index} style={[Gutters.smallHMargin, Gutters.smallHPadding, Gutters.smallVPadding, Gutters.smallBMargin,{ backgroundColor: Colors.white, borderRadius: 10 }]}>
                <Text style={[Fonts.titleTiny, Layout.selfEnd]}>{item?.structure}</Text>
                {item?.data?.map((sub_item,index) => {
                  return(
                    <View key={index} style={[Gutters.smallVPadding, { borderBottomWidth: index == item?.data?.length - 1 ? 0 : 1, borderColor: Colors.grey }]}>
                      <Text style={[Fonts.titleTiny, { color: Colors.primary }]}>{sub_item?.description} - {sub_item?.grade_of_concrete} - {sub_item?.unit}</Text>
                      {/* <Text style={[Fonts.textSmall, Gutters.tinyVMargin]}>Grade: </Text> */}
                      <View style={[Layout.rowHSpaced]}>
                        <Text style={Fonts.textSmall}>Length/Nos: {sub_item?.length_nos}</Text>
                        <Text style={[Fonts.textSmall, Gutters.tinyVMargin]}>Tentative Quantity: {sub_item?.tentative_quantity}</Text>
                      </View>
                    </View>
                  )
                })}
              </View>
            )
          }}
        />
      :
        <View style={[Layout.fill, Layout.colCenter]}>
          <Text style={[Fonts.textSmall]}>{message}</Text>
        </View>
      }
    </View>
  )
}

export default MonthlyReport
