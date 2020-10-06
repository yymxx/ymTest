import request from '@/utils/request'

export function getOlderList(page, pageSize, sysUser, obj) {
  return request({
    url: '/web/customer/findCustomer.htm',
    method: 'get',
    params: {
      page,
      pageSize,
      create_user: sysUser.id ? sysUser.id : '',
      orgid: sysUser.institutionsId,
      roleId: sysUser.roleId,
      oldName: obj.oldName,
      idNumber: obj.idNumber,
      sex: obj.sex,
      strAge: obj.strAge,
      endAge: obj.endAge,
      community: obj.community,
      cusStreet: obj.cusStreet
    }
  })
}

export function getOlderById(id) {
  return request({
    url: '/web/customer/findCustomerById.htm',
    method: 'get',
    params: {
      id
    }
  })
}

export function addOlder(obj) {
  return request({
    url: '/web/customer/saveCustomer.htm',
    method: 'post',
    params: obj
  })
}

export function updateOlder(obj) {
  return request({
    url: '/web/customer/updCustomer.htm',
    method: 'post',
    params: obj
  })
}

export function delOlder(ids) {
  return request({
    url: '/web/customer/delBatchCustomer.htm',
    method: 'get',
    params: {
      ids
    }
  })
}

export function findByCommunity(id) {
  return request({
    url: '/web/customer/findUnclaimedCusById.htm',
    method: 'get',
    params: {
      id
    }
  })
}

export function updateByCommunity(orgid, cid) {
  return request({
    url: '/web/customer/updBatchCustomer.htm',
    method: 'get',
    params: {
      orgid,
      cid
    }
  })
}

export function importExcelData(formData) {
  return request({
    url: '/web/customer/importCustomer.htm',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data;'
    }
  })
}
