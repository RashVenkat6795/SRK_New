import React, { useEffect, useState, createRef } from 'react'
import { ActivityIndicator, View, Text, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { Brand } from '@/Components'
import { setDefaultTheme } from '@/Store/Theme'
import FontAwesome from 'react-native-vector-icons/FontAwesome5'
import { TextInput, Button } from 'react-native-paper'
import PagerView from 'react-native-pager-view';
import { useDispatch, useSelector } from 'react-redux'
import { getProfileDetails, setAuth } from '@/Store/User'
import { Config } from '@/Config'
import Request from '@/Requests/Core'
import { Overlay, CheckBox } from 'react-native-elements'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { ToastMessage } from '@/Utils'
import { MessageTypes } from '@/Theme/Variables'
import FastImage from 'react-native-fast-image'

const Profile = () => {
  const { Layout, Gutters, Fonts, Colors } = useTheme()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const ViewPager = createRef()
  const { width, height } = Dimensions.get('window') 

  const LoginInfo = useSelector(state => state.user.loginInfo)
  const Profile = useSelector(state => state.user.profileDetails)

  const [name, setName] = useState(Profile?.name)
  const [email, setEmail] = useState(Profile?.email_id)
  const [phone, setPhone] = useState(Profile?.present_mobile_no)
  const [address, setAddress] = useState(Profile?.present_address)
  const [profImage, setProfImage] = useState(Profile?.profile_image)
  const [refresh, setRefresh] = useState(false)

  const [oldpwd, setOldPwd] = useState('')
  const [newpwd, setNewPwd] = useState('')
  const [confpwd, setConfPwd] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [showMsg, setShowMsg] = useState(false)
  const [showMsg1, setShowMsg1] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [mode, setMode] = useState(null)
  const [loading, setLoading] = useState(false)

  let options = {
    storageOptions: { skipBackup: true, path: 'images' },
    includeBase64: true
  }

  useEffect(() => {
    dispatch(getProfileDetails({ "employee_id": LoginInfo?.employee_id }))
  },[])

  const onSegmentButtonSelected = (index) => {
    if (activeIndex != index) {
      setActiveIndex(index)
      ViewPager?.current?.setPage(index)
    }
  }


  const logoutAction = () => {
    dispatch(setAuth({ login: false }))
  }

  const profileUpdateAction = () => {
    setLoading(true)
    let param_obj = {
      "employee_id": LoginInfo?.employee_id,
      "name": name,
      "present_address": address, 
      "email_id": email, 
      "present_mobile_no": phone,
      "profile_image": ''
    }
    console.log("profile update params", param_obj);
    Request({
      method: 'POST',
      url: Config.UPDATE_PROFILE,
      data: param_obj
    }).then(response => {
      console.log("profile update response", response)
      setLoading(false)
      dispatch(getProfileDetails({ "employee_id": LoginInfo?.employee_id }))
      setRefresh(!refresh)
    }).catch(error => {
      console.log("profile update error", error)
      setLoading(false)
    })
  }

  const passwordUpdateAction = () => {
    if(oldpwd && newpwd && confpwd){
      if(newpwd == confpwd){
        let param_obj = {
          "employee_id": LoginInfo?.employee_id, 
          "old_password": oldpwd, 
          "new_password": newpwd,
          "confirm_password": confpwd
        }
        Request({
          method: 'POST',
          url: Config.CHANGE_PASSWORD,
          data: param_obj
        }).then(response => {
          console.log("password update resp", response)
          if(response?.profile?.status == '1'){
            ToastMessage(response?.profile?.message, MessageTypes.success)
            dispatch(setAuth({ isLoggedIn: false, loginInfo: null }))
          } else {
            ToastMessage(response?.profile?.message, MessageTypes.danger)
          }
        }).catch(error => {
          console.log("password update error", error)
        })
      } else {
        setShowMsg(true)
      }
    } else {
      setShowMsg1(true)
    }
  }

  const renderProfile = () => {
    return(
      <View style={Layout.fill}>
        <TextInput
          mode={'flat'}
          left={<TextInput.Icon icon="account" color={Colors.primary}/>}
          label={'Name'}
          value={name}
          onChangeText={text => setName(text)}
          style={Gutters.largeTMargin}
          theme={{ colors: { primary: Colors.primary } }}
        />

        <TextInput
          mode={'flat'}
          left={<TextInput.Icon icon="email" color={Colors.primary}/>}
          label={'Email'}
          value={email}
          onChangeText={text => setEmail(text)}
          style={Gutters.largeTMargin}
          theme={{ colors: { primary: Colors.primary } }}
        />

        <TextInput
          mode={'flat'}
          left={<TextInput.Icon icon="phone" color={Colors.primary}/>}
          label={'Phone number'}
          value={phone}
          onChangeText={text => setPhone(text)}
          style={Gutters.largeTMargin}
          theme={{ colors: { primary: Colors.primary } }}
        />

        <TextInput
          mode={'flat'}
          left={<TextInput.Icon icon="map-marker-account-outline" color={Colors.primary}/>}
          label={'Address'}
          value={address}
          onChangeText={text => setAddress(text)}
          style={Gutters.largeTMargin}
          theme={{ colors: { primary: Colors.primary } }}
        />

        <Button mode='contained' color={Colors.primary} style={Gutters.largeTMargin} onPress={() => profileUpdateAction()}>
          Update Profile
        </Button>

        <Button mode='contained' color={Colors.error} style={Gutters.largeTMargin} onPress={() => logoutAction()}>
          Logout
        </Button>

         {/* <TouchableOpacity onPress={() => logoutAction()}>
        <Text>Logout</Text>
      </TouchableOpacity> */}
      </View>
    )
  }

  const reset = () => {
    setShowMsg1(false)
    setShowMsg1(false)
  }

  const renderPassword = () => {
    return(
      <View style={Layout.fill}>
        <TextInput
          mode={'flat'}
          left={<TextInput.Icon icon="key-variant" />}
          label={'Current Password'}
          value={oldpwd}
          onChangeText={text => { reset(); setOldPwd(text) }}
          // style={Gutters.largeTMargin}
          theme={{ colors: { primary: Colors.primary } }}
          secureTextEntry={true}
        />
        {showMsg1 && <Text style={[Fonts.textTiny,{ color: Colors.error }]}>Please fill all the fields</Text>}

        <TextInput
          mode={'flat'}
          left={<TextInput.Icon icon="key-variant" />}
          label={'New Password'}
          value={newpwd}
          onChangeText={text => { reset(); setNewPwd(text) }}
          style={Gutters.largeTMargin}
          theme={{ colors: { primary: Colors.primary } }}
          secureTextEntry={true}
        />
        {showMsg && <Text style={[Fonts.textTiny,{ color: Colors.error }]}>Password and Confirm Password are not same</Text>}
        {showMsg1 && <Text style={[Fonts.textTiny,{ color: Colors.error }]}>Please fill all the fields</Text>}

        <TextInput
          mode={'flat'}
          left={<TextInput.Icon icon="key-variant" />}
          label={'Confirm Password'}
          value={confpwd}
          onChangeText={text => { reset(); setConfPwd(text) }}
          style={Gutters.largeTMargin}
          theme={{ colors: { primary: Colors.primary } }}
          secureTextEntry={true}
        />
        {showMsg && <Text style={[Fonts.textTiny,{ color: Colors.error }]}>Password and Confirm Password are not same</Text>}
        {showMsg1 && <Text style={[Fonts.textTiny,{ color: Colors.error }]}>Please fill all the fields</Text>}

        <Button mode='contained' color={Colors.primary} style={Gutters.largeTMargin} onPress={passwordUpdateAction}>
          Update Password
        </Button>
      </View>
    )
  }

  const imageUploadOption = async () => {
    if(mode == 0){
      const result = await launchImageLibrary(options);
      console.log("pickedImgresp", result)
      setShowOptions(false)
      updateProfilePicture(result?.assets[0]?.base64)
    } else if(mode == 1){
      const result = await launchCamera(options);
      console.log("clickedImgresp", result)
      setShowOptions(false)
      updateProfilePicture(result?.assets[0]?.base64)
    } else {
      setShowOptions(false)
    }
  }

  const updateProfilePicture = (data) => {
    setLoading(true)
    let param_obj = {
      "employee_id": LoginInfo?.employee_id,
      "name": name,
      "present_address": address, 
      "email_id": email, 
      "present_mobile_no": phone,
      "profile_image": [{ uri: data }]
    }
    Request({
      method: 'POST',
      url: Config.UPDATE_PROFILE,
      data: param_obj
    }).then(response => {
      console.log("profile image update", response)
      setLoading(false)
      if(response?.profile?.status == "1"){
        dispatch(getProfileDetails({ "employee_id": LoginInfo?.employee_id }))
        setRefresh(!refresh)
      }
    }).catch(error => {
      setLoading(false)
      console.log("profile image error", error)
    })
  }

  return (
    <View style={[Layout.fill]}>
      <View style={[Gutters.smallHPadding, Gutters.smallVPadding]}>
        {/* <Text style={Fonts.textCenter}>{'Profile'}</Text> */}
        <View style={[Layout.selfCenter, Layout.center]}>
          {profImage ? 
            // <FastImage key={new Date()} 
            //   source={{ uri: `${Config.IMAGE_BASEURL}${profImage}`, cache: 'immutable' }} 
            //   style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: Colors.primary }}
            // /> 
            <Image source={{ uri: `${Config.IMAGE_BASEURL}${profImage}${'?' + new Date()}`, cache: 'reload' }} style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: Colors.primary }}/>
          : 
            <FontAwesome color={'grey'} name={'user-circle'} solid size={80}/>
          }
          
          <TouchableOpacity style={{ padding: 10, marginTop: -20, marginLeft: 80 }} onPress={() => setShowOptions(true)}>
            <FontAwesome color={Colors.primary} size={25} name={'camera'}/>
          </TouchableOpacity>
        </View>

        <View style={Layout.center}>
          <Text style={[Fonts.textRegular]}>{Profile?.code}</Text>
          {/* <Text style={[Gutters.smallTMargin]}>User position</Text> */}
        </View>
      </View>

      <View style={[Layout.row]}>
        <TouchableOpacity 
          style={[Layout.fill, Layout.center, Gutters.regularVPadding]}
          onPress={() => onSegmentButtonSelected(0)}
        >
          <Text style={[Fonts.titleTiny,{ color : activeIndex == 0 ? Colors.primary : Colors.text }]}>Profile Details</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[Layout.fill, Layout.center, Gutters.regularVPadding]}
          onPress={() => onSegmentButtonSelected(1)}
        >
          <Text style={[Fonts.titleTiny,{ color : activeIndex == 1 ? Colors.primary : Colors.text }]}>Change Password</Text>
        </TouchableOpacity>
      </View>

      <PagerView style={[Layout.fill]} initialPage={0} ref={ViewPager} onPageSelected={event => onSegmentButtonSelected(event.nativeEvent.position)}>
        <View key={'1'} style={[Layout.fill, Gutters.regularHPadding, Gutters.regularBPadding]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {renderProfile()}
          </ScrollView>
        </View>

        <View key={'2'} style={[Layout.fill, Gutters.regularHPadding, Gutters.regularVPadding]}>
          {renderPassword()}
        </View>
      </PagerView>

      <Overlay visible={showOptions} transparent>
        <View style={[Gutters.regularVPadding, Gutters.smallHPadding, { width: width - 50, backgroundColor: Colors.white, borderRadius: 30 }]}>
          <Text style={[Fonts.textSmall, Fonts.textCenter, Gutters.smallBMargin]}>Choose an option</Text>

          <CheckBox
            title={'Choose Image from Gallery'}
            checkedIcon="dot-circle-o" uncheckedIcon="circle-o"
            checkedColor={Colors.primary} uncheckedColor={Colors.primary}
            onPress={() => setMode(0)}
            checked={mode == 0}
            containerStyle={{ borderWidth: 0, backgroundColor: Colors.white, paddingVertical: 2 }}
          />

          <CheckBox
            title={'Capture Image'}
            checkedIcon="dot-circle-o" uncheckedIcon="circle-o"
            checkedColor={Colors.primary} uncheckedColor={Colors.primary}
            onPress={() => setMode(1)}
            checked={mode == 1}
            containerStyle={{ borderWidth: 0, backgroundColor: Colors.white, paddingVertical: 2 }}
          />

          <View style={Layout.rowHSpaced}>
            <Button mode='contained' color={Colors.error} style={[Gutters.regularTMargin, Layout.selfCenter, { width: '40%' }]} onPress={() => setShowOptions(false)}>
              Cancel
            </Button>

            <Button mode='contained' color={Colors.primary} style={[Gutters.regularTMargin, Layout.selfCenter, { width: '40%' }]} onPress={imageUploadOption}>
              Continue
            </Button>
          </View>
        </View>
      </Overlay>
    </View>
  )
}

export default Profile
