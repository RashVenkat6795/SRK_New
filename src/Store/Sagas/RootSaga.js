import { takeLatest, takeEvery } from 'redux-saga/effects'
import { getAuth, getHomeStats, getProjects, getEmployees, getStores, getContractors, getStoreProjects, getNotifications, getProfileDetails, getMaterials } from '../User'
import { handleLogin, handleLogout, handleGetHomeStatistics, handleGetProjects, handleGetEmployeesCompany, handleGetStoresList, handleGetContractors, handleGetStoreProjects, handleGetNotifications, handleGetProfileDetails, handleGetMaterialsList } from './SagaApi'

export function* watcherSaga(){
  yield takeLatest(getAuth.type, handleLogin)
  yield takeLatest(getHomeStats.type, handleGetHomeStatistics)
  yield takeLatest(getProjects.type, handleGetProjects)
  yield takeLatest(getEmployees.type, handleGetEmployeesCompany)
  yield takeLatest(getStores.type, handleGetStoresList)
  yield takeLatest(getContractors.type, handleGetContractors)
  yield takeLatest(getStoreProjects.type, handleGetStoreProjects)
  yield takeLatest(getNotifications.type, handleGetNotifications)
  yield takeLatest(getProfileDetails.type, handleGetProfileDetails)
  yield takeLatest(getMaterials.type, handleGetMaterialsList)
}