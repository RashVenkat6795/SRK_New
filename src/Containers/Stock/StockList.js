import React, { useEffect, useState } from 'react'
import { ActivityIndicator, View, Text, ScrollView, FlatList, Platform } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome5'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { Brand, Loader } from '@/Components'
import { setDefaultTheme } from '@/Store/Theme'
import { navigateAndSimpleReset } from '@/Navigators/utils'
import RNPickerSelect from 'react-native-picker-select'
import { TextInput, Button } from 'react-native-paper'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { getStores } from '@/Store/User'
import { Config } from '@/Config'
import Request from '@/Requests/Core'

const StockList = () => {
  const { Layout, Gutters, Fonts, Colors, Common } = useTheme()
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const Stores = useSelector(state => state.user.stores)
  const UserProject = useSelector(state => state.user.selectedProject)

  const [selectedStore, setSelectedStore] = useState(Stores[0]?.id)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])

  useEffect(() => {
    dispatch(getStores({ }))
    getData()
  },[])

  const getData = () => {
    setLoading(true)
    let param_obj = {
      "project_structure_id": UserProject,
      "store_id": selectedStore
    }
    // console.log("get project stock param", param_obj)
    Request({
      method: 'POST',
      url: Config.GET_PROJECT_STOCK,
      data: param_obj
    }).then(resp => {
      // console.log("get project stock resp", resp)
      if(resp?.material_stock){
        setData(resp?.material_stock)
      }
      setLoading(false)
    }).catch(error => {
      console.log("get project stock error", error)
      setLoading(false)
    })
  }

  return (
    <View style={[Layout.fill]}>
      {loading && <Loader/>}
      <View style={[Layout.row, Layout.justifyContentBetween, Gutters.smallHPadding, Gutters.regularTMargin]}>
        <View style={{ flex: 0.5 }}>
          <Text style={[Fonts.titleTiny,{ color: Colors.primary }]}>Date</Text>
          <Text style={[Fonts.textSmall, Gutters.smallTMargin, { color: Colors.primary }]}>{moment(new Date()).format('DD/MM/YYYY')}</Text>
        </View>

        <View style={[Layout.fill, Layout.center]}>
          <Text style={[Fonts.titleTiny, Gutters.tinyBMargin, { color: Colors.primary }]}>Store</Text>
          <RNPickerSelect
            placeholder={{}}
            items={Stores}
            value={selectedStore}
            onValueChange={value => {
              setSelectedStore(value)
              getData()
            }}
            // useNativeAndroidPickerStyle={false}
            style={Common.pickerSelectStyles}
            Icon={() => Platform.OS == 'ios' ? (<FontAwesome name={'chevron-down'} size={20} color="gray" style={{ marginTop: 4 }}/>) : null}
          />
        </View>
      </View>

      <View style={[Gutters.largeTMargin, Gutters.smallHPadding]}>
        <View style={[Layout.row, Gutters.smallVPadding, { borderWidth: 1, borderColor: Colors.grey }]}>
          <Text style={[Fonts.titleTiny, { flex: 1.8, color: Colors.primary, paddingLeft: 14 }]}>Material Name</Text>
          <Text style={[Fonts.titleTiny, Fonts.textCenter, { flex: 1, color: Colors.primary }]}>Stock In Hand</Text>
          <Text style={[Fonts.titleTiny, Fonts.textCenter, { flex: 0.6, color: Colors.primary }]}>Unit</Text>
        </View>
        <FlatList
          data={data}
          keyExtractor={(item, index) => item + index}
          renderItem={({item,index}) => {
            return(
              <View style={[Layout.row, Gutters.smallTMargin]}>
                <Text style={[Fonts.textSmall, { flex: 2 }]}>{item.material_name}</Text>
                <Text style={[Fonts.textSmall, Fonts.textCenter, { flex: 0.6 }]}>{item?.stock}</Text>
                <Text style={[Fonts.textSmall, Fonts.textCenter, { flex: 0.6 }]}>{item?.unit}</Text>
              </View>
            )
          }}
        />
      </View>
    </View>
  )
}

export default StockList
