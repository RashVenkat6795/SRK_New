import { showMessage, hideMessage } from 'react-native-flash-message'
import { FontSize, Colors } from '@/Theme/Variables'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { Platform, PermissionsAndroid } from 'react-native'

export const ToastMessage = (message, type, position, duration) => {
  showMessage({
    message,
    type,
    animated: true,
    position: position || 'bottom',
    textStyle: {fontSize: FontSize.small, fontWeight: '600', color: Colors.white, alignItems: 'center', alignContent:'center'},
    duration: duration || 1850
  })
}

export const CaptureImage = async () => {
  let options = {
    storageOptions: { skipBackup: true, path: 'images' },
    includeBase64: true
  }

  if(Platform.OS == 'android'){
    const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA,);
    if(!hasPermission){
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
    } 
  }

  const promise = new Promise(async (resolve, reject) => {
    try {
      launchCamera(options, (res) => {
        console.log("res", res)
        if (res.didCancel) {
          reject({ message: res.didCancel })
        } else if (res.error) {
          reject({ message: res.error })
        } else {
          const source = { uri: res.uri };
          let dataObj = {
            filePath: res,
            fileData: res.data,
            fileUri: res.uri
          }
          resolve(dataObj)
        }
      })
    } catch (error) {
      reject({ message: error })
    }
  })

  return promise
}

