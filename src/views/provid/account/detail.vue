<template>
  <div class="detail-wrapper">
    <div class="filter-container">
      <el-input class="filter-input"
        placeholder="请输入老人姓名"
        style="width: 280px;margin-right: 20px;"
        v-model="listQuery.olderName">
        <template slot="prepend">老人姓名</template>
      </el-input>
      <el-input class="filter-input"
        placeholder="请输入身份证号"
        style="width: 280px;margin-right: 20px;"
        v-model="listQuery.idCard">
        <template slot="prepend">身份证号</template>
      </el-input>
      <el-button type="primary"
        icon="el-icon-search"
        @click="handleQuery()">查询</el-button>
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
      <el-table-column label="电子结算账单（民政）"
        align="center">
        <el-table-column label="姓名"
          prop="typeName"
          align="center">
        </el-table-column>
        <el-table-column label="身份证号"
          prop="typeName"
          align="center">
        </el-table-column>
        <el-table-column label="发放补贴额"
          align="center">
          <el-table-column label="市（元）"
            prop="scale"
            align="center">
          </el-table-column>
          <el-table-column label="区（元）"
            prop="everyTime"
            align="center">
          </el-table-column>
          <el-table-column label="合计（元）"
            prop="describe"
            align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column label="订单总量"
          prop="describe"
          align="center">
        </el-table-column>
        <el-table-column label="订单总额"
          prop="describe"
          align="center">
        </el-table-column>
        <el-table-column label="补贴总额"
          align="center">
          <el-table-column label="市（元）"
            prop="scale"
            align="center">
          </el-table-column>
          <el-table-column label="区（元）"
            prop="everyTime"
            align="center">
          </el-table-column>
          <el-table-column label="合计（元）"
            prop="describe"
            align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column label="退款总额"
          prop="scale"
          align="center">
        </el-table-column>
        <el-table-column label="清零总额"
          align="center">
          <el-table-column label="市（元）"
            prop="scale"
            align="center">
          </el-table-column>
          <el-table-column label="区（元）"
            prop="everyTime"
            align="center">
          </el-table-column>
          <el-table-column label="合计（元）"
            prop="describe"
            align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column label="当前余额"
          align="center">
          <el-table-column label="市（元）"
            prop="scale"
            align="center">
          </el-table-column>
          <el-table-column label="区（元）"
            prop="everyTime"
            align="center">
          </el-table-column>
          <el-table-column label="合计（元）"
            prop="describe"
            align="center">
          </el-table-column>
        </el-table-column>
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
</template>

<script>
import { getRecordList } from '@/api/page'
import { allApi } from '@/api/config'

const list = [
  {
    id: '1',
    type: '0',
    typeName: '0'
  },
  {
    id: '2',
    type: '0',
    typeName: '0'
  },
  {
    id: '3',
    type: '0',
    typeName: '0'
  },
  {
    id: '4',
    type: '0',
    typeName: '0'
  },
  {
    id: '5',
    type: '0',
    typeName: '0'
  }
]

export default {
  name: 'accountDetail',
  data() {
    return {
      list,
      listQuery: {
        olderName: '',
        idCard: ''
      },
      currentPage: 1,
      pageSize: 5,
      totalOlders: 18
    }
  },
  created() {
    this.handleQuery(this.currentPage, this.pageSize)
  },
  methods: {
    handleQuery(currentPage, pageSize) {
      const apiUrl = allApi.subsidystatistics.getDetails
      if (currentPage && pageSize) {
        getRecordList(apiUrl, {
          page: currentPage,
          pageSize: pageSize
        }).then(response => {
          this.totalOlders = response.data.totalRecord
          this.list = response.data.dataList
          console.log(111, response)
        })
      } else {
        getRecordList(apiUrl, {
          page: this.currentPage,
          pageSize: this.pageSize
        }).then(response => {
          this.totalOlders = response.data.totalRecord
          this.list = response.data.dataList
        })
      }
    },
    handleCurrentChange(val) {
      this.handleQuery(val, this.pageSize)
    },
    handNumChange() {
      this.form.charge = this.form.charge.replace(/[^0-9]/g, '')
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-wrapper {
  padding: 0 20px 20px;
}
</style>
