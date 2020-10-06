<template>
  <div>
    <div class="dept-container">
      <!-- <div style="padding-right: 25px;">
        <el-card>
          <div slot="header">
            <span>居住社区</span>
          </div>
          <div class="older-tree">
            <el-tree ref="tree"
              node-key="id"
              :data="deptList"
              :props="defaultProps"
              highlight-current
              auto-expand-parent
              :default-expanded-keys="[2]"
              @node-click="handleNodeClick"
              :expand-on-click-node="false">
              <span class="custom-tree-node"
                slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
              </span>
            </el-tree>
          </div>
        </el-card>
      </div> -->
      <div class="dept-wrapper">
        <div class="check-wrapper">
          <div style="height: 42px;">
            <el-checkbox :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleAllChange">全选</el-checkbox>
          </div>
          <div class="check-group">
            <el-checkbox-group v-if="list.length>0"
              v-model="checkList"
              @change="handleChecked">
              <div v-for="(item, index) in list"
                :key="index"
                class="groupbox">
                <el-checkbox :label="item.id">{{item.oldName}}</el-checkbox>
              </div>
              <div style="clear: both;"></div>
            </el-checkbox-group>
            <div v-else
              style="text-align: center;color: #999;">
              <span style="font-size: 18px;">此机构暂无可添加的老人</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="text-align: right;">
      <el-button @click="cancel()">取 消</el-button>
      <el-button type="primary"
        @click="update()">确定</el-button>
    </div>
  </div>
</template>

<script>
import { findByCommunity } from '@/api/older'
import { getRecordList } from '@/api/page'
import { allApi } from '@/api/config'

export default {
  name: 'olderOptions',
  data() {
    return {
      list: [],
      checkValue: '',
      checkList: [],
      checkAll: false,
      isIndeterminate: false,
      currDept: null,
      deptList: [],
      defaultProps: {
        children: 'children',
        label: 'addressName'
      }
    }
  },
  props: ['data', 'multiple'],
  mounted() {
    this.handleQuery(this.data.id)
    const apiUrl = allApi.addresstable.getList
    getRecordList(apiUrl, {}).then(response => {
      console.log(222, response)
      this.deptList = response.data.dataList
    })
  },
  methods: {
    initChecked() {
      const rowOlder = ''
      this.isIndeterminate = rowOlder !== ''
      this.checkList = rowOlder.split(',').map(item => {
        return parseInt(item)
      })
    },
    handleNodeClick(data) {
      this.currDept = data
      if (!data.children) this.handleQuery(data.addressName)
    },
    handleQuery(id) {
      findByCommunity(id).then(response => {
        this.list = response.data
      })
    },
    handleAllChange(val) {
      this.isIndeterminate = false
      const allIds = this.list.reduce((res, item) => {
        return res.concat([item.id])
      }, [])
      this.checkList = val ? allIds : []
    },
    handleChecked(value) {
      const count = value.length
      this.checkAll = count === this.list.length
      this.isIndeterminate = count > 0 && count < this.list.length
    },
    update() {
      this.checkValue = this.checkList.join()
      this.$emit('setGoback', this.checkValue)
    },
    cancel() {
      this.$emit('setGoback', null)
    }
  }
}
</script>

<style lang="scss" scoped>
.dept-container {
  position: relative;
  padding: 0 10px;
  top: -10px;
  .older-tree {
    width: 240px;
    height: 420px;
    overflow-y: auto;
  }

  .check-wrapper {
    .check-group {
      max-height: 452px;
      overflow-y: auto;
      .groupbox {
        width: 118px;
        float: left;
        .el-checkbox {
          height: 28px;
        }
      }
    }
  }
}
</style>
