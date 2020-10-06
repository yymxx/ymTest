<template>
  <div>
    <el-table border
      :data="list"
      style="width: 100%;">
      <el-table-column label="来电时间"
        prop="callTime"
        align="center">
      </el-table-column>
      <el-table-column label="来电人"
        prop="reserve1"
        align="center">
      </el-table-column>
      <el-table-column label="来电号码"
        prop="callNumber"
        align="center">
      </el-table-column>
      <el-table-column label="接线坐席"
        prop="zuoxiRecord.exteName"
        align="center">
      </el-table-column>
      <el-table-column label="通话时长"
        prop="talkTime"
        align="center">
      </el-table-column>
      <el-table-column label="来电原因"
        prop="callTypeStr"
        align="center">
      </el-table-column>
      <el-table-column label="操作"
        align="center"
        width="240">
        <template slot-scope="scope">
          <el-button type="primary"
            size="mini"
            @click="handleDetail(scope.row)">查看</el-button>
          <el-button type="primary"
            size="mini"
            @click="handleDetail(scope.row)">播放录音</el-button>
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
  name: 'shoutRing',
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
