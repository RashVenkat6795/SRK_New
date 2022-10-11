import React, { useEffect, useState } from 'react'
import { ActivityIndicator, View, Text, ScrollView, FlatList } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { Brand } from '@/Components'
import { setDefaultTheme } from '@/Store/Theme'
import { navigate, navigateAndSimpleReset } from '@/Navigators/utils'
import { TextInput, Button } from 'react-native-paper'
import { Config } from '@/Config'
import Request from '@/Requests/Core'
import { useSelector, useDispatch } from 'react-redux'
import { isObject } from 'lodash'
import { getStores, getStoreProjects } from '@/Store/User'
import { BottomSheet, Overlay } from 'react-native-elements'

const ReceiveMaterial = () => {
  const { Layout, Gutters, Fonts, Colors } = useTheme()
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const UserProject = useSelector(state => state.user.selectedProject)

  const [listDt, setListDt] = useState([])

  useEffect(() => {
  },[])

  return (
    <View style={[Layout.fill]}>
      <View style={[Gutters.smallHPadding, Gutters.regularVMargin]}>
        <View style={[Layout.row,{ justifyContent:'space-evenly' }]}>

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

export default ReceiveMaterial
