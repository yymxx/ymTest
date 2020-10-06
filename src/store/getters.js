const getters = {
  token: state => state.user.token,
  sysUser: state => state.user.sysUser,
  roles: state => state.user.roles,
  menus: state => state.user.menus,
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  voip: state => state.app.voip,
  visitedViews: state => state.tagsView.visitedViews
}

export default getters
