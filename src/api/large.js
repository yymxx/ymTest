import request from '@/utils/request'

export function getBigScreenData(apiUrl, obj) {
  return request({
    url: apiUrl,
    method: 'post',
    params: obj
  })
}