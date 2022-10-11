import React, { useEffect, useState } from 'react'
import { ActivityIndicator, View, Text, Image, Dimensions, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { Brand, MyButton } from '@/Components'
import { setDefaultTheme } from '@/Store/Theme'
import { navigateAndSimpleReset } from '@/Navigators/utils'
import { TextInput } from 'react-native-paper'
import { getAuth, setAuth } from '@/Store/User'
import { useDispatch, useSelector } from 'react-redux'

const Login = () => {
  const { Layout, Gutters, Fonts, Colors, Common, Images } = useTheme()
  const { t } = useTranslation()
  const { width } = Dimensions.get('window')
  const dispatch = useDispatch()

  const [username, setUsername] = useState('kumar')
  const [password, setPassword] = useState('kumar@123')

  // const [username, setUsername] = useState('')
  // const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)

  const access_token = useSelector(state => state.user.accessToken)

  useEffect(() => {
  },[])

  const loginAction = () => {
    dispatch(getAuth({ username, password, access_token }))
    // dispatch(setAuth({ login: true }))
  }

  return (
    <View style={Common.container}>
      <View style={{ height: '30%', width:'100%', backgroundColor: Colors.primary, borderBottomLeftRadius: width/5, borderBottomRightRadius: width/5 }}/>

      <View style={[Gutters.regularHMargin, Gutters.regularVMargin, Gutters.largeVPadding, Gutters.regularHPadding, Layout.fill, { backgroundColor: Colors.white, borderRadius: 10, position:'absolute', top: 0, bottom: 0, right: 0, left: 0 }]}>
        <Image source={Images.login} style={[Layout.selfCenter, { width: 250, height: 250 }]} resizeMode={'contain'}/>

        <Text style={[Fonts.textSmall, Fonts.textCenter, Gutters.smallBMargin]}>Enter your username and password </Text>
        <TextInput
          label={'Username'}
          value={username}
          onChangeText={text => setUsername(text)}
          mode={'outlined'}
          theme={Common.paperTheme}
          style={Gutters.regularTMargin}
        />

        <TextInput
          label={'Password'}
          value={password}
          onChange={text => setPassword(text)}
          mode={'outlined'}
          theme={Common.paperTheme}
          secureTextEntry={visible ? false : true}
          right={<TextInput.Icon icon={visible ? 'eye-off' : "eye"} onPress={() => setVisible(!visible)} color={Colors.primary}/>}
          style={Gutters.regularTMargin}
        />

        <TouchableOpacity style={[Layout.selfCenter,Gutters.regularTMargin]}>
          <Text style={[Fonts.textSmall]}>Forgot Your Password? <Text style={{color: Colors.error }}>Ask Admin</Text></Text>
        </TouchableOpacity>

        <MyButton
          label={'SIGN IN'}
          onBtnPress={loginAction}
          btnstyle={Gutters.largeTMargin}
        />
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
