import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import qs from 'qs'

export function getRecordList(apiUrl, obj) {
  return request({
    url: apiUrl,
    method: 'get',
    params: obj
  })
}

export function addRecord(apiUrl, obj) {
  return request({
    url: apiUrl,
    method: 'post',
    params: obj
  })
}

export function addPostRecord(apiUrl, obj) {
  obj.token = getToken()
  return request({
    url: apiUrl,
    method: 'post',
    data: qs.stringify(obj)
  })
}

export function updateRecord(apiUrl, obj) {
  return request({
    url: apiUrl,
    method: 'post',
    params: obj
  })
}

export function updatePostRecord(apiUrl, obj) {
  obj.token = getToken()
  return request({
    url: apiUrl,
    method: 'post',
    data: qs.stringify(obj)
  })
}

export function delOneRecord(apiUrl, id) {
  return request({
    url: apiUrl,
    method: 'get',
    params: {
      id
    }
  })
}

export function delLotRecord(apiUrl, ids) {
  return request({
    url: apiUrl,
    method: 'get',
    params: {
      ids
    }
  })
}

export function getRecordById(apiUrl, id) {
  return request({
    url: apiUrl,
    method: 'get',
    params: {
      id
    }
  })
}

export function findByDicCode(dicCode) {
  return request({
    url: '/web/sysDict/findDict.htm',
    method: 'get',
    params: {
      typeName: dicCode
    }
  })
}

export function importExcelData(apiUrl, formData) {
  return request({
    url: apiUrl,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data;'
    }
  })
}

export function findHujiaoHomepage(apiUrl, obj) {
  return request({
    url: apiUrl,
    method: 'get',
    params: obj
  })
}
