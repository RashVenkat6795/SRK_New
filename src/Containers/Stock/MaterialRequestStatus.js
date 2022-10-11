import React, { useEffect, useState } from 'react'
import { ActivityIndicator, View, Text, ScrollView, TouchableOpacity, FlatList, Platform } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { Brand, MyButton } from '@/Components'
import { setDefaultTheme } from '@/Store/Theme'
import { navigate, navigateAndSimpleReset } from '@/Navigators/utils'
import { DataTable, FAB } from 'react-native-paper';
import DateTimePicker from 'react-native-modal-datetime-picker'
import moment from 'moment'
import FontAwesome from 'react-native-vector-icons/FontAwesome5'
import RNPickerSelect from 'react-native-picker-select'
import { useDispatch, useSelector } from 'react-redux'
import { getContractors } from '@/Store/User'
import Request from '@/Requests/Core'
import { Config } from '@/Config'
import { isObject } from 'lodash'

const optionsPerPage = [2, 3, 4];

const MaterialRequestStatus = (props) => {
  const { Layout, Gutters, Fonts, Colors, Common } = useTheme()
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const LoginInfo = useSelector(state => state.user.loginInfo)
  const UserProject = useSelector(state => state.user.selectedProject)
  const Contractors = useSelector(state => state.user.contractors)

  const [fromDate, setFromDate] = useState(moment('2022-07-01').format('DD/MM/YYYY'))
  const [toDate, setToDate] = useState(moment('2022-09-01').format('DD/MM/YYYY'))
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
  const [isFrom, setIsFrom] = useState(null)
  const [selectedContractor, setSelectedContractor] = useState(Contractors[0]?.value)
  const [Data, setData] = useState([])

  useEffect(() => {
    dispatch(getContractors({ "employee_id": LoginInfo?.employee_id, "project_structure_id": UserProject }))
  },[])

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.log("A date has been picked: ", date, "processed dt", moment(new Date(date)).format('DD/MM/YYYY'));
    if(isFrom){
      setFromDate(moment(new Date(date)).format('DD/MM/YYYY'))
      setIsFrom(null)
    } else {
      setToDate(moment(new Date(date)).format('DD/MM/YYYY'))
      setIsFrom(null)
    }
    hideDatePicker();
  };

  const getData = () => {
    let param = {
      "project_structure_id": UserProject, 
      "employee_id": LoginInfo?.employee_id, 
      "from_date": moment(fromDate).format('YYYY-MM-DD'), 
      "to_date": moment(toDate).format('YYYY-MM-DD'), 
      "contractor_id": selectedContractor
      // "project_structure_id":"3", "employee_id":"1", "from_date":"2022-07-01", "to_date":"2022-09-01", "contractor_id":""
    }
    console.log("get Material Request param", param)
    Request({
      method: 'POST',
      url: Config.GET_MATERIAL_REQUEST,
      data: param
    }).then(response => {
      console.log("get Material Requets resp", response)
      if(response?.material_request_list?.status == '0'){
        setData([])
      } else {
        let list_data = []
        let data = Object.values(response?.material_request_list)
        data.map((item,index) => {
          if(isObject(item)){
            list_data.push(item)
          }
        })
        setData(list_data)
      }
    }).catch(error => {
      console.log("get Material Requets err", error)
    })
  }

  return (
    <View style={[Layout.fill, Gutters.smallHPadding, Gutters.smallVPadding]}>
      <View style={[Layout.rowHCenter, Gutters.regularBMargin]}>
        <View style={[Layout.fill, Layout.center]}>
          <Text style={[Fonts.titleTiny,{ color: Colors.primary}]}>From</Text>
          <TouchableOpacity 
            style={[Layout.rowHCenter, { borderWidth: 1, borderColor: 'gray', padding: 10, borderRadius: 5 }]}
            onPress={() => { setIsFrom(true); showDatePicker(); }}
          >
            <Text style={[Fonts.textSmall, Gutters.smallRMargin, { color: Colors.primary }]}>{fromDate}</Text>
            <FontAwesome name={'calendar-day'} color={Colors.primary} size={14}/>
          </TouchableOpacity>
        </View>

        <View style={[Layout.fill, Layout.center]}>
          <Text style={[Fonts.titleTiny,{ color: Colors.primary}]}>To</Text>
          <TouchableOpacity 
            style={[Layout.rowHCenter, { borderWidth: 1, borderColor: 'gray', padding: 10, borderRadius: 5 }]}
            onPress={() => { setIsFrom(false); showDatePicker(); }}
          >
            <Text style={[Fonts.textSmall, Gutters.smallRMargin, { color: Colors.primary }]}>{toDate}</Text>
            <FontAwesome name={'calendar-day'} color={Colors.primary} size={14}/>
          </TouchableOpacity>
        </View>

        <DateTimePicker
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          // minimumDate={isFrom == false ? new Date(fromDate) : null}
        />
      </View>

      <View style={Layout.rowHCenter}>
        <View style={[Layout.fill, Gutters.regularRMargin]}>
          <RNPickerSelect
            placeholder={{}}
            items={Contractors}
            value={selectedContractor}
            onValueChange={value => {
              setSelectedContractor(value)
            }}
            style={Common.pickerSelectStyles}
            // useNativeAndroidPickerStyle={false}
            Icon={() => Platform.OS == 'ios' ? (<FontAwesome name={'chevron-down'} size={20} color="gray" style={{ marginTop: 4 }}/>) : null}
          />
        </View>

        <TouchableOpacity 
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary, alignItems:'center', justifyContent:'center' }}
          onPress={getData}
        >
          <FontAwesome name={'arrow-right'} color={Colors.white} size={22}/>
        </TouchableOpacity>
      </View>

      <View style={[Gutters.largeTMargin, Layout.fill]}>

        {Data?.length > 0 ? 
          <View style={Layout.fill}>
            <View style={[Layout.row, Gutters.smallVPadding, { borderWidth: 1, borderColor: Colors.grey }]}>
              <Text style={[Fonts.titleTiny, { flex: 1, color: Colors.primary }]}>Date</Text>
              <Text style={[Fonts.titleTiny, { flex: 2, color: Colors.primary }]}>Contractor</Text>
              <Text style={[Fonts.titleTiny, Fonts.textCenter, { flex: 2, color: Colors.primary }]}>No. of Materials</Text>
              <Text style={[Fonts.titleTiny, Fonts.textCenter, { flex: 1, color: Colors.primary }]}>Status</Text>
            </View>

            <FlatList
              data={Data}
              keyExtractor={(item, index) => item + index}
              renderItem={({item,index}) => {
                return(
                  <TouchableOpacity 
                    style={[Layout.row, Gutters.smallTMargin]}
                    onPress={() => navigate('MaterialRequestDetail',{ item })}
                  >
                    <Text style={[Fonts.textSmall, { flex: 1 }]}>{moment(item?.material_request_date).format('DD/MM/YYYY')}</Text>
                    <Text style={[Fonts.textSmall, { flex: 2 }]}>{item?.contractor_name}</Text>
                    <Text style={[Fonts.textSmall, Fonts.textCenter, { flex: 2 }]}>{item?.material_count}</Text>
                    <Text style={[Fonts.textSmall, Fonts.textCenter, { flex: 2 }]}>{item?.material_request_status}</Text>
                  </TouchableOpacity>
                )
              }}
            />
          </View>
        :
          <View style={[Layout.fill, Layout.colCenter]}>
            <Text style={Fonts.textRegular}>No Request Found</Text>
          </View>
        }
      </View>

      {/* <FAB
        icon="plus"
        animated={true} 
        theme={{
          dark: false,
          colors: {
            accent: Colors.primary,
            primary: Colors.white
          }
        }}
        style={Common.fab}
        onPress={() => console.log('Pressed')}
      /> */}
    </View>
  )
}

export default MaterialRequestStatus
