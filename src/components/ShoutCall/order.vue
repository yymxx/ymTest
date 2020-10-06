<template>
  <div>
    <el-table border
      :data="list"
      style="width: 100%;">
      <el-table-column label="工单编号"
        prop="wdNum"
        align="center">
      </el-table-column>
      <el-table-column label="预约时间"
        prop="sTime"
        align="center">
      </el-table-column>
      <el-table-column label="服务类型"
        prop="spContent"
        align="center">
      </el-table-column>
      <el-table-column label="助老员"
        prop="helpelderly.heName"
        align="center">
      </el-table-column>
      <el-table-column label="服务站"
        prop="servicestation.ssName"
        align="center">
      </el-table-column>
      <el-table-column label="服务状态"
        prop="reserve3"
        align="center">
      </el-table-column>
      <el-table-column label="操作"
        align="center"
        width="150">
        <template slot-scope="scope">
          <el-button type="primary"
            size="mini"
            @click="handleDetail(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <div style="text-align: center;padding-top: 20px;">
      <el-pagination background
        hide-on-single-page
        @current-change="handleOneChange"
        :current-page.sync="currOnePage"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="totalOneNotes"></el-pagination>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'shoutOrder',
  data() {
    return {
      pageSize: 5,
      currOnePage: 1,
      totalOneNotes: 3
    }
  },
  props: ['list'],
  watch: {
    list(newVal, oldVal) {
      console.log(newVal)
    }
  },
  methods: {
    handleQuery(currentPage, pageSize) {},
    handleOneChange(val) {
      this.handleQuery(val, this.pageSize)
    },
    handleDetail(row) {}
  }
}
</script>

<style lang="scss" scoped>
</style>
