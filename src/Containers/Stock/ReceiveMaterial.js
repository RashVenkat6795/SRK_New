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

const ReceiveMaterial = (props) => {
  const { Layout, Gutters, Fonts, Colors, Common } = useTheme()
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const DATA = props.route.params.item
// console.log("DATA", DATA)

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
  const [details, setDetails] = useState()
  const [listArr, setListArr] = useState()
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    dispatch(getStores({ }))
    dispatch(getStoreProjects({ project_structure_id: UserProject }))
    getData()
  },[])

  const getData = () => {
    let params = {
      "stock_transfer_id": DATA?.stock_transfer_id
    }
    Request({
      method: 'POST',
      url: Config.STOCK_TRANSFER_RECEIVERNOTE,
      data: params
    }).then(resp => {
      console.log("resp", resp)
      if(resp?.stock_transfer_summary){
        let list_data = []
        let data = Object.values(resp?.stock_transfer_summary)
        data.map((item,index) => {
          if(isObject(item)){
            list_data.push(item)
          }
        })
        // resp?.stock_transfer_summary?.data = list_data
        // console.log("resp?.stock_transfer_summary", resp?.stock_transfer_summary)
        setListArr(list_data)
      }
    }).catch(error => {
      console.log("error", error)
    })
    // DATA
  }

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

  const receiveMaterial = () => {
    let dataArr = []
    listArr?.map((item,index) => {
      dataArr.push({
        "material_id": item?.material?.material_id, //"1", 
        "received_qty": item?.received || 0, // "530",
      })
    })
    let paramObj = {
      "stock_transfer_id": DATA?.stock_transfer_id,//"4",
      "employee_id": LoginInfo?.employee_id, //"2", 
      "call_log_details": dataArr
    }
    console.log("add stock transfer params.....", paramObj)
    Request({
      method: 'POST',
      url: Config.STOCK_TRANSFER_RECEIVERNOTE_UPDATE,
      data: paramObj
    }).then(response => {
      console.log("add stock transfer response", response)
      if(response?.stock_transfer_summary?.status == '1'){
        ToastMessage(response?.stock_transfer?.message, MessageTypes.success)
        props.navigation.goBack()
      } else {
        ToastMessage(response?.stock_transfer_summary?.message, MessageTypes.danger)
      }
    }).catch(error => {
      console.log("add stock transfer err", error)
    })
  }


  return (
    <View style={[Layout.fill]}>
      <View style={[Gutters.smallHPadding, Gutters.regularVMargin]}>
        <View style={{}}>
          <Text style={[Fonts.titleTiny, Gutters.tinyBMargin, { color: Colors.primary }]}>From</Text>
          <Text>{DATA?.from_place}</Text>
          {/* <RNPickerSelect
            placeholder={{}}
            items={StoreProjects}
            value={selectedFromStore}
            onValueChange={value => {
              setSelectedFromStore(value)
            }}
            style={Common.pickerSelectStyles}
            // useNativeAndroidPickerStyle={false}
            Icon={() => Platform.OS == 'ios' ? (<FontAwesome name={'chevron-down'} size={20} color="gray" style={{ marginTop: 4 }}/>) : null}
            disabled={true}
          /> */}

          <Text style={[Fonts.titleTiny, Gutters.tinyBMargin, Gutters.regularTMargin, { color: Colors.primary }]}>To</Text>
          <Text>{DATA?.to_place}</Text>
          {/* <RNPickerSelect
            placeholder={{}}
            items={Stores}
            value={selectedToStore}
            onValueChange={value => {
              setSelectedToStore(value)
            }}
            // useNativeAndroidPickerStyle={false}
            style={Common.pickerSelectStyles}
            Icon={() => Platform.OS == 'ios' ? (<FontAwesome name={'chevron-down'} size={20} color="gray" style={{ marginTop: 4 }}/>) : null}
          /> */}
        </View>
      </View>

      <FlatList
        data={listArr}
        keyExtractor={(item, index) => item + index}
        renderItem={({item,index}) => {
          return(
            <View key={index} style={[Gutters.smallHPadding, Gutters.smallVPadding, Gutters.smallBMargin, Gutters.smallHMargin, { backgroundColor: Colors.white, borderRadius: 10 }]}>
              <Text style={[Fonts.titleTiny,Gutters.smallBMargin,{ color: Colors.primary }]}>{item?.material_name}</Text>
              <View style={Layout.rowHSpaced}>

                <View style={Layout.center}>
                  <Text style={Fonts.textSmall}>Unit</Text>
                  <Text style={[Fonts.titleSmall,Gutters.tinyTMargin]}>{item?.material_unit}</Text>
                </View>

                <View style={Layout.center}>
                  <Text style={Fonts.textSmall}>Sent</Text>
                  <Text style={[Fonts.titleSmall,Gutters.tinyTMargin]}>{item?.transfer_quantity}</Text>
                </View>

                <View style={Layout.center}>
                  <Text style={Fonts.textSmall}>Received</Text>
                  <TextInput
                    value={item?.received}
                    onChangeText={text => {
                      if(Number(text) <= Number(item?.transfer_quantity)){
                        setShowMessage(false)
                        let arr = listArr
                        let index = listArr?.findIndex(obj => obj.material_id == item.material_id);
                        arr[index].received = text
                        setListArr(arr)
                        console.log("listdata....", listArr)
                      } else {
                        setShowMessage(true)
                      }
                    }}
                    style={{ width:'100%', padding: 0, margin: 0, height: 40, textAlign: 'center' }}
                    theme={Common.paperTheme}
                    keyboardType={'number-pad'}
                  />
                </View>
              </View>
              {showMessage && <Text style={[Gutters.smallTMargin, Fonts.textTiny, Fonts.textCenter, { color: Colors.error }]}>* Entered quantity is greater than sent quantity</Text>}
            </View>
          )
        }}
      />

      <Button mode='contained' color={Colors.primary} style={[Gutters.smallBMargin, Layout.selfCenter, { width: '80%' }]} 
        onPress={() => receiveMaterial()}
      >
        Receive Material
      </Button>

      {/* <View>
        <FAB
          icon="plus"
          animated={true} 
          theme={{ dark: false, colors: { accent: Colors.primary, primary: Colors.white } }}
          style={Common.fab}
          onPress={() => setShowModal(true)}
        />
      </View> */}

      {/* {listDt?.length > 0 &&

      } */}

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
                <Text>Sent</Text>
                <Text style={[Fonts.titleSmall, Gutters.smallTMargin]}>{stock}</Text>
              </View>

              <View style={[Layout.center, Layout.fill]}>
                <Text style={Gutters.smallBMargin}>Received</Text>
                <TextInput
                  value={qty}
                  onChangeText={text => setQty(text)}
                  style={{ width:'100%', padding: 0, margin: 0, height: 40, textAlign: 'center' }}
                  theme={Common.paperTheme}
                  keyboardType={'number-pad'}
                />
              </View>
            </View>
            
            

            <Button mode='contained' color={Colors.primary} style={[Gutters.largeTMargin, Layout.selfCenter, { width: '80%' }]} onPress={() => addMaterial()}
            >
              Add Material
            </Button>
          </>}

        </View>
      </Overlay>
    </View>
  )
}

export default ReceiveMaterial
