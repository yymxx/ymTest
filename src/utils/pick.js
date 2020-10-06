export const toStrMenuId = data => {
  for (var item of data) {
    item.id = item.id.toString()
    if (item.children && item.children.length > 0) {
      toStrMenuId(item.children)
    }
  }
  return data
}

export const parsedShowMenu = (data, obj, key) => {
  let menuIds = obj.roleStr.split(',')
  //  menuIds = menuIds.concat(['23', '25', '27'])
  const btnIds = obj.buttonRoleStr.split(',')
  let rlist = JSON.parse(JSON.stringify(data))
  return rlist.reduce((res, item) => {
    const hh = item.path && item.path.indexOf('cal') < 0
    if (menuIds.find(v => v === item.id)) {
      if (item.children && item.children.length > 0) {
        item.children = parsedShowMenu(item.children, obj)
        if (item.id && item.id === '060' && hh) item.children = []
        return res.concat(item)
      } else {
        const btnList = item.buttonList
        if (btnList) item.buttonList = parsedShowMenu(btnList, obj, item.id)
        return res.concat(item)
      }
    } else if (key && btnIds.find(v => v === (key + '-' + item.id))) {
      return res.concat(item)
    } else {
      return res
    }
  }, [])
}

export function dateFormat(oDate, fmt) {
  var o = {
    'M+': oDate.getMonth() + 1,
    'd+': oDate.getDate(),
    'h+': oDate.getHours(),
    'm+': oDate.getMinutes(),
    's+': oDate.getSeconds(),
    'q+': Math.floor((oDate.getMonth() + 3) / 3),
    S: oDate.getMilliseconds()
  }

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (oDate.getFullYear() + '').substr(4 - RegExp.$1.length))
  }

  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }

  return fmt
}
