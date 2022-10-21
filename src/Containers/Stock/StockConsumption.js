import React, { useEffect, useState } from 'react'
import { ActivityIndicator, View, Text, FlatList, Dimensions, Platform } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome5'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { Brand } from '@/Components'
import { setDefaultTheme } from '@/Store/Theme'
import { navigateAndSimpleReset } from '@/Navigators/utils'
import { Overlay } from 'react-native-elements'
import RNPickerSelect from 'react-native-picker-select'
import { useDispatch, useSelector } from 'react-redux'
import { getStores, getMaterials, getStoreProjects } from '@/Store/User'
import { FAB, TextInput, Button } from 'react-native-paper'
import Request from '@/Requests/Core'
import { Config } from '@/Config'
import { ToastMessage } from '@/Utils'
import { MessageTypes } from '@/Theme/Variables'
import { TouchableOpacity } from 'react-native'
import moment from 'moment'

const { width, height } = Dimensions.get('window')

const StockConsumption = (props) => {
  const { Layout, Gutters, Fonts, common, Colors, Common } = useTheme()
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const Stores = useSelector(state => state.user.stores)
  const StoreProjects = useSelector(state => state.user.storeProjects)
  const Materials = useSelector(state => state.user.materials)
  const UserProject = useSelector(state => state.user.selectedProject)
  const LoginInfo = useSelector(state => state.user.loginInfo)

  const [selectedStore, setSelectedStore] = useState(StoreProjects[0]?.value)
  const [showModal, setShowModal] = useState(false)
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [refresh, setRefresh] = useState(false)

  const [selectedMaterial, setSelectedMaterial] = useState()
  const [selectMaterialObj, setSelectedMaterialObj] = useState()
  const [stock, setStock] = useState()
  const [usedQty, setUsedQty] = useState()
  const [scrapQty, setScrapQty] = useState()

  useEffect(() => {
    dispatch(getStores({ }))
    dispatch(getMaterials({}))
    dispatch(getStoreProjects({ project_structure_id: UserProject }))
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
    // if(qty > Number(stock)){
    //   setStock(0); setUsedQty(0); setScrapQty(0);
    //   setSelectedMaterial(null); setSelectedMaterialObj(null);
    //   setShowModal(false)
    // } else {
    // }
    if((Number(usedQty) + Number(scrapQty)) <= stock){
      let dt = [...list]
      dt.push({
        material: selectMaterialObj, 
        stock,
        used: usedQty,
        scrap: scrapQty
      })
      setList(dt)
      setStock(0); setUsedQty(0); setScrapQty(0);
      setSelectedMaterial(null); setSelectedMaterialObj(null);
      setShowModal(false)
      console.log("list.....", list)
    } else {
      setStock(0); setUsedQty(0); setScrapQty(0);
      setSelectedMaterial(null); setSelectedMaterialObj(null);
      setShowModal(false)
    }
  }

  const updateConsumption = () => {
    let dataArr = []
    list?.map((item,index) => {
      console.log("list item", item);
      dataArr.push({
        "material_id": item?.material?.material_id, //"1", 
        "quantity": item?.used, //"94.5", 
        "scrap": item?.scrap //"0.5"
      })
    })
    let paramObj = {
      "project_store_id": selectedStore, //"1", 
      "stock_consumption_date": moment(new Date()).format('YYYY-MM-DD'), // "2022-08-06", 
      "employee_id": LoginInfo?.employee_id, //"2", 
      "stock_consumption": dataArr
    }
    console.log("stock consumption update param", paramObj)
    Request({
      method: 'POST',
      url: Config.GET_DAILYSTOCK_PROJECTSTOREWISE,
      data: paramObj
    }).then(response => {
      console.log("stock consumption resp", response)
      if(response?.stock_consumption?.status == 1){
        ToastMessage(response.stock_consumption?.message, MessageTypes.success)
        props.navigation.goBack()
      } else {
        ToastMessage(response.stock_consumption?.message, MessageTypes.danger)
      }
    }).catch(error => {
      console.log("stock consumption error", error)
    })
  }

  return (
    <View style={[Layout.fill]}>
      <View style={[Gutters.regularHPadding, Gutters.regularTPadding]}>
        <Text style={[Fonts.titleTiny, Gutters.tinyBMargin, { color: Colors.primary }]}>Store</Text>
        <RNPickerSelect
          placeholder={{}}
          items={StoreProjects}
          value={selectedStore}
          onValueChange={value => {
            setSelectedStore(value)
            // getData()
          }}
          // useNativeAndroidPickerStyle={false}
          style={Common.pickerSelectStyles}
          Icon={() => Platform.OS == 'ios' ? (<FontAwesome name={'chevron-down'} size={20} color="gray" style={{ marginTop: 4 }}/>) : null}
        />
      </View>

      <FlatList
        data={list}
        keyExtractor={(item, index) => item + index}
        renderItem={({item,index}) => {
          return(
            <View key={index} style={[Gutters.smallHPadding, Gutters.smallVPadding, Gutters.smallTMargin, Gutters.smallHMargin, { backgroundColor: Colors.white, borderRadius: 10 }]}>
              <View style={Layout.rowHSpaced}>
                <Text style={[Fonts.titleTiny,Gutters.smallBMargin, Layout.fill, { color: Colors.primary }]}>{item?.material?.material_name} - {item?.material?.unit}</Text>

                <TouchableOpacity style={{ padding: 10 }}
                  onPress={() => {
                    const newArr = list.filter(obj => {
                      return obj?.material?.material_id !== item?.material?.material_id
                    })
                    setList(newArr)
                    setRefresh(!refresh)
                  }}
                >
                  <FontAwesome name={'trash'} color={Colors.error} size={16}/>
                </TouchableOpacity>
              </View>

              <View style={Layout.rowHSpaced}>
                <View style={Layout.center}>
                  <Text style={Fonts.textSmall}>Stock in Hand</Text>
                  <Text style={[Fonts.titleSmall,Gutters.tinyTMargin]}>{item?.stock}</Text>
                </View>

                <View style={Layout.center}>
                  <Text style={Fonts.textSmall}>Used</Text>
                  {/* <Text style={[Fonts.titleSmall,Gutters.tinyTMargin]}>{item?.used}</Text> */}
                  <TextInput
                    value={item?.used}
                    onChangeText={text => {
                      const index = list.findIndex(mat => mat?.material?.material_id === item?.material?.material_id)
                      list[index].used = text
                      setList(list)
                      setRefresh(!refresh)
                    }}
                    style={{ width:'100%', padding: 0, margin: 0, height: 40, textAlign: 'center' }}
                    theme={Common.paperTheme}
                    keyboardType={'number-pad'}
                  />
                </View>

                <View style={Layout.center}>
                  <Text style={Fonts.textSmall}>Scrap</Text>
                  {/* <Text style={[Fonts.titleSmall,Gutters.tinyTMargin]}>{item?.scrap}</Text> */}
                  <TextInput
                    value={item?.scrap}
                    onChangeText={text => {
                      const index = list.findIndex(mat => mat?.material?.material_id === item?.material?.material_id)
                      list[index].scrap = text
                      setList(list)
                      setRefresh(!refresh)
                    }}
                    style={{ width:'100%', padding: 0, margin: 0, height: 40, textAlign: 'center' }}
                    theme={Common.paperTheme}
                    keyboardType={'number-pad'}
                  />
                </View>
              </View>
            </View>
          )
        }}
      />

      {list?.length > 0 && 
        <Button mode='contained' color={Colors.primary} style={[ Gutters.smallBMargin, Layout.selfCenter, { width: '80%' }]} onPress={() => updateConsumption()}
        >
          Confirm
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
          <Text style={[Fonts.titleTiny, Fonts.textCenter, Gutters.largeBMargin, { color: Colors.primary }]}>Add Material Consumption</Text>

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
            <View style={[ Gutters.regularTMargin]}>
              <View style={[Layout.rowHSpaced]}>
                <Text style={[Fonts.textSmall]}>Unit - <Text style={Fonts.titleTiny}>{selectMaterialObj?.unit}</Text></Text>
                <Text>Stock in Hand - <Text style={Fonts.titleTiny}>{stock}</Text></Text>
              </View>

              <View style={[Layout.rowHSpaced, Gutters.regularTMargin]}>
                <View style={[Layout.center, Layout.fill, Gutters.tinyHMargin]}>
                  <Text style={Gutters.smallBMargin}>Used Qty</Text>
                  <TextInput
                    value={usedQty}
                    onChangeText={text => setUsedQty(text)}
                    style={{ width:'100%', padding: 0, margin: 0, height: 40, textAlign: 'center' }}
                    theme={Common.paperTheme}
                    keyboardType={'number-pad'}
                  />
                </View>

                <View style={[ Layout.center, Layout.fill, Gutters.tinyHMargin]}>
                  <Text style={Gutters.smallBMargin}>Scrap Qty</Text>
                  <TextInput
                    value={scrapQty}
                    onChangeText={text => setScrapQty(text)}
                    style={{ width:'100%', padding: 0, margin: 0, height: 40, textAlign: 'center' }}
                    theme={Common.paperTheme}
                    keyboardType={'number-pad'}
                  />
                </View>
              </View>
            </View>

            <View style={[Layout.rowHSpaced]}>
              <Button mode='contained' color={Colors.error} style={[Gutters.largeTMargin, Layout.selfCenter, { width: '30%' }]} onPress={() => setShowModal(false)}
              >
                Cancel
              </Button>

              <Button mode='contained' color={Colors.primary} style={[Gutters.largeTMargin, Layout.selfCenter, { width: '70%' }]} onPress={() => addMaterial()}
              >
                Add Consumption
              </Button>
            </View>
          </>}
        </View>
      </Overlay>
    </View>
  )
}

export default StockConsumption
