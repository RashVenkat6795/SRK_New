import React, { useEffect, useState } from 'react'
import { ActivityIndicator, View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList, Platform } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import DatePicker from 'react-native-date-picker'
import { FAB } from 'react-native-paper'
import moment from 'moment'
import DateTimePicker from 'react-native-modal-datetime-picker'
import FontAwesome from 'react-native-vector-icons/FontAwesome5'
import RNPickerSelect from 'react-native-picker-select'
import { useDispatch, useSelector } from 'react-redux'
import { getStoreProjects, getStores } from '@/Store/User'
import { Config } from '@/Config'
import Request from '@/Requests/Core'

const ConsumptionHistory = () => {
  const { Layout, Gutters, Fonts, Colors, Common } = useTheme()
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const Projects = useSelector(state => state.user.projects)
  const UserProject = useSelector(state => state.user.selectedProject)
  const StoreProjects = useSelector(state => state.user.storeProjects)
  const Stores = useSelector(state => state.user.stores)

  const [selectedStore, setSelectedStore] = useState(StoreProjects[0]?.value)
  // const [selectedStore, setSelectedStore] = useState(StoreProjects[0]?.value)
  const [fromDate, setFromDate] = useState(moment(new Date()).format('YYYY-MM-DD'))
  const [toDate, setToDate] = useState(moment(new Date()).format('YYYY-MM-DD'))
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
  const [isFrom, setIsFrom] = useState(null)
  const [listDt, setListDt] = useState(null)
  const [message, setMessage] = useState(false)
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    dispatch(getStores({ }))
    dispatch(getStoreProjects({ project_structure_id: UserProject }))
    getData()
  },[])

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.log("A date has been picked: ", date, "processed dt", moment(new Date(date)).format('YYYY-MM-DD'));
    if(isFrom){
      setFromDate(moment(new Date(date)).format('YYYY-MM-DD'))
      setIsFrom(null)
    } else {
      setToDate(moment(new Date(date)).format('YYYY-MM-DD'))
      setIsFrom(null)
    }
    hideDatePicker();
  };

  const getData = () => {
    let params = {
      project_store_id: selectedStore,
      stock_consumption_from_date: fromDate,
      stock_consumption_to_date: toDate
      // "project_store_id":"1", "stock_consumption_from_date":"2022-08-05", "stock_consumption_to_date":"2022-08-06"
    }
    console.log("gethistory param", params)
    Request({ 
      method: 'POST',
      url: Config.GET_CONSUMPTIONHISTORY_DATEWISE,
      data: params
    }).then(response => {
      console.log("get history response", response)
      if(response && response?.consumption_history?.length > 0){
        setListDt(response?.consumption_history)
        setRefresh(!refresh)
      } else {
        setListDt([])
      }
    }).catch(error => {
      console.log("get history error", error)
    })
  }


  return (
    <View style={[Layout.fill, Gutters.smallHPadding, Gutters.regularVPadding]}>
      {/* <Text style={[Fonts.titleTiny,{ color: Colors.primary }]}>Consumption Details</Text> */}

      <View style={[Layout.rowHCenter, Gutters.regularBMargin]}>
        <View style={[Layout.fill, Layout.center]}>
          <Text style={[Fonts.titleTiny, Gutters.tinyBMargin, { color: Colors.primary}]}>From</Text>
          <TouchableOpacity 
            style={[Layout.rowHCenter, { borderWidth: 1, borderColor: 'gray', padding: 10, borderRadius: 5 }]}
            onPress={() => { setIsFrom(true); showDatePicker(); }}
          >
            <Text style={[Fonts.textSmall, Gutters.smallRMargin, { color: Colors.primary }]}>{fromDate}</Text>
            <FontAwesome name={'calendar-day'} color={Colors.primary} size={14}/>
          </TouchableOpacity>
        </View>

        <View style={[Layout.fill, Layout.center]}>
          <Text style={[Fonts.titleTiny, Gutters.tinyBMargin, { color: Colors.primary}]}>To</Text>
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
          {/* <RNPickerSelect
            placeholder={{}}
            items={StoreProjects}
            value={selectedStore}
            onValueChange={value => {
              setSelectedStore(value)
            }}
            style={Common.pickerSelectStyles}
            // Icon={<FontAwesome name={'chevron-down'} size={20} color="gray"/>}
          /> */}
          <RNPickerSelect
            placeholder={{}}
            items={StoreProjects}
            value={selectedStore}
            onValueChange={value => {
              setSelectedStore(value)
              getData()
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

      {listDt?.length > 0 ? 
        <FlatList
          data={listDt}
          keyExtractor={(item, index) => item + index}
          renderItem={({item,index}) => {
            return(
              <View key={index} style={[Gutters.smallHPadding, Gutters.smallVPadding, Gutters.smallTMargin, { backgroundColor: Colors.white, borderRadius: 10 }]}>
                <Text style={[Fonts.titleTiny,Gutters.smallBMargin,{ color: Colors.primary }]}>{item?.material_name} - {item?.unit}</Text>
                <View style={Layout.rowHSpaced}>
                  <View style={[Layout.fill, Layout.center]}>
                    <Text style={Fonts.textSmall}>Consumption</Text>
                    <Text style={[Fonts.titleSmall,Gutters.tinyTMargin]}>{item?.quantity}</Text>
                  </View>

                  <View style={[Layout.fill, Layout.center]}>
                    <Text style={Fonts.textSmall}>Scrap</Text>
                    <Text style={[Fonts.titleSmall,Gutters.tinyTMargin]}>{item?.scrap}</Text>
                  </View>
                </View>
              </View>
            )
          }}
        />
      :
        <View style={[Layout.fill, Layout.center]}>
          <Text style={[Fonts.textSmall]}>No consumption History found</Text>
        </View>
      }

      {/* <View style={[Gutters.largeTMargin, Gutters.smallHPadding]}>
        <View style={[Layout.row]}>
          <Text style={[Fonts.titleTiny, { flex: 2 }]}>Material Name</Text>
          <Text style={[Fonts.titleTiny, Fonts.textCenter, { flex: 0.6 }]}>Qty</Text>
          <Text style={[Fonts.titleTiny, Fonts.textCenter, { flex: 0.6 }]}>Unit</Text>
        </View>

        <ScrollView>
          <View style={[Layout.row, Gutters.smallTMargin]}>
            <Text style={[Fonts.textSmall, { flex: 2 }]}>14" cutting wheel</Text>
            <Text style={[Fonts.textSmall, Fonts.textCenter, { flex: 0.6 }]}>3</Text>
            <Text style={[Fonts.textSmall, Fonts.textCenter, { flex: 0.6 }]}>Nos</Text>
          </View>
        </ScrollView>
      </View> */}

    </View>
  )
}

export default ConsumptionHistory
