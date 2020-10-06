'use strict'
import Vue from 'vue'
export default function treeToArray(data, parentId = null, level = null) {
  let list = []
  Array.from(data).forEach(function (record) {
    const row = { ...record }
    if (row.children && row.children.length > 0) {
      delete row.children
      Vue.set(row, '_hasChild', 'has')
      if (row._expanded === undefined) {
        Vue.set(row, '_expanded', false)
      }
    }

    let _level = 0
    if (level !== undefined && level !== null) {
      _level = level + 1
    }
    Vue.set(row, '_level', _level)

    if (parentId !== undefined && parentId !== null) {
      if (row.parentId !== undefined && row.parentId !== null) {
        row.parentId = parentId
      } else {
        Vue.set(row, 'parentId', parentId)
      }
    }

    list.push(row)
    if (record.children && record.children.length > 0) {
      const children = treeToArray(record.children, record.id, _level)
      list = list.concat(children)
    }
  })
  return list
}
