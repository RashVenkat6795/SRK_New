/**
 * This file defines the base application styles.
 *
 * Use it to define generic component styles (e.g. the default text styles, default button styles...).
 */
import { StyleSheet } from 'react-native'
import buttonStyles from './components/Buttons'

/**
 *
 * @param Theme can be spread like {Colors, NavigationColors, Gutters, Layout, Common, ...args}
 * @return {*}
 */

export default function ({ Colors, Fonts, Layout, Gutters, ...args }) {
  return {
    // button: buttonStyles({ Colors, ...args }),
    ...StyleSheet.create({
      backgroundPrimary: {
        backgroundColor: Colors.primary,
      },
      backgroundReset: {
        backgroundColor: Colors.transparent,
      },
      textInput: {
        borderWidth: 1,
        borderColor: Colors.text,
        backgroundColor: Colors.inputBackground,
        color: Colors.text,
        minHeight: 50,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
      },

      /* Common */
      container: {
        ...Layout.fill,
        // backgroundColor: Colors.white
      },
      paperTheme: {
        colors:{
          primary: Colors.primary,
          placeholder: Colors.light_grey,
          secondary: Colors.primary,
          outline: Colors.primary,
          background: Colors.white
        }
      },
      paperTheme1: {
        colors:{
          primary: Colors.primary,
          placeholder: Colors.light_grey,
          secondary: Colors.primary,
          outline: Colors.primary,
          backgroundColor: Colors.white,
        }
      },
      pickerSelectStyles: {
        inputIOS: {
          fontSize: 16,
          paddingVertical: 12,
          paddingHorizontal: 10,
          borderWidth: 1,
          borderColor: 'gray',
          borderRadius: 4,
          color: 'black',
          paddingRight: 30, // to ensure the text is never behind the icon
        },
        borderWidth: 1,
        inputAndroid: {
          fontSize: 16,
          paddingHorizontal: 10,
          paddingVertical: 8,
          borderWidth: 1,
          borderColor: 'gray',
          borderRadius: 8,
          color: 'black',
          paddingRight: 30, // to ensure the text is never behind the icon
        },
        iconContainer: { 
          top: 10, right: 12 
        }
      },
      shadow: {
        shadowColor: '#2D9CDB',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },

      boxShadow: {
        shadowColor: 'grey',
        shadowOffset: { width: -2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },

      fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
      },

      fab1: {
        position: 'absolute',
        margin: 16,
        right: 70,
        bottom: 0,
      },

      /* Stock List */
      tableCell: {
        // ...Fonts.titleTiny
      }
    }),
  }
}
