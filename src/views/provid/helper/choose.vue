<template>
  <div>
    <div class="dept-container">
      <div v-if="multiple==undefined"
        class="dept-wrapper">
        <div class="check-wrapper">
          <div class="check-group">
            <el-radio-group v-model="checkValue">
              <div v-for="(item, index) in list"
                :key="index"
                class="groupbox">
                <el-radio :label="item.id">{{item.ssName}}</el-radio>
              </div>
              <div style="clear: both;"></div>
            </el-radio-group>
          </div>
        </div>
      </div>
      <div v-else
        class="dept-wrapper">
        <div class="check-wrapper">
          <div style="height: 42px;">
            <el-checkbox :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleAllChange">全选</el-checkbox>
          </div>
          <div class="check-group">
            <el-checkbox-group v-model="checkList"
              @change="handleChecked">
              <div v-for="(item, index) in list"
                :key="index"
                class="groupbox">
                <el-checkbox :label="item.id">{{item.ssName}}</el-checkbox>
              </div>
              <div style="clear: both;"></div>
            </el-checkbox-group>
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
import { getRecordList } from '@/api/page'
import { allApi } from '@/api/config'
import { mapGetters } from 'vuex'

export default {
  name: 'chooseOptions',
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
  computed: {
    ...mapGetters(['sysUser'])
  },
  mounted() {
    this.handleQuery(1, 50)
    this.initChecked()
    const apiUrl = allApi.addresstable.getList
    getRecordList(apiUrl, {}).then(response => {
      console.log(222, response)
      this.deptList = response.data.dataList
    })
  },
  methods: {
    initChecked() {
      this.checkValue = this.data
      if (this.data && this.multiple !== undefined) {
        this.isIndeterminate = this.data !== ''
        this.checkList = this.data.split(',').map(item => {
          return parseInt(item)
        })
      }
    },
    handleNodeClick(data) {
      this.currDept = data
      this.handleQuery(1, 50, data)
    },
    handleQuery(currentPage, pageSize, data) {
      const apiUrl = allApi.servicestation.getBySys
      getRecordList(apiUrl, {
        create_user: this.sysUser.id
      }).then(response => {
        console.log(response)
        this.list = response.data.dataList
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
      const checkName = this.list.reduce((res, item) => {
        if (this.checkList.find(v => v === item.id)) {
          return res.concat(item.id + '-' + item.oldName)
        }
        return res
      }, [])

      if (this.multiple !== undefined) {
        this.checkValue = checkName.join()
        this.$emit('setGoback', this.checkValue)
      } else {
        const kkk = this.list.find(v => v.id === this.checkValue)
        if (kkk) this.checkValue = this.checkValue + '-' + kkk.ssName
        this.$emit('setGoback', this.checkValue)
      }
    },
    cancel() {
      this.$emit('setGoback', '')
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
        width: 180px;
        float: left;
        .el-checkbox {
          height: 28px;
        }

        .el-radio {
          height: 28px;
        }
      }
    }
  }
}
</style>
