<template>
  <div>
    <div style="padding: 0 15px;">
      <div style="height: 500px;overflow-y: auto;">
        <el-tree ref="moduleTree"
          :data="moduleList"
          node-key="id"
          show-checkbox
          default-expand-all
          :default-checked-keys="checkedKeys"
          :props="defaultProps"
          @check-change="handleCheckChange">
          <span class="custom-tree-node"
            slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span v-if="data.ischecked"
              class="custom-wrapper">
              <el-checkbox-group v-model="checkedBtnKeys">
                <el-checkbox v-for="(item, index) in data.buttonList"
                  :key="index"
                  :label="jointBtnKey(data.id,item.id)">{{ item.buttonName }}</el-checkbox>
              </el-checkbox-group>
            </span>
          </span>
        </el-tree>
      </div>
      <div style="padding: 20px 0 20px 180px;">
        <el-button size="small"
          @click="handleEmpty">清空</el-button>
        <el-button type="primary"
          size="small"
          @click="handleAssign"
          style="margin-left: 10px">赋权</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mymenus } from '@/router/data'

const roleOptions = [
  {
    dicKey: '01',
    dicValue: '蔡甸养老院'
  }
]

export default {
  name: 'customerPower',
  data() {
    return {
      roleId: '',
      roleOptions,
      moduleList: JSON.parse(JSON.stringify(mymenus)),
      checkedBtnKeys: [],
      checkedKeys: [],
      defaultProps: {
        label: 'title',
        children: 'children'
      }
    }
  },
  props: ['rowData', 'modules'],
  created() {
    if (this.modules.length > 0) {
      this.moduleList = JSON.parse(JSON.stringify(this.modules))
    }

    if (this.rowData.roleStr) {
      const data = this.rowData.roleStr.split(',')
      this.checkedKeys = this.cutCheckedKeys(this.moduleList, data)
      this.checkedBtnKeys = this.rowData.buttonRoleStr.split(',')
      this.getButtonShow(this.moduleList, this.checkedKeys)
    }
  },
  methods: {
    handleSelectRole(val) {
      const data = ['0', '10100', '10110', '10120', '10800', '10810']
      this.checkedKeys = this.cutCheckedKeys(this.moduleList, data)
      this.checkedBtnKeys = ['10810-3', '10110-2', '10110-4', '10120-1']
      this.getButtonShow(this.moduleList, this.checkedKeys)
    },
    handleAssign() {
      this.checkedKeys = this.$refs.moduleTree.getCheckedKeys()
      this.$emit('setGoback', {
        menuIds: this.allCheckedKeys(this.moduleList, this.checkedKeys),
        btnIds: this.checkedBtnKeys
      })
    },
    handleEmpty() {
      this.checkedBtnKeys = []
      this.$refs.moduleTree.setCheckedKeys([])
    },
    jointBtnKey(a, b) {
      return a + '-' + b
    },
    handleCheckChange(data, checked, indeterminate) {
      if (data.buttonList) {
        this.getButtonShow(this.moduleList, [], data.id, checked)
        if (!checked) {
          this.checkedBtnKeys = this.checkedBtnKeys.filter(item => {
            const key = item.split('-')
            return key[0] !== data.id
          })
        }
      }
    },
    getButtonShow(data, lists, menuId, checked) {
      for (var item of data) {
        if (item.children && item.children.length > 0) {
          this.getButtonShow(item.children, lists, menuId, checked)
        } else {
          if (lists.find(ids => ids.indexOf(item.id) !== -1)) {
            this.$set(item, 'ischecked', true)
          } else {
            if (item.id === menuId) {
              if (item.ischecked === undefined) {
                this.$set(item, 'ischecked', checked)
              } else {
                item.ischecked = checked
              }
            }
          }
        }
      }
    },
    allCheckedKeys(data, keys) {
      var list = []
      for (var item of data) {
        if (item.children && item.children.length > 0) {
          const children = this.allCheckedKeys(item.children, keys)
          if (children.length > 0) list.push(item.id)
          list = list.concat(children)
        } else {
          if (keys.find(v => v === item.id)) {
            list.push(item.id)
          }
        }
      }
      return list
    },
    cutCheckedKeys(data, keys) {
      var list = []
      for (var item of data) {
        if (item.children && item.children.length > 0) {
          const children = this.cutCheckedKeys(item.children, keys)
          const temp = item.children.filter((tt, index) => {
            return children.find(v => v === tt.id)
          })

          if (temp.length === item.children.length) list.push(item.id)
          list = list.concat(children)
        } else {
          if (keys.find(v => v === item.id)) {
            list.push(item.id)
          }
        }
      }
      return list
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tree /deep/ {
  .el-tree-node__content {
    height: 26px;
    .custom-tree-node {
      font-size: 14px;
      .custom-wrapper {
        display: inline-block;
        vertical-align: middle;
        margin-left: 26px;
        .el-checkbox {
          margin-right: 12px;
          .el-checkbox__label {
            font-size: 12px;
            color: blue;
          }
        }
      }
    }
  }
}
</style>
