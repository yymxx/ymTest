<template>
  <div>
    <div class="dept-wrapper">
      <div class="filter-container">
        <el-input class="filter-input"
          placeholder="请输入证件号码"
          style="width: 280px;margin-right: 20px;"
          v-model="listQuery.idCard">
          <template slot="prepend">证件号码</template>
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
        <el-table-column label="姓名"
          prop="oldName"
          align="center">
        </el-table-column>
        <el-table-column label="证件号码"
          prop="idNumber"
          align="center">
        </el-table-column>
        <el-table-column label="年龄"
          prop="age"
          align="center"
          width="110">
        </el-table-column>
        <el-table-column label="联系电话"
          prop="telephone"
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
  name: 'markChoose',
  data() {
    return {
      list: [],
      listQuery: {
        name: '',
        idCard: ''
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
      let apiUrl = allApi.areasubsidytarget.mark
      getRecordList(apiUrl, {
        page: this.currentPage,
        pageSize: this.pageSize,
        effectiveSign: this.listQuery.idCard
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
      this.handleQuery(val, this.pageSize)
    },
    update() {
      if (this.isRadio) {
        if (this.mulSelection.length === 1) {
          const row = this.mulSelection[0]
          this.checkValue = row.id + '-' + row.oldName
          this.$emit('setGoback', this.checkValue)
        } else {
          this.$message({
            type: 'warning',
            message: '请选择一条记录'
          })
        }
      } else {
        const checkName = this.mulSelection.reduce((res, item) => {
          return res.concat(item.id + '-' + item.oldName)
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
