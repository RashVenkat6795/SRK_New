import { Config } from '@/Config';
import Request from './Core';

export function userLogin(param){
  console.log("user login.....", param)
  return Request({
    method: 'POST',
    url: Config.LOGIN,
    data: param
  })
}

export function userLogout(param){
  return Request({
    method: 'POST',
    url: Config.LOGOUT,
    data: param
  })
}

export function getHomeStatistics(param){
  return Request({
    method: 'POST',
    url: Config.HOME,
    data: param
  })
}

export function getProjects(param){
  return Request({
    method: 'POST',
    url: Config.GET_EMPLOYEE_PROJECTS,
    data: param
  })
}

export function getEmployeesForCompany(param){
  return Request({
    method: 'POST',
    url: Config.GET_COMPANYEMPLOYEES,
    data: param
  })
}

export function getStoresList(param){
  return Request({
    method: 'POST',
    url: Config.GET_STORES_LIST,
    data: param
  })
}

export function getStoreStock(param){
  return Request({
    method: 'POST',
    url: Config.GET_PROJECT_STOCK,
    data: param
  })
}

export function getContractors(param){
  return Request({
    method: 'POST',
    url: Config.GET_CONTRACTOR_FOR_PROJECT, 
    data: param
  })
}

export function getStoreProjects(param){
  return Request({
    method: 'POST',
    url: Config.GET_STORE_PROJECTWISE,
    data: param
  })
}

export function getNotifs(param){
  return Request({
    method: 'POST',
    url: Config.NOTIFICATION_LIST,
    data: param
  })
}

export function getProfDet(param){
  return Request({
    method: 'POST',
    url: Config.PROFILE,
    data: param
  })
}

export function getMaterialsList(param){
  return Request({
    method: 'POST',
    url: Config.MATERIALS_LIST,
    data: param
  })
}