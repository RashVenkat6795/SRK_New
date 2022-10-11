import React, { useEffect } from 'react'
import { ActivityIndicator, View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { Brand } from '@/Components'
import { setDefaultTheme } from '@/Store/Theme'
import { navigateAndSimpleReset } from '@/Navigators/utils'

const ProjectStructure = () => {
  const { Layout, Gutters, Fonts } = useTheme()
  const { t } = useTranslation()

  useEffect(() => {
  })

  return (
    <View style={[Layout.fill, Layout.colCenter]}>
      <Text style={Fonts.textCenter}>{'Project Structure'}</Text>
    </View>
  )
}

export default ProjectStructure
