import React, { useEffect, useState } from 'react'
import { ActivityIndicator, View, Text, FlatList, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { Brand } from '@/Components'
import { setDefaultTheme } from '@/Store/Theme'
import { navigateAndSimpleReset } from '@/Navigators/utils'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { useDispatch } from 'react-redux'
import Request from '@/Requests/Core'
import { Config } from '@/Config'

const MaterialRequestDetail = (props) => {
  const { Layout, Gutters, Fonts } = useTheme()
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const Details = props?.route?.params?.item
  const [Data, setData] = useState()

  useEffect(() => {
    getDetails()
  },[])

  const getDetails = () => {
    Request({
      method: 'POST',
      url: Config.MATERIAL_REQUEST_VIEW,
      data: {
        material_request_id: Details?.material_request_id
      }
    }).then(response => {
      console.log("getDetails resp", response)
      if(response){
        setData(response)
      }
    }).catch(error => {
      console.log("get details error", error)
    })
  }

  return (
    <View style={[Layout.fill, Gutters.smallHPadding, Gutters.regularVPadding]}>
      <View style={[Layout.row, Layout.justifyContentBetween, Gutters.smallHPadding, Gutters.regularTMargin]}>
        <View style={{ flex: 0.5 }}>
          <Text style={[Fonts.titleTiny,{ color: Colors.primary }]}>Date</Text>
          <Text style={[Fonts.textSmall, Gutters.smallTMargin, { color: Colors.primary }]}>{Details?.material_request_date}</Text>
        </View>

        <View style={[Layout.fill, Layout.center]}>
          <Text style={[Fonts.titleTiny, Gutters.tinyBMargin, { color: Colors.primary }]}>Contractor</Text>
          <Text style={[Fonts.textSmall, Gutters.tinyTMargin, { color: Colors.primary }]}>{Details?.contractor_name}</Text>
        </View>
      </View>

      {Data?.material_request_details?.length > 0 ?
        <View style={Gutters.largeTMargin}>
          <View style={[Layout.row, Gutters.smallVPadding, { borderWidth: 1, borderColor: Colors.grey }]}>
            <Text style={[Fonts.titleTiny, { flex: 2, color: Colors.primary }]}>Material</Text>
            <Text style={[Fonts.titleTiny, { flex: 1, color: Colors.primary }]}>Qty</Text>
            <Text style={[Fonts.titleTiny, Fonts.textCenter, { flex: 1, color: Colors.primary }]}>Unit</Text>
            {/* <Text style={[Fonts.titleTiny, Fonts.textCenter, { flex: 1, color: Colors.primary }]}>Status</Text> */}
          </View>
          <FlatList
            data={Data?.material_request_details}
            keyExtractor={(item, index) => item + index}
            renderItem={({item,index}) => {
              return(
                <View style={[Layout.row, Gutters.smallVPadding, { borderWidth: StyleSheet.hairlineWidth, borderColor: Colors.grey }]}>
                  <Text style={[Fonts.titleTiny, { flex: 2 }]}>{item?.material_name}</Text>
                  <Text style={[Fonts.titleTiny, { flex: 1 }]}>{item?.approved_quantity}</Text>
                  <Text style={[Fonts.titleTiny, Fonts.textCenter, { flex: 1 }]}>{item?.unit}</Text>
                  {/* <Text style={[Fonts.titleTiny, Fonts.textCenter, { flex: 1 }]}>Status</Text> */}
                </View>
              )
            }}
          />
        </View>
      :
        <View style={[Layout.fill, Layout.colCenter]}>
          <Text style={Fonts.textRegular}>No Details Found</Text>
        </View>
      }

    </View>
  )
}

export default MaterialRequestDetail
