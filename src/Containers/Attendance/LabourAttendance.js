import React, { useEffect, createRef, useState } from 'react'
import { ActivityIndicator, View, Text, TouchableOpacity, Dimensions, ScrollView, Platform } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { Brand, Loader } from '@/Components'
import { Button, TextInput } from 'react-native-paper'
import PagerView from 'react-native-pager-view'
import Request from '@/Requests/Core'
import { Config } from '@/Config'
import { useDispatch, useSelector } from 'react-redux'
import { ToastMessage } from '@/Utils'
import { MessageTypes } from '@/Theme/Variables'
import MultiSelect from 'react-native-multiple-select'
import FontAwesome from 'react-native-vector-icons/FontAwesome5'
import RNPickerSelect from 'react-native-picker-select'
import { getEmployees, getContractors } from '@/Store/User'
import SelectBox from 'react-native-multi-selectbox'
import { xorBy } from 'lodash'
import moment from 'moment'

const LabourAttendance = () => {
  const { Layout, Gutters, Fonts, Colors, Common,  } = useTheme()
  const { t } = useTranslation()
  const ViewPager = createRef()
  const dispatch = useDispatch()
  const { width, height } = Dimensions.get('window')

  const LoginInfo = useSelector(state => state.user.loginInfo)
  const Employees = useSelector(state => state.user.employees)
  const UserProject = useSelector(state => state.user.selectedProject)
  const Contractors = useSelector(state => state.user.contractors)

  const [selectedContractor, setSelectedContractor] = useState(Contractors[0]?.value)
  const [activeIndex, setActiveIndex] = useState(0)
  const [attnLogin, setAttnLogin] = useState(false)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [pickedVal, setPickedVal] = useState([])
  const [selectedTeams, setSelectedTeams] = useState([])

  const [reqCount, setReqCount] = useState()
  const [skilledLabour, setSkilledLabour] = useState()
  const [semiskilledLabour, setSemiSkilledLabour] = useState()
  const [nonskilledLabour, setNonSkilledLabour] = useState()
  const [idleLabour, setIdleLabour] = useState()
  const [remarks, setRemarks] = useState('')

  useEffect(() => {
    dispatch(getEmployees({ company_id: LoginInfo?.company_id }))
    dispatch(getContractors({ "employee_id": LoginInfo?.employee_id, "project_structure_id": UserProject }))
  },[])

  const onSegmentButtonSelected = (index) => {
    if (activeIndex != index) {
      setActiveIndex(index)
      ViewPager?.current?.setPage(index)
    }
  }

  const loginAction = () => {
    console.log("login Action")
  }

  const logoutAction = () => {
    console.log("logout Action")
  }

  const selfAttendance = () => {
    setLoading(true)
    Request({
      method: 'POST',
      url: Config.SELF_ATTENDANCE,
      data: {
        employee_id: LoginInfo?.employee_id
      }
    }).then(response => {
      console.log("self attendance", response)
      if(response?.self_attendance?.status == 1){
        setLoading(false)
        ToastMessage(response?.self_attendance?.message, MessageTypes.success)
      } else {
        setLoading(false)
        ToastMessage(response?.self_attendance?.message, MessageTypes.data)
      }
    }).catch(error => {
      setLoading(false)
      console.log("attendance error", error)
    })
  }

  function onMultiChange() {
    return (item) => setSelectedTeams(xorBy(selectedTeams, [item], 'id'))
  }

  const visitorAttendance = () => {
    setLoading(true)
    let dataObj = []
    selectedTeams?.map((item,index) => {
      dataObj.push({ visit_employee_id: item?.employee_id })
    })
    let param_obj = {
      "project_structure_id": UserProject, //"3", 
      "employee_id": LoginInfo?.employee_id, //"2", 
      "visit_date": moment(new Date()).format('YYYY-MM-DD'), //"2022-09-26", 
      "employee_visit": dataObj
    }
    console.log("visitor attendance param", param_obj)
    Request({
      method: 'POST',
      url: Config.VISITOR_ATTENDANCE,
      data: param_obj
    }).then(response => {
      console.log("visitor attendance resp", response)
      setLoading(false)
      if(response?.employee_visit?.status == '1'){
        ToastMessage(response?.employee_visit?.message, MessageTypes.success)
      }
    }).catch(error => {
      console.log("visitor attendance error", error)
      setLoading(false)
    })
  }

  const contractorAttendance = () => {
    setLoading(true)
    let paramObj = { 
      "employee_id": LoginInfo?.employee_id, //'2
      "project_structure_id": UserProject, // "3",
      "contractor_id": selectedContractor, //"3",
      "attendance_date": moment(new Date()).format('YYYY-MM-DD') ,//"2022-09-26",
      "total_labour": `${(idleLabour + nonskilledLabour + semiskilledLabour + skilledLabour) || 0}`,//"10",
      "skilled_labour": skilledLabour, //"3",
      "semi_skilled_labour": semiskilledLabour, //"1",
      "un_skilled_labour": nonskilledLabour, //"1",
      "idle_labour": idleLabour,//"2",
      "remarks": remarks // "Contractor Labour Attendance 2022-09-26"
    }
    // let paramObj = {
    //   "employee_id":"2",
    //   "project_structure_id":"3",
    //   "contractor_id":"3",
    //   "attendance_date":"2022-10-06",
    //   "total_labour":"10",
    //   "skilled_labour":"3",
    //   "semi_skilled_labour":"1",
    //   "un_skilled_labour":"1",
    //   "idle_labour":"2",
    //   "remarks":"Contractor Labour Attendance 2022-10-06"
    // }
    console.log("labour attendance contract wise", paramObj)
    Request({
      method: 'POST',
      url: Config.LABOURATTENDANCE_STOREWISE,
      data: paramObj
    }).then(response => {
      console.log("contractor attendance resp", response)
      setLoading(false)
      if(response?.labour_attendance?.status == '1'){
        ToastMessage(response?.labour_attendance?.message, MessageTypes.success)
      } else {
        ToastMessage(response?.labour_attendance?.message, MessageTypes.danger)
      }
    }).catch(error => {
      console.log("contractor attendance error", error)
      setLoading(false)
    })
  }

  const renderAttendanceFields = () => {
    return(
      <ScrollView>
      <View style={Layout.fill}>
        <Text style={[Gutters.regularTMargin, Fonts.titleTiny]}>Labour Attendance</Text>

        <View style={Layout.rowHCenter}>
          <Text style={[Layout.fill, Fonts.textSmall]}>Requested Count</Text>
          <TextInput
            value={reqCount}
            onChangeText={text => setReqCount(text)}
            mode={'outlined'}
            theme={Common.paperTheme}
            style={Layout.fill}
            keyboardType={'number-pad'}
          />
        </View>

        <View style={[Layout.rowHCenter, Gutters.smallTMargin]}>
          <Text style={[Layout.fill, Fonts.textSmall]}>Skilled Labour</Text>
          <TextInput
            value={skilledLabour}
            onChangeText={text => setSkilledLabour(text)}
            mode={'outlined'}
            theme={Common.paperTheme}
            style={Layout.fill}
            keyboardType={'number-pad'}
          />
        </View>

        <View style={[Layout.rowHCenter, Gutters.smallTMargin]}>
          <Text style={[Layout.fill, Fonts.textSmall]}>Semi-Skilled Labour</Text>
          <TextInput
            value={semiskilledLabour}
            onChangeText={text => setSemiSkilledLabour(text)}
            mode={'outlined'}
            theme={Common.paperTheme}
            style={Layout.fill}
            keyboardType={'number-pad'}
          />
        </View>

        <View style={[Layout.rowHCenter, Gutters.smallTMargin]}>
          <Text style={[Layout.fill, Fonts.textSmall]}>Non-Skilled Labour</Text>
          <TextInput
            value={nonskilledLabour}
            onChangeText={text => setNonSkilledLabour(text)}
            mode={'outlined'}
            theme={Common.paperTheme}
            style={Layout.fill}
            keyboardType={'number-pad'}
          />
        </View>

        <View style={[Layout.rowHCenter, Gutters.smallTMargin]}>
          <Text style={[Layout.fill, Fonts.textSmall]}>Idle Labour</Text>
          <TextInput
            value={idleLabour}
            onChangeText={text => setIdleLabour(text)}
            mode={'outlined'}
            theme={Common.paperTheme}
            style={Layout.fill}
            keyboardType={'number-pad'}
          />
        </View>

        <View style={[Layout.rowHCenter, Gutters.regularTMargin]}>
          <Text style={[Layout.fill, Fonts.textSmall]}>Total</Text>
          <Text style={[Layout.fill, Fonts.titleSmall, Fonts.textCenter]}>{(idleLabour + nonskilledLabour + semiskilledLabour + skilledLabour) || 0}</Text>
        </View>

        <TextInput
          label={'Remarks'}
          value={remarks}
          onChangeText={text => setRemarks(text)}
          mode={'outlined'}
          theme={Common.paperTheme}
          style={[Layout.fill, Gutters.regularTMargin, { minHeight: 90 }]}
          numberOfLines={7}
        />

        <Button mode='contained' color={Colors.primary} style={[Gutters.largeTMargin, Layout.selfCenter, { width: '50%' }]} onPress={() => contractorAttendance()}
          >
            Submit
          </Button>
      </View>
      </ScrollView>
    )
  }
  // LABOURATTENDANCE_STOREWISE

  return (
    <View style={[Layout.fill, ]}>
      {loading && <Loader/>}

      <View key={'3'} style={[Layout.fill, Gutters.smallHPadding, Gutters.regularVPadding]}>
        {/* <View style={[Layout.fill, Gutters.regularRMargin]}> */}
          <RNPickerSelect
            placeholder={{}}
            items={Contractors}
            value={selectedContractor}
            onValueChange={value => {
              setSelectedContractor(value)
            }}
            style={Common.pickerSelectStyles}
            // useNativeAndroidPickerStyle={false}
            Icon={() => Platform.OS == 'ios' ? (<FontAwesome name={'chevron-down'} size={20} color="gray" style={{ marginTop: 4 }}/>) : null}
          />
        {/* </View> */}
        {renderAttendanceFields()}
      </View>
    </View>
  )
}

export default LabourAttendance
