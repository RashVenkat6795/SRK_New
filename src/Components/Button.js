import * as React from 'react'
import { useTheme } from '@/Hooks'
import { TextInput, Button } from 'react-native-paper'

const MyButton = React.forwardRef(
  ({ label, value, mode, style, disabled, onBtnPress, props, error, dense, autoCapitalize, defaultValue, bgColor, btnstyle },ref) => {

    const { Colors, Common, Layout, Gutters } = useTheme()

    return (
      <>
        <Button 
          mode={'contained'}
          dark
          onPress={() => onBtnPress()}
          buttonColor={Colors.primary}
          color={Colors.primary}
          style={btnstyle}
          // theme={[Common.paperTheme,{ colors:{ background: Colors.primary } }]}
        >
          {label}
        </Button>
      </>
    )
  },
)

export default MyButton
