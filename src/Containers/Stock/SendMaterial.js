import React, { useEffect, useState } from 'react'
import { ActivityIndicator, View, Text, ScrollView, FlatList, TouchableOpacity, Alert, Dimensions, Platform } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { Brand } from '@/Components'
import { setDefaultTheme } from '@/Store/Theme'
import { navigate, navigateAndSimpleReset, goBack } from '@/Navigators/utils'
import { TextInput, Button, FAB } from 'react-native-paper'
import RNPickerSelect from 'react-native-picker-select'
import FontAwesome from 'react-native-vector-icons/FontAwesome5'
import DateTimePicker from 'react-native-modal-datetime-picker'
import { Config } from '@/Config'
import Request from '@/Requests/Core'
import { useSelector, useDispatch } from 'react-redux'
import { isObject } from 'lodash'
import { getStores, getStoreProjects } from '@/Store/User'
import { BottomSheet, Overlay } from 'react-native-elements'
import moment from 'moment'
import { ToastMessage } from '@/Utils'
import { MessageTypes } from '@/Theme/Variables'

const { width, height } = Dimensions.get('window')

const SendMaterial = (props) => {
  const { Layout, Gutters, Fonts, Colors, Common } = useTheme()
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const UserProject = useSelector(state => state.user.selectedProject)
  const StoreProjects = useSelector(state => state.user.storeProjects)
  const Stores = useSelector(state => state.user.stores)
  const Materials = useSelector(state => state.user.materials)
  const LoginInfo = useSelector(state => state.user.loginInfo)

  const [listDt, setListDt] = useState([])
  const [selectedFromStore, setSelectedFromStore] = useState(StoreProjects[0]?.value)
  const [selectedToStore, setSelectedToStore] = useState(Stores[1]?.value)
  const [showModal, setShowModal] = useState(false)
  const [showBottomModal, setShowBottomModal] = useState(false)
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
  const [mode, setMode] = useState(null)
  const [selectedMaterial, setSelectedMaterial] = useState()
  const [selectMaterialObj, setSelectedMaterialObj] = useState()
  const [stock, setStock] = useState()
  const [qty, setQty] = useState()

  const [vehName, setVehName] = useState('')
  const [vehNo, setVehNo] = useState('')
  const [lrNo, setLRNo] = useState('')
  const [lrDate, setLRDate] = useState()
  const [billNo, setBillNo] = useState('')
  const [billDate, setBillDate] = useState()
  const [isVehDetAvail, setIsVehDetAvail] = useState(false)

  useEffect(() => {
    dispatch(getStores({ }))
    dispatch(getStoreProjects({ project_structure_id: UserProject }))
  },[])

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.log("A date has been picked: ", date, "processed dt", moment(new Date(date)).format('DD/MM/YYYY'));
    if(mode == 0){
      setLRDate(moment(new Date(date)).format('DD/MM/YYYY'))
      setMode(null)
    } else {
      setBillDate(moment(new Date(date)).format('DD/MM/YYYY'))
      setMode(null)
    }
    hideDatePicker();
  };

  const updateMaterial = (value) => {
    setSelectedMaterial(value)
    // console.log("Materials.filter(x => x.value == value)", Materials.filter(x => x.value == value))
    setSelectedMaterialObj(Materials.filter(x => x.value == value)[0])
    Request({
      method: 'POST',
      url: Config.MATERIAL_INHAND_STOCK,
      data: {
        "project_structure_id": UserProject, //'3'
        "material_id": value //"4"
      }
    }).then(resp => {
      console.log(resp)
      if(resp?.material_stock?.status == '1'){
        setStock(resp?.material_stock?.stock)
      }
    })
  }

  const addMaterial = () => {
    if(qty > Number(stock) || qty < 1){
      setStock(0); setQty(0)
      setSelectedMaterial(null)
      setSelectedMaterialObj(null)
      setShowModal(false)
    } else {
      let dt = [...listDt]
      dt.push({
        material: selectMaterialObj, 
        stock,
        requested: qty
      })
      // console.log("list.....", listDt)
      console.log("list.....", dt)
      setListDt(dt)
      setShowModal(false)
      
    }
  }

  const addStockTransfer = () => {
    let dataArr = []
    listDt?.map((item,index) => {
      dataArr.push({
        "material_id": item?.material?.material_id, //"1", 
        "stock_in_hand": item?.stock, // "530", 
        "material_transfer_quantity": item?.requested //"30"
      })
    })
    let paramObj = {
      "from_store_id": selectedFromStore, //"1", 
      "to_store_id": selectedToStore, //"2", 
      "vehicle_name": vehName,//"ABT Service", 
      "vehicle_no": vehNo,//"TN60AC4304", 
      "lr_no": lrNo, //"ABT0001", 
      "lr_date": lrDate, //"2022-09-26", 
      "eway_bill_no": billNo, //"EBNO0001", 
      "eway_bill_date": billDate, //"2022-09-26", 
      "employee_id": LoginInfo?.employee_id, //"2", 
      "transfer_list": dataArr
    }
    console.log("add stock transfer params.....", paramObj)
    Request({
      method: 'POST',
      url: Config.ADD_STOCK_TRANSFER,
      data: paramObj
    }).then(response => {
      console.log("add stock transfer response", response)
      if(response?.stock_transfer?.status == '1'){
        ToastMessage(response?.stock_transfer?.message, MessageTypes.success)
        props.navigation.goBack()
      } else {
        ToastMessage(response?.stock_transfer?.message, MessageTypes.danger)
      }
    }).catch(error => {
      console.log("add stock transfer err", error)
    })
  }

  const confirmVehicleDetails = () => {
    if(vehNo && vehNo && lrNo && lrDate && billDate && billNo){
      setIsVehDetAvail(true)
      setShowBottomModal(false)
    } else {
      setShowBottomModal(false)
      Alert.alert('Warning', 'Please fill in all the fields')
    }
  }

  return (
    <View style={[Layout.fill]}>
      <View style={[Gutters.smallHPadding, Gutters.regularVMargin]}>
        <View style={{}}>
          <Text style={[Fonts.titleTiny, Gutters.tinyBMargin, { color: Colors.primary }]}>From</Text>
          <RNPickerSelect
            placeholder={{}}
            items={StoreProjects}
            value={selectedFromStore}
            onValueChange={value => {
              setSelectedFromStore(value)
            }}
            style={Common.pickerSelectStyles}
            // useNativeAndroidPickerStyle={false}
            Icon={() => Platform.OS == 'ios' ? (<FontAwesome name={'chevron-down'} size={20} color="gray" style={{ marginTop: 4 }}/>) : null}
          />

          <Text style={[Fonts.titleTiny, Gutters.tinyBMargin, Gutters.regularTMargin, { color: Colors.primary }]}>To</Text>
          <RNPickerSelect
            placeholder={{}}
            items={Stores}
            value={selectedToStore}
            onValueChange={value => {
              setSelectedToStore(value)
            }}
            // useNativeAndroidPickerStyle={false}
            style={Common.pickerSelectStyles}
            Icon={() => Platform.OS == 'ios' ? (<FontAwesome name={'chevron-down'} size={20} color="gray" style={{ marginTop: 4 }}/>) : null}
          />
        </View>
      </View>

      <FlatList
        data={listDt}
        keyExtractor={(item, index) => item + index}
        renderItem={({item,index}) => {
          return(
            <View key={index} style={[Gutters.smallHPadding, Gutters.smallVPadding, Gutters.smallBMargin, Gutters.smallHMargin, { backgroundColor: Colors.white, borderRadius: 10 }]}>
              <Text style={[Fonts.titleTiny,Gutters.smallBMargin,{ color: Colors.primary }]}>{item?.material?.material_name} - {item?.material?.unit}</Text>
              <View style={Layout.rowHSpaced}>
                <View style={Layout.center}>
                  <Text style={Fonts.textSmall}>Stock in Hand</Text>
                  <Text style={[Fonts.titleSmall,Gutters.tinyTMargin]}>{item?.stock}</Text>
                </View>

                <View style={Layout.center}>
                  <Text style={Fonts.textSmall}>Requested Qty</Text>
                  <Text style={[Fonts.titleSmall,Gutters.tinyTMargin]}>{item?.requested}</Text>
                </View>
              </View>
            </View>

            // <View key={index} style={[Gutters.smallHPadding, Gutters.smallVPadding, Gutters.smallTMargin, Gutters.smallHMargin, { backgroundColor: Colors.white, borderRadius: 10 }]}>
            //   <View style={[Layout.rowHSpaced]}>
            //     <Text style={[Fonts.titleTiny]}>{item?.stock_transfer_date}</Text>
            //     <Text style={[Fonts.titleTiny,{ color: Colors.primary }]}>{item?.transfer_status}</Text>
            //   </View>
            //   <View style={[Layout.rowHSpaced, Gutters.smallTMargin]}>
            //     <View style={[Layout.fill, Layout.center]}>
            //       <Text style={{ color: Colors.grey }}>From</Text>
            //       <Text style={[Layout.fill, Gutters.tinyHMargin, Gutters.tinyTMargin, Fonts.textSmall]}>{item?.from_place}</Text>
            //     </View>

            //     <View style={[Layout.fill, Layout.center]}>
            //       <Text style={{ color: Colors.grey }}>To</Text>
            //       <Text style={[Layout.fill, Gutters.tinyHMargin, Gutters.tinyTMargin, Fonts.textSmall]}>{item?.to_place}</Text>
            //     </View>
            //   </View>
            // </View>
          )
        }}
      />

      <View>
        <FAB
          icon="plus"
          animated={true} 
          theme={{ dark: false, colors: { accent: Colors.primary, primary: Colors.white } }}
          style={Common.fab}
          onPress={() => setShowModal(true)}
        />

        <FAB
          icon="car"
          animated={true} 
          theme={{ dark: false, colors: { accent: isVehDetAvail ? Colors.primary : Colors.red, primary: Colors.white } }}
          style={Common.fab1}
          onPress={() => setShowBottomModal(true)}
          // disabled={}
        />
      </View>

      {(listDt?.length > 0 && isVehDetAvail) &&
        <Button mode='contained' color={Colors.primary} style={[Gutters.largeTMargin, Layout.selfCenter, { width: '80%' }]} 
          onPress={() => addStockTransfer()}
        >
          Send Material
        </Button>
      }

      <Overlay transparent visible={showModal}>
        <View style={[Gutters.regularVPadding, Gutters.smallHPadding, { width: width - 50, backgroundColor: Colors.white, borderRadius: 30 }]}>
          <Text style={[Fonts.titleTiny, Fonts.textCenter, Gutters.largeBMargin, { color: Colors.primary }]}>Add Materials</Text>

          <RNPickerSelect
            // placeholder={{}}
            placeholder={{ inputLabel: 'Select a Material'}}
            items={Materials}
            value={selectedMaterial}
            onValueChange={value => {
              updateMaterial(value)
            }}
            // useNativeAndroidPickerStyle={false}
            style={Common.pickerSelectStyles}
            Icon={() => Platform.OS == 'ios' ? (<FontAwesome name={'chevron-down'} size={20} color="gray" style={{ marginTop: 4 }}/>) : null}
          />

          {selectedMaterial && <>
            <View style={[Layout.rowHSpaced, Gutters.regularTMargin]}>
              <View style={[Layout.center, Layout.fill]}>
                <Text>Unit</Text>
                <Text style={[Fonts.titleSmall, Gutters.smallTMargin]}>{selectMaterialObj?.unit}</Text>
              </View>

              <View style={[Layout.center, Layout.fill]}>
                <Text>Stock in Hand</Text>
                <Text style={[Fonts.titleSmall, Gutters.smallTMargin]}>{stock}</Text>
              </View>

              <View style={[Layout.center, Layout.fill]}>
                <Text style={Gutters.smallBMargin}>Quantity</Text>
                <TextInput
                  value={qty}
                  onChangeText={text => setQty(text)}
                  style={{ width:'100%', padding: 0, margin: 0, height: 40, textAlign: 'center' }}
                  theme={Common.paperTheme}
                  keyboardType={'number-pad'}
                />
              </View>
            </View>
            
            {qty > Number(stock) && <Text style={[Gutters.smallTMargin, Fonts.textTiny, Fonts.textCenter, { color: Colors.error }]}>* Entered quantity is greater than in-hand stock quantity</Text>}

            <Button mode='contained' color={Colors.primary} style={[Gutters.largeTMargin, Layout.selfCenter, { width: '80%' }]} onPress={() => addMaterial()}
            >
              Add Material
            </Button>
          </>}

        </View>
      </Overlay>

      <BottomSheet isVisible={showBottomModal}>
        <View style={[Gutters.regularVPadding, Gutters.smallHPadding, { backgroundColor: Colors.white, borderTopLeftRadius: 15, borderTopRightRadius: 15, paddingBottom: 50  }]}>
          <Text style={[Fonts.titleTiny, Fonts.textCenter, Gutters.regularBMargin, { color: Colors.primary }]}>Enter Vehicle Details</Text>

          <TextInput
            value={vehName}
            label={'Vehicle Name'}
            onChangeText={text => setVehName(text)}
            style={[Gutters.regularTMargin, { width:'100%', padding: 0, margin: 0, height: 40, backgroundColor: Colors.white }]}
            mode={'outlined'}
            theme={Common.paperTheme}
          />

          <TextInput
            value={vehNo}
            label={'Vehicle No'}
            onChangeText={text => setVehNo(text)}
            style={[Gutters.regularTMargin, { width:'100%', padding: 0, margin: 0, height: 40, backgroundColor: Colors.white }]}
            mode={'outlined'}
            theme={Common.paperTheme}
          />

          <TextInput
            value={lrNo}
            label={'LR No.'}
            onChangeText={text => setLRNo(text)}
            style={[Gutters.regularTMargin, { width:'100%', padding: 0, margin: 0, height: 40, backgroundColor: Colors.white }]}
            mode={'outlined'}
            theme={Common.paperTheme}
          />

          <TouchableOpacity 
            style={[Layout.rowHCenter, Gutters.regularTMargin, { borderWidth: 1, borderColor: Colors.light_grey, padding: 15, borderRadius: 5 }]}
            onPress={() => { setMode(0); showDatePicker(); }}
          >
            <Text style={[Fonts.textSmall, Gutters.smallRMargin, { color: lrDate ? Colors.primary : Colors.grey }]}>{lrDate || 'LR No. Date'}</Text>
            {/* <FontAwesome name={'calendar-day'} color={Colors.primary} size={14}/> */}
          </TouchableOpacity>

          <TextInput
            value={billNo}
            label={'E-way Bill No'}
            onChangeText={text => setBillNo(text)}
            style={[Gutters.regularTMargin, { width:'100%', padding: 0, margin: 0, height: 40, backgroundColor: Colors.white }]}
            mode={'outlined'}
            theme={Common.paperTheme}
          />

          <TouchableOpacity 
            style={[Layout.rowHCenter, Gutters.regularTMargin, { borderWidth: 1, borderColor: Colors.light_grey, padding: 15, borderRadius: 5 }]}
            onPress={() => { setMode(1); showDatePicker(); }}
          >
            <Text style={[Fonts.textSmall, Gutters.smallRMargin, { color: billDate ? Colors.primary : Colors.grey }]}>{billDate || 'E-way Bill  Date'}</Text>
            {/* <FontAwesome name={'calendar-day'} color={Colors.primary} size={14}/> */}
          </TouchableOpacity>

          <DateTimePicker
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            // minimumDate={isFrom == false ? new Date(fromDate) : null}
          />

        <Button mode='contained' color={Colors.primary} style={Gutters.regularTMargin} 
          onPress={() => confirmVehicleDetails()}
        >
          Confirm
        </Button>
        </View>
      </BottomSheet>
    </View>
  )
}

export default SendMaterial
