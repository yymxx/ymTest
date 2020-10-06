<template>
  <div>
    <el-table border
      :data="list"
      style="width: 100%;">
      <el-table-column label="下单时间"
        prop="applyTime"
        align="center">
      </el-table-column>
      <el-table-column label="下单人"
        prop="reserve1"
        align="center">
      </el-table-column>
      <el-table-column label="工单编号"
        prop="orderNum"
        align="center">
      </el-table-column>
      <el-table-column label="工单状态"
        prop="orderState"
        align="center">
      </el-table-column>
      <el-table-column label="工单金额"
        prop="wdPrice"
        align="center">
      </el-table-column>
      <el-table-column label="服务日期"
        prop="sTime"
        align="center">
      </el-table-column>
      <el-table-column label="服务项目"
        prop="spContent"
        align="center">
      </el-table-column>
      <el-table-column label="服务内容"
        prop="spContent"
        align="center">
      </el-table-column>
      <el-table-column label="工单备注"
        prop="wdRemarks"
        align="center">
      </el-table-column>
    </el-table>
    <div style="text-align: center;padding-top: 20px;">
      <el-pagination background
        hide-on-single-page
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20]"
        :page-size="pageSize"
        layout="total, prev, pager, next, sizes"
        :total="totalOlders"></el-pagination>
    </div>
  </div>
</template>

<script>
import { getRecordList } from '@/api/page'
import { allApi } from '@/api/config'

export default {
  name: 'orderWait',
  data() {
    return {
      list: [],
      currentPage: 1,
      pageSize: 10,
      totalOlders: 30
    }
  },
  props: ['orderNum'],
  watch: {
    orderNum(newVal, oldVal) {
      this.handleQuery(this.currentPage, this.pageSize, newVal)
    }
  },
  created() {
    this.handleQuery(this.currentPage, this.pageSize)
  },
  methods: {
    handleQuery(currentPage, pageSize, num) {
      let wdNum = ''
      if (num) wdNum = num
      const apiUrl = allApi.orderrecord.getList
      getRecordList(apiUrl, {
        page: currentPage,
        pageSize: pageSize,
        orderState: 1,
        wdNum: wdNum
      }).then(response => {
        this.totalOlders = response.data.totalRecord
        this.list = response.data.dataList
      })
    },
    handleSizeChange(val) {
      this.currentPage = 1
      this.handleQuery(this.currentPage, val)
    },
    handleCurrentChange(val) {
      this.handleQuery(val, this.pageSize)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
