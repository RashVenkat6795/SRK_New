import React, { useEffect, useState } from 'react'
import { ActivityIndicator, View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { Button, TextInput } from 'react-native-paper'
import { Brand } from '@/Components'
import { setDefaultTheme } from '@/Store/Theme'
import { navigateAndSimpleReset, navigate } from '@/Navigators/utils'

const WorkReport = () => {
  const { Layout, Gutters, Fonts, Colors } = useTheme()
  const { t } = useTranslation()

  return (
    <View style={[Layout.fill, Gutters.smallHPadding]}>
      {/* <View> */}
        <TouchableOpacity 
          style={[ Gutters.regularHPadding, Gutters.regularVPadding, Gutters.regularTMargin, Styles.boxShadow, { backgroundColor: Colors.white }]}
          onPress={() => navigate('MonthlyReport')}
        >
          <Text style={Fonts.textSmall}>Monthly Work Report</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[Gutters.regularHPadding, Gutters.regularVPadding, Gutters.regularTMargin, Styles.boxShadow, { backgroundColor: Colors.white }]}
          onPress={() => navigate('DailyReport')}
        >
          <Text style={Fonts.textSmall}>Daily Work Report</Text>
        </TouchableOpacity>
      {/* </View> */}

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

export default WorkReport
