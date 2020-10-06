<template>
  <div class="main-container">
    <div class="filter-container">
      <el-input class="filter-input"
        placeholder="请输入老人名称"
        style="width: 280px;margin-right: 20px;"
        v-model="listQuery.reserve1">
        <template slot="prepend">老人名称</template>
      </el-input>
      <el-button type="primary"
        icon="el-icon-search"
        @click="handleQuery()">查询</el-button>
    </div>
    <el-tabs type="border-card">
      <el-tab-pane label="血压记录">
        <older-pressure :listRow="listHandlerRow"></older-pressure>
      </el-tab-pane>
      <el-tab-pane label="血糖记录">
        <older-sugar :listRow="listHandlerRow"></older-sugar>
      </el-tab-pane>
      <el-tab-pane label="血氧记录">
        <older-oxygen :listRow="listHandlerRow"></older-oxygen>
      </el-tab-pane>
      <el-tab-pane label="心率记录">
        <older-htrate :listRow="listHandlerRow"></older-htrate>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import olderPressure from './components/press'
import olderOxygen from './components/oxygen'
import olderSugar from './components/sugar'
import olderHtrate from './components/htrate'
import { getOlderList } from '@/api/older'

const olderList = [
  {
    olderId: '',
    orgContent: '蔡甸养老院',
    olderName: 'hhh'
  },
  {
    olderId: '',
    orgContent: '蔡甸养老院',
    olderName: 'fff'
  },
  {
    olderId: '',
    orgContent: '蔡甸养老院',
    olderName: 'yyy'
  }
]

const organOptions = [
  {
    dicKey: '01',
    dicValue: '蔡甸养老院'
  }
]

export default {
  name: 'HelloWorld',
  components: {
    olderPressure,
    olderOxygen,
    olderSugar,
    olderHtrate
  },
  data() {
    return {
      btnPowers: null,
      olderList,
      listQuery: {
        reserve1: ''
      },
      organOptions,
      organName: '',
      currentPage: 1,
      pageSize: 12,
      totalOlders: 26,
      listHandlerRow: null
    }
  },
  mounted() {
    this.btnPowers = this.$route.meta.btnList
    console.log('btnPowers', this.btnPowers)

    this.handleQuery(this.currentPage, this.pageSize)
  },
  methods: {
    handleOrgChanged(val) {
      console.log(val)
    },
    handleQuery(currentPage, pageSize) {
      getOlderList(currentPage, pageSize).then(response => {
        this.totalOlders = response.data.totalRecord
        this.olderList = response.data.dataList
      })
    },
    clickTable(row, event, column) {
      this.listHandlerRow = row
    },
    handleCurrentChange(val) {
      this.handleQuery(val, this.pageSize)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tab-pane {
  min-height: 600px;
}
</style>
