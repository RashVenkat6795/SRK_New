import React, { useEffect } from 'react'
import { ActivityIndicator, View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { Brand } from '@/Components'
import { setDefaultTheme } from '@/Store/Theme'
import { navigate, navigateAndSimpleReset } from '@/Navigators/utils'
import { TextInput, Button } from 'react-native-paper'

const Stock = () => {
  const { Layout, Gutters, Fonts, Colors } = useTheme()
  const { t } = useTranslation()

  useEffect(() => {
  })

  return (
    <View style={[Layout.fill]}>
      <ScrollView style={Layout.fill} contentContainerStyle={[Gutters.smallHPadding, Gutters.largeVPadding]}>
        <TouchableOpacity 
          style={[Layout.fill, Gutters.regularHPadding, Gutters.regularVPadding, Gutters.regularTMargin, Styles.boxShadow, { backgroundColor: Colors.white }]}
          onPress={() => navigate('StockList')}
        >
          <Text style={Fonts.textSmall}>Stock List</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[Layout.fill, Gutters.regularHPadding, Gutters.regularVPadding, Gutters.regularTMargin, Styles.boxShadow, { backgroundColor: Colors.white }]}
          onPress={() => navigate('MaterialRequest')}
        >
          <Text style={Fonts.textSmall}>Material Request</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[Layout.fill, Gutters.regularHPadding, Gutters.regularVPadding, Gutters.regularTMargin, Styles.boxShadow, { backgroundColor: Colors.white }]}
          onPress={() => navigate('MaterialRequestStatus')}
        >
          <Text style={Fonts.textSmall}>Material Request Status</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[Layout.fill, Gutters.regularHPadding, Gutters.regularVPadding, Gutters.regularTMargin, Styles.boxShadow, { backgroundColor: Colors.white }]}
          onPress={() => navigate('StockConsumption')}
        >
          <Text style={Fonts.textSmall}>Stock Consumption</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[Layout.fill, Gutters.regularHPadding, Gutters.regularVPadding, Gutters.regularTMargin, Styles.boxShadow, { backgroundColor: Colors.white }]}
          onPress={() => navigate('ConsumptionHistory')}
        >
          <Text style={Fonts.textSmall}>Consumption History</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[Layout.fill, Gutters.regularHPadding, Gutters.regularVPadding, Gutters.regularTMargin, Styles.boxShadow, { backgroundColor: Colors.white }]}
          onPress={() => navigate('StockTransfer')}
        >
          <Text style={Fonts.textSmall}>Stock Transfer</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  )
}

const Styles = StyleSheet.create({
  boxShadow: {
    shadowColor: 'grey',
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  }
})

export default Stock
