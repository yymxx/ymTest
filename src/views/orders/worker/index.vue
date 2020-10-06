<template>
  <div class="main-container">
    <div class="filter-container">
      <el-input class="filter-input"
        placeholder="请输入工单编号"
        style="width: 280px;margin-right: 20px;"
        v-model="listQuery.wdNum">
        <template slot="prepend">工单编号</template>
      </el-input>
      <el-button type="primary"
        icon="el-icon-search"
        @click="handleQuery()">查询</el-button>
    </div>
    <el-table border
      :data="list"
      style="width: 100%;">
      <el-table-column width="60"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单时间"
        :show-overflow-tooltip="true"
        prop="workorder.applyTime"
        align="center">
      </el-table-column>
      <el-table-column label="下单渠道"
        :show-overflow-tooltip="true"
        prop="reserve1"
        align="center">
      </el-table-column>
      <el-table-column label="下单人"
        :show-overflow-tooltip="true"
        prop="reserve2"
        align="center">
      </el-table-column>
      <el-table-column label="老人姓名"
        :show-overflow-tooltip="true"
        prop="customer.oldName"
        align="center">
      </el-table-column>
      <el-table-column label="老人号码"
        :show-overflow-tooltip="true"
        prop="customer.telephone"
        align="center">
      </el-table-column>
      <el-table-column label="工单编号"
        :show-overflow-tooltip="true"
        prop="workorder.wdNum"
        align="center">
      </el-table-column>
      <el-table-column label="工单状态"
        :show-overflow-tooltip="true"
        prop="reserve3"
        align="center">
      </el-table-column>
      <el-table-column label="服务金额"
        :show-overflow-tooltip="true"
        prop="workorder.wdPrice"
        align="center">
      </el-table-column>
      <el-table-column label="服务项目"
        :show-overflow-tooltip="true"
        prop="spContent"
        align="center">
      </el-table-column>
      <el-table-column label="服务日期"
        :show-overflow-tooltip="true"
        prop="workorder.sTime"
        align="center">
      </el-table-column>
      <el-table-column label="操作时间"
        :show-overflow-tooltip="true"
        prop="create_time"
        align="center">
      </el-table-column>
      <el-table-column label="工单备注"
        :show-overflow-tooltip="true"
        prop="workorder.wdRemarks"
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
    <!-- <el-tabs type="border-card">
      <el-tab-pane label="待派单工单">
        <order-wait :orderNum="wdNum"></order-wait>
      </el-tab-pane>
      <el-tab-pane label="待服务工单">
        <order-send :orderNum="wdNum"></order-send>
      </el-tab-pane>
      <el-tab-pane label="进行中工单">
        <order-work :orderNum="wdNum"></order-work>
      </el-tab-pane>
      <el-tab-pane label="待回访工单">
        <order-visit :orderNum="wdNum"></order-visit>
      </el-tab-pane>
      <el-tab-pane label="异常工单">
        <order-abnormal :orderNum="wdNum"></order-abnormal>
      </el-tab-pane>
      <el-tab-pane label="已结算工单">
        <order-completed orderState="6"
          :orderNum="wdNum"></order-completed>
      </el-tab-pane>
      <el-tab-pane label="待结算工单">
        <order-completed orderState="7"
          :orderNum="wdNum"></order-completed>
      </el-tab-pane>
    </el-tabs> -->
  </div>
</template>

<script>
import orderWait from './components/wait'
import orderSend from './components/send'
import orderWork from './components/work'
import orderVisit from './components/visit'
import orderCompleted from './components/completed'
import orderAbnormal from './components/abnormal'
import { getRecordList } from '@/api/page'
import { allApi } from '@/api/config'
import { mapGetters } from 'vuex'

export default {
  name: 'HelloWorld',
  components: {
    orderWait,
    orderSend,
    orderWork,
    orderVisit,
    orderCompleted,
    orderAbnormal
  },
  data() {
    return {
      wdNum: '',
      list: [],
      btnPowers: null,
      listQuery: {
        wdNum: ''
      },
      currentPage: 1,
      pageSize: 10,
      totalOlders: 30
    }
  },
  computed: {
    ...mapGetters(['sysUser'])
  },
  mounted() {
    this.btnPowers = this.$route.meta.btnList
    console.log('btnPowers', this.btnPowers)

    this.handleQuery(this.currentPage, this.pageSize)
  },
  methods: {
    handleQuery(currentPage, pageSize) {
      this.currentPage = 1
      if (currentPage) this.currentPage = currentPage
      // this.wdNum = this.listQuery.wdNum
      const apiUrl = allApi.orderrecord.getList
      getRecordList(apiUrl, {
        page: this.currentPage,
        pageSize: this.pageSize,
        create_user: this.sysUser.id,
        organizationId: this.sysUser.institutionsId,
        orderNum: this.listQuery.wdNum
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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
