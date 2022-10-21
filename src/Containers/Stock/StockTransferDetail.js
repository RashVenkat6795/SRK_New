import React, { useEffect, useState } from 'react'
import { ActivityIndicator, View, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { Brand, Loader } from '@/Components'
import { setDefaultTheme } from '@/Store/Theme'
import { navigate, navigateAndSimpleReset } from '@/Navigators/utils'
import { TextInput, Button } from 'react-native-paper'
import { Config } from '@/Config'
import Request from '@/Requests/Core'
import { useSelector, useDispatch } from 'react-redux'
import { isObject } from 'lodash'
import FontAwesome from 'react-native-vector-icons/FontAwesome5'

const StockTransferDetail = (props) => {
  const { Layout, Gutters, Fonts, Colors } = useTheme()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const isFocused = useIsFocused()

  const Details = props.route.params.item
  console.log("Details", Details);
  const UserProject = useSelector(state => state.user.selectedProject)

  const [listDt, setListDt] = useState([])
  const [loading, setLoading] = useState(false)
  const [receiveMode, setReceiveMode] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState()
  const [data, setData] = useState()

  useEffect(() => {
    getData()
  },[])

  // useEffect(() => {
  //   props.navigation.addListener('focus', () => {
  //     console.log("in stocktransfer,........")
  //     getData()
  //   })
  // },[props.navigation])

  const getData = () => {
    setLoading(true)
    let param = {
      stock_transfer_id: Details?.stock_transfer_id,
    }
    Request({
      method: 'POST',
      url: Config.STOCK_TRANSFER_VIEW,
      data: param
    }).then(response => {
      console.log("stocktransfer details", response)
      if(response){
        setLoading(false)
        setData(response)
      }
    }).catch(error => {
      console.log("stocktransfer details error", error)
      setLoading(false)
    })
  }

  return (
    <View style={[Layout.fill]}>
      {loading && <Loader/>}
      <Text style={[Fonts.titleTiny, Layout.selfEnd, Gutters.smallRMargin, Gutters.smallVMargin, { color: Colors.primary }]}>{data?.stock_transfer?.stock_Transfer_date}</Text>
      <View style={[Layout.rowHSpaced]}>
        <View style={[Layout.fill, Layout.center]}>
          <Text>From</Text>
          <Text style={Fonts.titleTiny}>{data?.stock_transfer?.from_location}</Text>
        </View>

        <View style={[Layout.fill, Layout.center]}>
          <Text>To</Text>
          <Text style={Fonts.titleTiny}>{data?.stock_transfer?.to_location}</Text>
        </View>
      </View>
      <FlatList
        data={data?.stock_transfer_details}
        keyExtractor={(item, index) => item + index}
        renderItem={({item,index}) => {
          return(
            <View key={index} style={[Gutters.smallHPadding, Gutters.smallVPadding, Gutters.smallTMargin, Gutters.smallHMargin, { backgroundColor: Colors.white, borderRadius: 10 }]}>
              <Text style={[Fonts.titleTiny]}>{item.material_name}</Text>
              <View style={[Layout.rowHSpaced, Gutters.smallTMargin]}>
                <View style={[Layout.fill, Layout.center]}>
                  <Text style={Fonts.textSmall}>Transfered Qty</Text>
                  <Text style={[Fonts.titleTiny]}>{item?.transfer_qty}</Text>
                </View>
                <View style={[Layout.fill, Layout.center]}>
                  <Text style={Fonts.textSmall}>Received Qty</Text>
                  <Text style={[Fonts.titleTiny]}>{item?.transfer_qty}</Text>
                </View>
              </View>
            </View>
          )
        }}
      />
    </View>
  )
}

export default StockTransferDetail
