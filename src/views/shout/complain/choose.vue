<template>
  <div>
    <div class="dept-container">
      <div class="dept-wrapper">
        <div class="filter-container">
          <el-input class="filter-input"
            placeholder="请输入老人姓名"
            style="width: 280px;margin-right: 20px;"
            v-model="listQuery.reserve1">
            <template slot="prepend">老人姓名</template>
          </el-input>
          <el-input class="filter-input"
            placeholder="请输入联系电话"
            style="width: 280px;margin-right: 20px;"
            v-model="listQuery.cPhone">
            <template slot="prepend">联系电话</template>
          </el-input>
          <el-button type="primary"
            icon="el-icon-search"
            @click="handleQuery()">查询</el-button>
        </div>
        <el-table border
          :data="list"
          style="width: 100%;"
          ref="checkTable"
          @selection-change="handleSelectChange">
          <el-table-column type="selection"
            align="center"
            width="70">
          </el-table-column>
          <el-table-column label="工单编号"
            prop="wdNum"
            align="center"
            width="150">
          </el-table-column>
          <el-table-column label="老人姓名"
            prop="customer.oldName"
            align="center">
          </el-table-column>
          <el-table-column label="联系电话"
            prop="customer.telephone"
            align="center">
          </el-table-column>
          <el-table-column label="服务项目"
            prop="spContent"
            align="center"
            width="180">
          </el-table-column>
          <el-table-column label="服务站/商家"
            prop="servicestation.ssName"
            align="center"
            width="150">
          </el-table-column>
          <el-table-column label="工单状态"
            prop="reserve3"
            align="center">
          </el-table-column>
        </el-table>
        <div style="text-align: center;padding-top: 20px;">
          <el-pagination background
            hide-on-single-page
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next"
            :total="totalOlders"></el-pagination>
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
      listQuery: {
        reserve1: '',
        cPhone: ''
      },
      checkValue: '',
      checkList: [],
      checkAll: false,
      isIndeterminate: false,
      currDept: null,
      mulSelection: [],
      currentPage: 1,
      pageSize: 10,
      totalOlders: 30,
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
    this.handleQuery(this.currentPage, this.pageSize)
    this.initChecked()
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
    handleQuery(currentPage, pageSize, data) {
      this.currentPage = 1
      if (currentPage) this.currentPage = currentPage
      const apiUrl = allApi.workorder.getList
      getRecordList(apiUrl, {
        page: currentPage,
        pageSize: pageSize,
        reserve1: this.listQuery.reserve1,
        cPhone: this.listQuery.cPhone,
        create_user: this.sysUser.id,
        organizationId: this.sysUser.institutionsId
      }).then(response => {
        console.log(response)
        this.list = response.data.dataList
        this.totalOlders = response.data.totalRecord
      })
    },
    handleSelectChange(val) {
      this.mulSelection = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.handleQuery(val, this.pageSize)
    },
    update() {
      if (this.mulSelection.length === 1) {
        const row = this.mulSelection[0]
        this.checkValue = row.id + '-' + row.wdNum
        this.$emit('setGoback', row)
      } else {
        this.$message({
          type: 'warning',
          message: '请选择一条记录'
        })
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
  padding: 0 10px;
  .dept-wrapper /deep/ {
    padding-bottom: 30px;
    .el-table {
      td {
        padding: 5px 0 !important;
      }
    }
  }
}
</style>
