import React, { useEffect, useState } from 'react'
import { ActivityIndicator, View, Text, ScrollView, FlatList, Dimensions, Platform } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { Brand, MyButton } from '@/Components'
import { setDefaultTheme } from '@/Store/Theme'
import { navigateAndSimpleReset } from '@/Navigators/utils'
import { DataTable, FAB, TextInput, Button } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome5'
import moment from 'moment'
import { getContractors, getMaterials } from '@/Store/User'
import { useSelector, useDispatch } from 'react-redux'
import RNPickerSelect from 'react-native-picker-select'
import { Overlay } from 'react-native-elements'
import Request from '@/Requests/Core'
import { Config } from '@/Config'
import { ToastMessage } from '@/Utils'
import { MessageTypes } from '@/Theme/Variables'

const optionsPerPage = [2, 3, 4];
const { width, height } = Dimensions.get('window')

const MaterialRequest = (props) => {
  const { Layout, Gutters, Fonts, Colors, Common } = useTheme()
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const Contractors = useSelector(state => state.user.contractors)
  const Materials = useSelector(state => state.user.materials)
  const UserProject = useSelector(state => state.user.selectedProject)
  const LoginInfo = useSelector(state => state.user.loginInfo)

  const [selectedContractor, setSelectedContractor] = useState(Contractors[0]?.value)
  const [showModal, setShowModal] = useState(false)
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)

  const [selectedMaterial, setSelectedMaterial] = useState()
  const [selectMaterialObj, setSelectedMaterialObj] = useState()
  const [stock, setStock] = useState()
  const [qty, setQty] = useState()

  useEffect(() => {
    dispatch(getContractors({ "employee_id": LoginInfo?.employee_id, "project_structure_id": UserProject }))
    dispatch(getMaterials({}))
  },[])

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
    if(qty > Number(stock)){
      setStock(0); setQty(0)
      setSelectedMaterial(null)
      setSelectedMaterialObj(null)
      setShowModal(false)
    } else {
      let dt = [...list]
      dt.push({
        material: selectMaterialObj, 
        stock,
        requested: qty
      })
      setList(dt)
      setShowModal(false)
      console.log("list.....", list)
    }
  }

  const sendMaterialRequest = () => {
    setLoading(true)
    let dataArr = []
    list?.map((item,index) => {
      dataArr.push({
        material_id: item?.material?.material_id,
        stock_in_hand: item?.stock,
        material_request_quantity: item?.requested,
        "material_request_value": "4060" // entered value
      })
    })
    let paramObj = {
      "project_structure_id": UserProject, //"3", 
      "contractor_id": selectedContractor, //"1", 
      "employee_id": LoginInfo?.employee_id,//"2",
      "material_request": dataArr
    }
    console.log("material request params.....", paramObj)
    Request({
      method: 'POST',
      url: Config.ADD_MATERIAL_REQUEST,
      data: paramObj
    }).then(response => {
      console.log("respose.....", response)
      setLoading(false)
      if(response.material_request?.status == '1'){
        ToastMessage(response.material_request?.message, MessageTypes.success)
        props.navigation.goBack()
      } else {
        ToastMessage(response.material_request?.message, MessageTypes.danger)
      }
    }).catch(error => {
      console.log("error", error)
      setLoading(false)
    })
  }

  return (
    <View style={[Layout.fill, Gutters.smallHPadding, Gutters.smallVPadding]}>
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

      <Text style={[Fonts.titleTiny, Gutters.largeVMargin, { color: Colors.primary }]}>Request on Date {moment(new Date()).format('DD/MM/YYYY')}</Text>
      <FlatList
        data={list}
        keyExtractor={(item, index) => item + index}
        renderItem={({item,index}) => {
          return(
            <View key={index} style={[Gutters.smallHPadding, Gutters.smallVPadding, Gutters.smallBMargin,{ backgroundColor: Colors.white, borderRadius: 10 }]}>
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
          )
        }}
      />

      {list?.length > 0 && 
        <Button mode='contained' color={Colors.primary} style={[Gutters.largeTMargin, Layout.selfCenter, { width: '80%' }]} onPress={() => sendMaterialRequest()}
        >
          Send Material Request
        </Button>
      }


      <FAB
        icon="plus"
        animated={true} 
        theme={{ dark: false, colors: { accent: Colors.primary, primary: Colors.white } }}
        style={Common.fab}
        onPress={() => setShowModal(true)}
      />

      <Overlay transparent visible={showModal}>
        <View style={[Gutters.regularVPadding, Gutters.smallHPadding, { width: width - 50, backgroundColor: Colors.white, borderRadius: 30 }]}>
          <Text style={[Fonts.titleTiny, Fonts.textCenter, Gutters.largeBMargin, { color: Colors.primary }]}>Add Materials</Text>

          <RNPickerSelect
            // placeholder={{}}
            placeholder={{ label: 'Select a Material'}}
            items={Materials}
            value={selectedMaterial}
            onValueChange={value => {
              updateMaterial(value)
            }}
            style={Common.pickerSelectStyles}
            // useNativeAndroidPickerStyle={false}
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

            <View style={[Layout.rowHSpaced]}>
              <Button mode='contained' color={Colors.error} style={[Gutters.largeTMargin, Layout.selfCenter, { width: '40%' }]} onPress={() => setShowModal(false)}
              >
                Cancel
              </Button>

              <Button mode='contained' color={Colors.primary} style={[Gutters.largeTMargin, Layout.selfCenter, { width: '55%' }]} onPress={() => addMaterial()}
              >
                Add Material
              </Button>

              
            </View>
          </>}

        </View>
      </Overlay>
      
    </View>
  )
}

export default MaterialRequest
