<template>
  <div class="main-container">
    <div class="filter-container"
      style="flex-wrap: nowrap;">
      <div class="time-editor">
        <div class="type">日期</div>
        <!-- <el-date-picker v-model="timeQuerys"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker> -->
        <el-date-picker v-model="timeQuerys"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </div>
      <el-button type="primary"
        icon="el-icon-search"
        @click="handleQuery()">查询</el-button>
      <div style="width: 100%;text-align: right;">
        <el-button type="warning"
          icon="el-icon-edit"
          @click="handleOutExcel()">导出</el-button>
      </div>
    </div>
    <el-table border
      :data="list"
      style="width: 100%;">
      <el-table-column width="60"
        header-align="center"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电子结算清单（民政）"
        align="center">
        <el-table-column label="行政划区"
          prop="regionalDivision"
          align="center">
        </el-table-column>
        <el-table-column label="发放补贴额"
          align="center">
          <el-table-column label="市（元）"
            prop="cSubsidyAmount"
            align="center">
          </el-table-column>
          <el-table-column label="区（元）"
            prop="aSubsidyAmount"
            align="center">
          </el-table-column>
          <el-table-column label="合计（元）"
            prop="tSubsidyAmount"
            align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column label="订单总量"
          prop="totalNum"
          align="center">
        </el-table-column>
        <el-table-column label="订单总额"
          prop="totalOrders"
          align="center">
        </el-table-column>
        <el-table-column label="补贴总额"
          align="center">
          <el-table-column label="市（元）"
            prop="cSubsidyTotal"
            align="center">
          </el-table-column>
          <el-table-column label="区（元）"
            prop="aSubsidyTotal"
            align="center">
          </el-table-column>
          <el-table-column label="合计（元）"
            prop="tSubsidyTotal"
            align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column label="退款总额"
          prop="totalRefund"
          align="center">
        </el-table-column>
        <el-table-column label="清零总额"
          align="center">
          <el-table-column label="市（元）"
            prop="cClearTotal"
            align="center">
          </el-table-column>
          <el-table-column label="区（元）"
            prop="aClearTotal"
            align="center">
          </el-table-column>
          <el-table-column label="合计（元）"
            prop="tClearTotal"
            align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column label="当前余额"
          align="center">
          <el-table-column label="市（元）"
            prop="cCurrentBalance"
            align="center">
          </el-table-column>
          <el-table-column label="区（元）"
            prop="aCurrentBalance"
            align="center">
          </el-table-column>
          <el-table-column label="合计（元）"
            prop="tCurrentBalance"
            align="center">
          </el-table-column>
        </el-table-column>
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

    <el-dialog width="1200px"
      title="补贴结算明细"
      :visible.sync="dialogIsDetail"
      @close="dialogDetailClose()"
      :close-on-click-modal="false">
      <account-detail v-if="dialogIsDetail"
        :row-data="listHandlerRow"></account-detail>
    </el-dialog>
  </div>
</template>

<script>
import accountDetail from './detail'
import { getRecordList } from '@/api/page'
import { allApi } from '@/api/config'

const list = [
  {
    id: '1',
    orgContent: '蔡甸养老院',
    type: 'stay',
    typeName: '住宿费',
    scale: '普通间',
    charge: 300,
    everyTime: '每月',
    describe: '普通床位'
  },
  {
    id: '2',
    orgContent: '蔡甸养老院',
    type: 'stay',
    typeName: '住宿费',
    scale: '普通间',
    charge: 300,
    everyTime: '每月',
    describe: '普通床位'
  }
]

const outObj = {
  regionalDivision: '行政区划',
  cSubsidyAmount: '市发放补贴额(元)',
  aSubsidyAmount: '区发放补贴额(元)',
  tSubsidyAmount: '合计发放补贴额(元)',
  totalNum: '订单总量',
  totalOrders: '订单总额',
  cSubsidyTotal: '市补贴总额(元)',
  aSubsidyTotal: '区补贴总额(元)',
  tSubsidyTotal: '合计补贴总额(元)',
  totalRefund: '退款总额(元)',
  cClearTotal: '市清零总额(元)',
  aClearTotal: '区清零总额(元)',
  tClearTotal: '合计清零总额(元)',
  cCurrentBalance: '市当前余额(元)',
  aCurrentBalance: '区当前余额(元)',
  tCurrentBalance: '合计当前余额(元)'
}

export default {
  name: 'HelloWorld',
  components: {
    accountDetail
  },
  data() {
    return {
      list,
      outObj,
      btnPowers: null,
      timeQuerys: '',
      currentPage: 1,
      pageSize: 10,
      totalOlders: 30,
      listHandlerRow: null,
      dialogIsDetail: false
    }
  },
  created() {
    this.btnPowers = this.$route.meta.btnList
    console.log('btnPowers', this.btnPowers)

    this.handleQuery(this.currentPage, this.pageSize)
  },
  methods: {
    handleQuery(currentPage, pageSize) {
      this.currentPage = 1
      if (currentPage) this.currentPage = currentPage
      const apiUrl = allApi.subsidystatistics.getList
      getRecordList(apiUrl, {
        page: this.currentPage,
        pageSize: this.pageSize,
        ssCurrentTime: this.timeQuerys
      }).then(response => {
        this.totalOlders = response.data.totalRecord
        this.list = response.data.dataList
      })
    },
    handleSizeChange(val) {
      this.currentPage = 1
      this.pageSize = val
      this.handleQuery(this.currentPage, val)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.handleQuery(val, this.pageSize)
    },
    handleDetail(row) {
      // this.dialogIsDetail = true
      this.listHandlerRow = row
    },
    dialogDetailClose() {
      this.dialogIsDetail = false
    },
    handleOutExcel() {
      this.$confirm('此操作将导出excel文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        require.ensure([], () => {
          const vendor = require('@/vendor/Export2Excel')
          let tHeader = []
          let filterVal = []
          for (var key in this.outObj) {
            tHeader.push(this.outObj[key])
            filterVal.push(key)
          }

          getRecordList(allApi.subsidystatistics.getList, {
            page: 1,
            pageSize: 20
          }).then(response => {
            const kkk = response.data.dataList
            vendor.export_json_to_excel(
              tHeader,
              kkk.map(v => filterVal.map(j => v[j])),
              '补贴结算统计'
            )
          })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table /deep/ {
  .is-group {
    th {
      background: #fff;
    }
  }
}
</style>
