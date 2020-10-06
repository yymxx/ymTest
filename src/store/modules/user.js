import { GenerateRoutes } from '@/router'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { toStrMenuId, parsedShowMenu } from '@/utils/pick'
import { login, getInfo, logout } from '@/api/login'
import { mymenus } from '@/router/data'
// import { allMenu } from '@/utils/data'

const user = {
  state: {
    token: getToken(),
    sysUser: null,
    roles: [],
    menus: []
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_SYSUSER: (state, sysUser) => {
      state.sysUser = sysUser
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus
    }
  },
  actions: {
    IninMenu({ commit }) {
      return new Promise(resolve => {
        const token = getToken()
        if (token && token !== 'undefined') {
          let menus = JSON.parse(JSON.stringify(mymenus))
          commit('SET_SYSUSER', 'admin')
          commit('SET_ROLES', ['abc'])
          commit('SET_MENUS', JSON.parse(JSON.stringify(menus)))
          resolve(GenerateRoutes(menus))
        } else {
          console.log('hhh', getToken())
          setToken('abc')
          resolve()
        }
      })
    },
    LoginByUser({ commit }, userInfo) {
      const username = userInfo.userName.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.userPwd).then(response => {
          if (!response.data) reject(new Error(response.msg))
          const data = response.data
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          reject(new Error(error))
        })
      })
    },
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          if (data && data.sysUser) {
            const role = ''
            let menus = toStrMenuId(data.menuList)
            // menus = JSON.parse(JSON.stringify(allMenu))
            menus = menus.filter(item => {
              if (role === 'shout') return item.path === '/call'
              return item.path !== '/cabll'
            })

            let showMenus = parsedShowMenu(menus, data.sysUser)
            menus = showMenus.length >= 0 ? showMenus : menus
            console.log('showMenus', showMenus)
            commit('SET_SYSUSER', data.sysUser)
            commit('SET_ROLES', ['ABCDEF'])
            commit('SET_MENUS', JSON.parse(JSON.stringify(menus)))
            resolve(GenerateRoutes(menus))
          } else {
            reject(new Error(response.msg))
          }
        }).catch(error => {
          reject(new Error(error))
        })
      })
    },
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(new Error(error))
        })
      })
    },
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resolve()
      })
    }
  }
}

export default user