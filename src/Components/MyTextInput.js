import * as React from 'react'
import { useTheme } from '@/Hooks'
import { TextInput } from 'react-native-paper'

const MyTextInput = React.forwardRef(
  ({ label, value, mode, style, disabled, onChange, input, onBlur, onFocus, props, error, placeholder, dense, multiline, autoCapitalize, defaultValue, keyboardType, secureTextEntry, bgColor, primaryColor, placeholderColor, autoFocus, maxLength },ref) => {

    const { Colors } = useTheme()

    return (
      <>
        <TextInput
          ref={ref}
          label={label}
          value={value}
          onChangeText={text => onChange(text)}
          mode={mode || 'outlined'}
          keyboardType={keyboardType || 'default'}
          returnKeyType={'done'}
          style={style}
          underlineColor={Colors.primary || Colors.white}
          outlineColor={Colors.primary || Colors.white}
          selectionColor={Colors.primary || Colors.primary}
          disabled={disabled}
          maxLength={maxLength}
          error={error}
          placeholder={placeholder}
          onBlur={onBlur}
          onFocus={onFocus}
          theme={{
            colors: {
              primary: Colors.primary || Colors.white,
              // underlineColor: DualTheme.secondary,
              background: bgColor || Colors.white,
              text: Colors.black,
              placeholder: placeholderColor || Colors.placeholder
            },
          }}
          dense={dense || true}
          multiline={multiline || false}
          autoCapitalize={autoCapitalize || 'none'}
          defaultValue={defaultValue || ''}
          secureTextEntry={secureTextEntry || false}
          {...props}
          autoFocus={autoFocus||false}
        />
        {/* 
          <View style={{ paddingHorizontal: 15 }}>
            {error && <Text style={{ color: 'red' }}>{error}</Text>}
          </View> 
        */}
      </>
    )
  },
)

export default MyTextInput
