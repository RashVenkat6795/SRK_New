import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import { createSlice } from '@reduxjs/toolkit'

const User = createSlice({
  name: 'user',
  initialState: {
    accessToken: 'accessToken',
    isLoggedIn: false,
    loginInfo: null,
    isAuthenticating: false,
    firstTime: true,
    homeStats: {},
    projects: [],
    selectedCompany: '',
    selectedProject: '1',
    employees: [],
    stores: [],
    contractors: [],
    storeProjects: [],
    selectedStoreProject: '',
    notifications: null,
    profileDetails: null,
    materials: []
  },
  reducers: {
    getAuth() {},
    getHomeStats() {},
    getProjects() {},
    getEmployees() {},
    getStores() {},
    getContractors() {},
    getStoreProjects() {},
    getNotifications() {},
    getProfileDetails() {},
    getMaterials() {},

    setToken(state,action) {
      return { ...state, accessToken: action.payload.token }
    },
    setAuth(state, action) {
      const { loginInfo, isLoggedIn, firstTime, login } = action.payload
      // return { ...state, accessToken, loginInfo, isLoggedIn, isAuthenticating: false, firstTime }
      return { ...state, isLoggedIn, loginInfo, selectedCompany: loginInfo?.company_id }
    },
    setHomeStats(state,action) {
      return { ...state, homeStats: action.payload.data }
    },
    setProjects(state,action){
      return { ...state, projects: action.payload.data }
    },
    setUserCompany(state,action){
      return { ...state, selectedCompany: action.payload.id }
    },
    setUserProject(state,action){
      return { ...state, selectedProject: action.payload.id }
    },
    setEmployees(state,action){
      return { ...state, employees: action.payload.data }
    },
    setStores(state,action){
      return { ...state, stores: action.payload.data }
    },
    setContractors(state,action){
      return { ...state, contractors: action.payload.data }
    },
    setStoreProjects(state,action){
      return { ...state, storeProjects: action.payload.data }
    },
    setSelectedStoreProjects(state,action){
      return { ...state, selectedStoreProject: action.payload.id }
    },
    setNotifications(state,action){
      return { ...state, notifications: action.payload.data }
    },
    setProfileDetails(state,action){
      return { ...state, profileDetails: action.payload.data }
    },
    setMaterials(state,action){
      return { ...state, materials: action.payload.data }
    }
  }
})

export const {
  getAuth, getHomeStats, getProjects, getEmployees, getStores, getContractors, getStoreProjects, getNotifications, getProfileDetails, getMaterials,

  setToken, setAuth, setHomeStats, setProjects, setUserCompany, setUserProject, setEmployees, setStores, setContractors, setStoreProjects, setSelectedStoreProjects, setNotifications, setProfileDetails, setMaterials
} = User.actions

export default User.reducer