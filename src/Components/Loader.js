import React from 'react'
import { View, Modal, Text, ActivityIndicator } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'

const Loader = ({ height, width, mode }) => {
  const { Layout, Images, Colors, Fonts, Gutters, Common } = useTheme()
  const { t, i18n } = useTranslation()

  return (
    <Modal animationType="fade" transparent={true} onRequestClose={() => null}>
      <View style={[Layout.fill, Layout.center, { backgroundColor: Colors.blackOpacity_60 }]}>
        <ActivityIndicator size={'large'} color={Colors.primary}/>
        <Text style={[Fonts.titleTiny, Gutters.regularTMargin, { color: Colors.primary }]}>Loading</Text>
      </View>
    </Modal>
  )
}

export default Loader
