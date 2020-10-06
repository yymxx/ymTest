import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// const _import = require('./_import_' + process.env.NODE_ENV)

export const formatterRoutes = menus => {
  const addRouters = []
  menus.forEach((item, index) => {
    let buttonList = null
    if (item.children && item.children.length > 0) {
      let menuChild = []
      item.children.forEach(menu => {
        if (menu.children && menu.children.length > 0) {
          menuChild = menuChild.concat(menu.children)
        } else {
          menuChild.push(menu)
        }
      })

      if (item.path === '/sidy') {
        menuChild.push({
          id: 'lxr000',
          path: 'urgent',
          title: '紧急联系人',
          component: 'dossier/urgent/index'
        })
      }

      if (item.path === '/call' || item.path === '/shout' || item.path === '/count' || item.path === '/video') {
        Vue.set(item, 'redirect', item.path + '/' + menuChild[0].path)
      } else {
        menuChild.push({
          id: 's' + item.id,
          path: 'stage',
          title: '菜单列表',
          component: 'stage/index'
        })

        Vue.set(item, 'redirect', item.path + '/stage')
      }

      item.children = formatterRoutes(menuChild)
    }

    if (item.buttonList) {
      // let obj = null
      buttonList = item.buttonList.reduce((res, btn) => {
        return res.concat({})
        // obj = btnPermits[btn.type]
        // return res.concat({
        //   name: btn.buttonName,
        //   icon: obj.icon,
        //   type: obj.type,
        //   btnClick: obj.btnClick,
        //   status: obj.status
        // })
      }, [])
    }

    if (item.component !== '') {
      const menuComponent = item.component
      item.component = () => import('@/views/' + menuComponent)
    }

    Vue.set(item, 'name', item.id + '-' + index)
    Vue.set(item, 'meta', { title: item.title, key: item.id, btnList: buttonList })

    addRouters.push(item)
  })

  return addRouters
}

export function GenerateRoutes(menus) {
  return [
    {
      path: '/',
      component: () => import('@/views/layout/headerCustom'),
      redirect: menus[0].path,
      children: formatterRoutes(menus)
    }
  ]
}

export function markRoutes(str) {
  return str.indexOf('all') !== -1
}

export default new Router({
  scrollBehavior: () => ({
    y: 0
  }),
  routes: [
    {
      path: '/login',
      name: '登录',
      component: () => import('@/views/login/index'),
      hidden: true
    }
  ]
})
