import 'react-native-gesture-handler'
import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { store, persistor } from '@/Store'
import { useTheme } from '@/Hooks'
import ApplicationNavigator from '@/Navigators/Application'
import { Provider as PaperProvider } from 'react-native-paper'
import { Colors } from './Theme/Variables'

import './Translations'


const App = () => {
  const primary_theme = {
    roundness: 2,
    version: 3,
    colors: {
      primary: Colors.primary, //'#3498db',
      secondary: '#f1c40f',
      tertiary: '#a1b2c3'
    },
  };

  return(
    // <PaperProvider theme={primary_theme}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ApplicationNavigator />
        </PersistGate>
      </Provider>
    // </PaperProvider>
  )
}

export default App
