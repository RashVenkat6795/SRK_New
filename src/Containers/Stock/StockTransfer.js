import React, { useEffect, useState } from 'react'
import { ActivityIndicator, View, Text, ScrollView, FlatList } from 'react-native'
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

const StockTransfer = (props) => {
  const { Layout, Gutters, Fonts, Colors } = useTheme()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const isFocused = useIsFocused()

  const UserProject = useSelector(state => state.user.selectedProject)

  const [listDt, setListDt] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // getData()
  },[])

  useEffect(() => {
    
    props.navigation.addListener('focus', () => {
      console.log("in stocktransfer,........")
      getData()
    })
  },[props.navigation])

  const getData = () => {
    setLoading(true)
    let param = {
      project_structure_id: UserProject,
    }
    Request({
      method: 'POST',
      url: Config.STOCK_TRANSFER,
      data: param
    }).then(response => {
      console.log("stocktransfer list", response)
      if(response?.stock_transfer_summary?.status == '1'){
        let list_data = []
        let dt = Object.values(response?.stock_transfer_summary)
        dt.map((item,index) => {
          if(isObject(item)){
            list_data.push(item)
          }
        })
        // response?.stock_transfer_summary?.data = list_data
        setListDt(list_data)
        setLoading(false)
      }
    }).catch(error => {
      console.log("stocktransfer error", error)
      setLoading(false)
    })
  }

  const sendAction = () => {
    navigate('SendMaterial')
  }

  const receiveAction = () => {
    navigate('ReceiveMaterial')
  }

  return (
    <View style={[Layout.fill]}>
      {loading && <Loader/>}
      <View style={[Gutters.smallHPadding, Gutters.regularVMargin]}>
        {/* <Text style={[Fonts.titleTiny,{ color: Colors.primary }]}>Stock On Date {'10/08/2000'}</Text> */}

        <View style={[Layout.row,{ justifyContent:'space-evenly' }]}>
          <Button mode='contained' color={Colors.primary} onPress={() => sendAction()} style={{ borderRadius: 30 }}>
            Send
          </Button>

          <Button mode='contained' color={Colors.primary} onPress={() => receiveAction()} style={{ borderRadius: 30 }}>
            Receive
          </Button>
        </View>
      </View>

      <FlatList
        data={listDt}
        keyExtractor={(item, index) => item + index}
        renderItem={({item,index}) => {
          return(
            <View key={index} style={[Gutters.smallHPadding, Gutters.smallVPadding, Gutters.smallTMargin, Gutters.smallHMargin, { backgroundColor: Colors.white, borderRadius: 10 }]}>
              <View style={[Layout.rowHSpaced]}>
                <Text style={[Fonts.titleTiny]}>{item?.stock_transfer_date}</Text>
                <Text style={[Fonts.titleTiny,{ color: Colors.primary }]}>{item?.transfer_status}</Text>
              </View>
              <View style={[Layout.rowHSpaced, Gutters.smallTMargin]}>
                <View style={[Layout.fill, Layout.center]}>
                  <Text style={{ color: Colors.grey }}>From</Text>
                  <Text style={[Layout.fill, Gutters.tinyHMargin, Gutters.tinyTMargin, Fonts.textSmall]}>{item?.from_place}</Text>
                </View>

                <View style={[Layout.fill, Layout.center]}>
                  <Text style={{ color: Colors.grey }}>To</Text>
                  <Text style={[Layout.fill, Gutters.tinyHMargin, Gutters.tinyTMargin, Fonts.textSmall]}>{item?.to_place}</Text>
                </View>
              </View>
            </View>
          )
        }}
      />
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

export default StockTransfer
