import React, { useEffect, useState } from 'react'
import { ActivityIndicator, View, Text, Image, Dimensions, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { Brand, MyButton } from '@/Components'
import { setDefaultTheme } from '@/Store/Theme'
import { navigateAndSimpleReset } from '@/Navigators/utils'
import { TextInput, Checkbox } from 'react-native-paper'
import { getAuth, setAuth } from '@/Store/User'
import { useDispatch, useSelector } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler'
import FastImage from 'react-native-fast-image'
import FontAwesome from 'react-native-vector-icons/FontAwesome5'
import { setActiveCompany } from '@/Store/User'
import { ToastMessage } from '@/Utils'
import { MessageTypes } from '@/Theme/Variables'
import axios from 'axios'

const Login = () => {
  const { Layout, Gutters, Fonts, Colors, Common, Images } = useTheme()
  const { t } = useTranslation()
  const { width } = Dimensions.get('window')
  const dispatch = useDispatch()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // const [username, setUsername] = useState('muthuraj')
  // const [password, setPassword] = useState('Muthuraj@123')
  const [visible, setVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(null)

  const access_token = useSelector(state => state.user.accessToken)
  const company = useSelector(state => state.user.activeCompany)

  useEffect(() => {
  },[])

  const loginAction = () => {
    let message;
    if(!activeIndex) message = 'Please choose company'
    else if(!username) message = 'Please enter username'
    else if(!password) message = 'Please enter password'
    else { 
      dispatch(getAuth({ username, password, access_token }))
    }

    if(message){
      ToastMessage(message, MessageTypes.danger)
    }

  }

  return (
    <View style={Common.container}>
      <View style={{ height: '30%', width:'100%', backgroundColor: Colors.primary, borderBottomLeftRadius: width/5, borderBottomRightRadius: width/5 }}/>

      <View style={[Gutters.smallHMargin, Gutters.regularVMargin, Gutters.largeVPadding, Gutters.regularHPadding, Layout.fill, { backgroundColor: Colors.white, borderRadius: 10, position:'absolute', top: 0, bottom: 0, right: 0, left: 0 }]}>
        <ScrollView style={Layout.fill}>
          <Image source={Images.login} style={[Layout.selfCenter, { width: 250, height: 250 }]} resizeMode={'contain'}/>

          <Text style={[Fonts.textSmall, Fonts.textCenter, Gutters.smallBMargin]}>Choose Company</Text>
          <View style={[Layout.rowHCenter, Layout.justifyContentBetween]}>
            <TouchableOpacity style={Layout.row} onPress={() => {
              setActiveIndex(1)
              axios.defaults.baseURL = `http://eibs.elysiumproduct.com/srk/services/`
              dispatch(setActiveCompany({ data: 'srk' }))
            }}>
              <FontAwesome name={activeIndex == 1 ? 'check-circle' : 'circle'} color={Colors.primary} size={20} style={[Gutters.smallTMargin, Gutters.tinyRMargin]}/>
              <FastImage source={Images.srk} style={{ width: 140, height: 60 }} resizeMode={'contain'}/>
            </TouchableOpacity>

            <TouchableOpacity style={Layout.row} onPress={() => {
              setActiveIndex(2)
              axios.defaults.baseURL = `http://eibs.elysiumproduct.com/sk/services/`
              dispatch(setActiveCompany({ data: 'sk' }))
            }}>
              <FontAwesome name={activeIndex == 2 ? 'check-circle' :'circle'} color={Colors.primary} size={20} style={[Gutters.smallTMargin, Gutters.tinyRMargin]}/>
              <FastImage source={Images.sk} style={{ width: 140, height: 60 }} resizeMode={'contain'}/>
            </TouchableOpacity>
          </View>

          <Text style={[Fonts.textSmall, Fonts.textCenter, Gutters.smallBMargin, Gutters.largeTMargin]}>Enter your username and password </Text>
          <TextInput
            label={'Username'}
            value={username}
            onChangeText={text => setUsername(text)}
            mode={'outlined'}
            theme={Common.paperTheme}
            style={Gutters.regularTMargin}
            autoCapitalize={'none'}
          />
          <TextInput
            label={'Password'}
            value={password}
            onChangeText={text => setPassword(text)}
            mode={'outlined'}
            theme={Common.paperTheme}
            style={Gutters.regularTMargin}
            autoCapitalize={'none'}
            secureTextEntry={visible ? false : true}
            right={<TextInput.Icon icon={visible ? 'eye-off' : "eye"} onPress={() => setVisible(!visible)} color={Colors.primary}/>}
            style={Gutters.regularTMargin}
          />

          {/* <TextInput
            label={'Password'}
            value={password}
            onChange={text => setPassword(text)}
            mode={'outlined'}
            theme={Common.paperTheme}
            // secureTextEntry={true}
            // secureTextEntry={visible ? false : true}
            // right={<TextInput.Icon icon={visible ? 'eye-off' : "eye"} onPress={() => setVisible(!visible)} color={Colors.primary}/>}
            style={Gutters.regularTMargin}
            autoCapitalize={'none'}
          /> */}

          <TouchableOpacity style={[Layout.selfCenter,Gutters.regularTMargin]}>
            <Text style={[Fonts.textSmall]}>Forgot Your Password? <Text style={{color: Colors.error }}>Ask Admin</Text></Text>
          </TouchableOpacity>

          <MyButton
            label={'SIGN IN'}
            onBtnPress={loginAction}
            btnstyle={Gutters.largeTMargin}
          />
        </ScrollView>
      </View>

      {/* <Text style={[Fonts.titleTiny, Gutters.regularTMargin, { color: Colors.light_grey }]}>Select Logo to login</Text>

      <View style={[Layout.rowHSpaced, Gutters.regularHPadding, Layout.center]}>
        <View style={{ borderColor: Colors.primary, borderWidth: 2, borderRadius: 10 }}>
          <Image source={Images.logo1} style={{ width: 150, height: 80 }}/>
        </View>

        <View style={{ borderColor: Colors.primary, borderWidth: 2, borderRadius: 10 }}>
          <Image source={Images.logo2} style={{ width: 150, height: 80 }}/>
        </View>
      </View> */}
    </View>
  )
}

export default Login
