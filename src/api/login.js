import request from '@/utils/request'

export function login(userName, userPwd) {
  return request({
    url: '/login/loginIn.htm',
    method: 'post',
    params: {
      userName: userName,
      passWd: userPwd
    }
  })
}

export function getInfo() {
  return request({
    url: '/login/getSysUserAndMenu.htm',
    method: 'get',
    params: {}
  })
}

export function logout() {
  return request({
    url: '/login/out.htm',
    method: 'get',
    params: {}
  })
}

export function importExcelData(formData) {
  return request({
    url: '/room/import',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data;boundary=' + new Date().getTime()
    }
  })
}
