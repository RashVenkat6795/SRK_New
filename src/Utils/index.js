import { showMessage, hideMessage } from 'react-native-flash-message'
import { FontSize, Colors } from '@/Theme/Variables'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { Platform, PermissionsAndroid, Linking, Alert, ToastAndroid } from 'react-native'

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

export const hasPermissionIOS = async () => {
  const openSetting = () => {
    Linking.openSettings().catch(() => {
      Alert.alert('Unable to open settings');
    });
  };
  const status = await Geolocation.requestAuthorization('whenInUse');

  if (status === 'granted') {
    return true;
  }

  if (status === 'denied') {
    Alert.alert('Location permission denied');
  }

  if (status === 'disabled') {
    Alert.alert(
      `Turn on Location Services to allow Vidhyuth Logistics to determine your location.`,
      '',
      [
        { text: 'Go to Settings', onPress: openSetting },
        // { text: "Don't Use Location", onPress: () => {} },
      ],
    );
  }

  return false;
};

export const hasLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    const hasPermission = await hasPermissionIOS();
    return hasPermission;
  }

  if (Platform.OS === 'android' && Platform.Version < 23) {
    return true;
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG );
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG );
  }

  return false;
};