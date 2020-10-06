import 'babel-polyfill'
import axios from 'axios'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 1000000, // 请求超时时间
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  }
})

const codes = {
  400: '请求错误',
  401: '未授权，请登录',
  403: '拒绝访问',
  404: '请求地址出错',
  408: '请求超时',
  500: '服务器内部错误',
  501: '服务未实现',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
  505: 'HTTP版本不受支持'
}

// request拦截器
service.interceptors.request.use(
  config => {
    const token = getToken()
    if (token) {
      if (config.data) {
        console.log(config)
      } else if (config.params) {
        config.params.token = token
      }
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(new Error(error))
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    // console.log(response)
    if (response.status && response.status === 200) {
      return response.data
    } else {
      const errStatus = response.status && codes[response.status] ? codes[response.status] : '服务器error'
      const errMessage = response.message ? response.message : errStatus
      Message({
        message: errMessage,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(errMessage))
    }
  },
  error => {
    const errStatus = error.response && error.response.status
    const errMessage = errStatus && codes[errStatus] ? codes[errStatus] : error.message
    Message({
      message: errMessage,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(new Error(error))
  }
)

export default service
