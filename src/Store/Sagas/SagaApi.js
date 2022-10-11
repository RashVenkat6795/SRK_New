import { call, put, select } from 'redux-saga/effects'
import { navigate, goBack } from '@/Navigators/Root'
import { ToastMessage } from '@/Utils'
import { MessageTypes } from '@/Theme/Variables'
import { setAuth, setContractors, setEmployees, setHomeStats, setMaterials, setNotifications, setProfileDetails, setProjects, setStoreProjects, setStores } from '../User'
import { userLogin, userLogout, getHomeStatistics, getProjects, getEmployeesForCompany, getStoresList, getContractors, getStoreProjects, getNotifs, getProfDet, getMaterialsList } from '@/Requests/Api'
import { isObject } from 'lodash'

export function* handleLogin(action){
  try {
    const response = yield call(userLogin, action?.payload)
    // console.log("handle login response", response)
    if(response?.Login[0].status == 1){
      yield put(setAuth({ isLoggedIn: true, loginInfo: response?.Login[0] }))
      ToastMessage(response?.Login[0]?.message, MessageTypes.success)
    } else {
      ToastMessage(response?.Login[0]?.message, MessageTypes.danger)
    }
  } catch(error) {
    console.log("handle login error", error)
  }
}

export function* handleLogout(action){
  try {
    const response = yield call(userLogout, action?.payload)
    console.log("handle logout response", response)
  } catch(error) {
    console.log("handle logout error", error)
  }
}

export function* handleGetHomeStatistics(action){
  try {
    const response = yield call(getHomeStatistics, action?.payload)
    // console.log("home stats resp", response)
    if(response?.home?.status == 1){
      yield put(setHomeStats({ data: response?.home }))
    }
  } catch(error) {
    console.log("handle gethome stats", error)
  }
}

export function* handleGetProjects(action){
  try { 
    const response = yield call(getProjects, action?.payload)
    // console.log("respone...", response)
    if(response?.employee_project){
      response?.employee_project?.map((item,index) => {
        item.label = item.project_name
        item.value = item.project_structure_id
      })
      yield put(setProjects({ data: response?.employee_project }))
    }
  } catch(error){
    console.log("get projects error", error)
  }
}

export function* handleGetEmployeesCompany(action){
  try {
    const response = yield call(getEmployeesForCompany, action?.payload)
    // console.log("resp", response)
    if(response.employee){
      response?.employee?.map((item,index) => {
        item.label = item.employee_name
        item.value = item.employee_id
        item.item = item.employee_name
        item.id = item.employee_id
      })
      yield put(setEmployees({ data: response?.employee }))
    }
  } catch(error){
    console.log("get employees error", error)
  }
}

export function* handleGetStoresList(action){
  //13 - for project stores
  try { 
    const response = yield call(getStoresList, action?.payload)
    // console.log("stores response", response)
    if(response?.store){
      response.store?.map((item,index) => {
        item.value = item.store_id
        item.label = item.store_name
      })
      yield put(setStores({ data: response.store }))
    }
  } catch(error){
    console.log("stores resp error", error)
  }
}

export function* handleGetContractors(action){
  try {
    const response = yield call(getContractors, action?.payload)
    // console.log("contractors resp", response)
    if(response?.project_structure_contractor){
      response?.project_structure_contractor?.map((item,index) => {
        item.label = item.contractor_name
        item.value = item.contractor_id
      })
      yield put(setContractors({ data: response?.project_structure_contractor }))
    }
  } catch(error){
    console.log("contractors list err", error)
  }
}

export function* handleGetStoreProjects(action){
  try {
    const response = yield call(getStoreProjects, action?.payload)
    // console.log("getstore projects resp", response)
    if(response?.project_store){
      response?.project_store?.map((item,index) => {
        item.label = item.project_store_name
        item.value = item.project_store_id
      })
      yield put(setStoreProjects({ data: response?.project_store }))
    }
  } catch(error){
    console.log("get storeprojects error", error)
  }
}

export function* handleGetNotifications(action){
  try {
    const response = yield call(getNotifs, action?.payload)
    // console.log("getnotications resp", response)
    if(response?.notification){
      let new_det = response?.notification
      let details = []
      let data = Object.values(response?.notification)
      data.map((item,index) => {
        if(isObject(item)){
          details.push(item)
        }
      })
      new_det.data = details
      // console.log("notifics.....", new_det)
      yield put(setNotifications({ data: new_det }))
    }
  } catch(error){
    console.log("getnotifications error", error)
  }
}

export function* handleGetProfileDetails(action){
  try {
    const response = yield call(getProfDet, action?.payload)
    // console.log("getprofiledetails resp", response)
    if(response?.employee){
      yield put(setProfileDetails({ data: response?.employee }))
    }
  } catch(error){
    console.log("getprofdet err", error)
  }
}

export function* handleGetMaterialsList(action){
  try {
    const response = yield call(getMaterialsList, action?.payload)
    // console.log("materials list resp", response)
    if(response?.material){
      response?.material?.map((item,index) => {
        item.label = item?.material_name
        item.value = item?.material_id
      })
      yield put(setMaterials({ data: response?.material }))
    }
  } catch(error){
    console.log("get materials list error", error)
  }
}