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

const StockTransfer = (props) => {
  const { Layout, Gutters, Fonts, Colors } = useTheme()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const isFocused = useIsFocused()

  const UserProject = useSelector(state => state.user.selectedProject)

  const [listDt, setListDt] = useState([])
  const [loading, setLoading] = useState(false)
  const [receiveMode, setReceiveMode] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState()

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
    // navigate('ReceiveMaterial')
    setReceiveMode(true)
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
            <TouchableOpacity key={index} 
              style={[Gutters.smallHPadding, Gutters.smallVPadding, Gutters.smallTMargin, Gutters.smallHMargin, { backgroundColor: Colors.white, borderRadius: 10 }]}
              onPress={() => navigate('StockTransferDetail', { item })}
            >
              <View style={[Layout.rowHSpaced]}>
                <View style={[Layout.rowHCenter]}>
                {(receiveMode && item?.transfer_status == "Transit") ? 
                  <TouchableOpacity onPress={() => setSelectedRecord(item)} style={Gutters.smallRMargin}>
                    <FontAwesome name={selectedRecord?.stock_transfer_id == item?.stock_transfer_id ? 'dot-circle' : 'circle'} color={Colors.primary} size={16}/>
                  </TouchableOpacity>
                : null}
                  <Text style={[Fonts.titleTiny]}>{item?.stock_transfer_date}</Text>
                </View>
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

              {(selectedRecord?.stock_transfer_id == item?.stock_transfer_id && item?.transfer_status == "Transit") &&
                <TouchableOpacity 
                  style={[Layout.selfEnd, { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary, alignItems:'center', justifyContent:'center' }]}
                  onPress={() => navigate('ReceiveMaterial', { item })}
                >
                  <FontAwesome name={'arrow-right'} color={Colors.white} size={22}/>
                </TouchableOpacity>
              }
            </TouchableOpacity>
          )
        }}
      />
    </View>
  )
}

export default StockTransfer
