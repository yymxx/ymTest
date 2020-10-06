<template>
  <div>
    <div class="dept-wrapper">
      <div class="filter-container">
        <el-input class="filter-input"
          placeholder="请输入机构名称"
          style="width: 280px;margin-right: 20px;"
          v-model="listQuery.orgName">
          <template slot="prepend">机构名称</template>
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
        <el-table-column label="机构名称"
          prop="orgName"
          align="center">
        </el-table-column>
        <el-table-column label="行政划区"
          prop="addressName"
          align="center">
        </el-table-column>
        <el-table-column label="机构类型"
          prop="orgTypeStr"
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
  name: 'organOptions',
  data() {
    return {
      list: [],
      listQuery: {
        orgName: ''
      },
      checkValue: '',
      isRadio: false,
      mulSelection: [],
      currentPage: 1,
      pageSize: 10,
      totalOlders: 30
    }
  },
  props: ['data', 'multiple'],
  computed: {
    ...mapGetters(['sysUser'])
  },
  mounted() {
    this.isRadio = this.multiple === undefined
    if (this.data) this.checkValue = this.data
    this.handleQuery(this.currentPage, this.pageSize)
  },
  methods: {
    handleQuery(currentPage, pageSize) {
      this.currentPage = 1
      if (currentPage) this.currentPage = currentPage
      let apiUrl = allApi.organization.getList
      getRecordList(apiUrl, {
        page: this.currentPage,
        pageSize: this.pageSize,
        orgName: this.listQuery.orgName
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
      this.mulSelection = []
      this.handleQuery(val, this.pageSize)
    },
    update() {
      if (this.isRadio) {
        if (this.mulSelection.length === 1) {
          const row = this.mulSelection[0]
          this.checkValue = row.id + '-' + row.orgName
          this.$emit('setGoback', this.checkValue)
        } else {
          this.$message({
            type: 'warning',
            message: '请选择一条记录'
          })
        }
      } else {
        const checkName = this.mulSelection.reduce((res, item) => {
          return res.concat(item.id + '-' + item.orgName)
        }, [])

        this.checkValue = checkName.join()
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
.dept-wrapper /deep/ {
  padding: 0 30px 30px;
  .el-table {
    td {
      padding: 5px 0 !important;
    }
  }
}
</style>
