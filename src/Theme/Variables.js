/**
 * This file contains the application's variables.
 *
 * Define color, sizes, etc. here instead of duplicating them throughout the components.
 * That allows to change them more easily later on.
 */

/**
 * Colors
 */
export const Colors = {
  // Example colors:
  transparent: 'rgba(0,0,0,0)',
  inputBackground: '#FFFFFF',
  
  white: '#ffffff',
  whiteOpacity: 'rgba(255, 255, 255,0.5)',

  light_grey: '#CDCECE',
  grey: '#979797',

  text: '#212529',
  primary: '#256298',//'#316993', 
  secondary: '#E14032',
  success: '#28a745',
  error: '#dc3545',

  background: "rgb(242, 242, 242)", 
  border: "rgb(216, 216, 216)", 
  card: "rgb(255, 255, 255)",
  notification: "rgb(255, 59, 48)", 
  text1: "rgb(28, 28, 30)",
  red: '#FF3535'
}

export const NavigationColors = {
  primary: Colors.primary,
}

/**
 * FontSize
 */
export const FontSize = {
  tiny: 12,
  small: 16,
  regular: 20,
  large: 40,
}

/**
 * Metrics Sizes
 */
const tiny = 5 // 10
const small = tiny * 2 // 10
const regular = tiny * 3 // 15
const large = regular * 2 // 30
export const MetricsSizes = {
  tiny,
  small,
  regular,
  large,
}

export const MessageTypes = {
  success: "success", //green
  warning: "warning", //orange
  danger: "danger", //red
  info: "info", //blue
  default: "default", //gray
}

export default {
  Colors,
  NavigationColors,
  FontSize,
  MetricsSizes,
  MessageTypes
}
