<template>
  <div class="main-container">
    <older-detail v-if="isDetail"
      :own-path="ownPath"
      :row-data="listHandlerRow"
      @setGoback="handleGoback"></older-detail>
    <div v-else>
      <div class="filter-container"
        style="flex-wrap: nowrap;">
        <div class="time-editor">
          <div class="type">月份</div>
          <el-date-picker type="month"
            v-model="timeQuerys"
            format="yyyy.MM"
            value-format="yyyy.MM"
            placeholder="选择月">
          </el-date-picker>
        </div>
        <el-button type="primary"
          icon="el-icon-search"
          @click="handleQuery()">查询</el-button>
        <div style="width: 100%;text-align: right;">
          <el-button type="primary"
            @click="handleRule()">补贴计算规则</el-button>
          <el-button type="warning"
            icon="el-icon-edit"
            @click="handleOutExcel()">导出</el-button>
        </div>
      </div>
      <el-table border
        :data="list"
        style="width: 100%;"
        ref="checkTable"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection"
          align="center"
          width="70">
        </el-table-column>
        <el-table-column label="月份"
          prop="month"
          align="center">
        </el-table-column>
        <el-table-column label="消费总计(a)"
          align="center">
          <el-table-column label="订单数"
            prop="orderAnumber"
            align="center">
          </el-table-column>
          <el-table-column label="补贴总额"
            prop="totalSubsidy"
            align="center">
          </el-table-column>
          <el-table-column label="市级实际补贴"
            prop="cityAsubsidy"
            align="center">
          </el-table-column>
          <el-table-column label="区级实际补贴"
            prop="areaAsubsidy"
            align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column label="本区户籍老人在本区刷卡消费(b)"
          align="center">
          <el-table-column label="订单数"
            prop="orderBnumber"
            align="center">
          </el-table-column>
          <el-table-column label="订单金额"
            prop="orderBamount"
            align="center">
          </el-table-column>
          <el-table-column label="市级补贴"
            prop="cityBsubsidy"
            align="center">
          </el-table-column>
          <el-table-column label="区级补贴"
            prop="areaBsubsidy"
            align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column label="外区户籍老人在本区刷卡消费(c)"
          align="center">
          <el-table-column label="订单数"
            prop="orderCnumber"
            align="center">
          </el-table-column>
          <el-table-column label="订单金额"
            prop="orderCamount"
            align="center">
          </el-table-column>
          <el-table-column label="市级补贴"
            prop="cityCsubsidy"
            align="center">
          </el-table-column>
          <el-table-column label="区级补贴"
            prop="areaCsubsidy"
            align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column label="本区户籍老人在外区刷卡消费(d)"
          align="center">
          <el-table-column label="订单数"
            prop="orderDnumber"
            align="center">
          </el-table-column>
          <el-table-column label="订单金额"
            prop="orderDamount"
            align="center">
          </el-table-column>
          <el-table-column label="市级补贴"
            prop="cityDsubsidy"
            align="center">
          </el-table-column>
          <el-table-column label="区级补贴"
            prop="areaDsubsidy"
            align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column label="操作"
          align="center"
          width="150">
          <template slot-scope="scope">
            <el-button type="primary"
              size="mini"
              @click="handleDetail(scope.row)">明细</el-button>
          </template>
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

    <el-dialog width="600px"
      title="补贴计算规则"
      :visible.sync="dialogRuleShow"
      @close="dialogOldClose()"
      :close-on-click-modal="false">
      <div class="rule">
        <p>区级实际补贴总额=结算单a x 50%</p>
        <p>市级实际补贴总额=结算单a x 50% + 对账单c - 对账单d</p>
        <p>结算单a：各区每月户籍老人实际消费补贴总额</p>
        <p>对账单b：本区户籍老人在本辖区发生的消费金额</p>
        <p>对账单c：外区户籍老人在本辖区发生的消费金额</p>
        <p>对账单d：本区户籍老人在外区发生的消费金额</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRecordList, findByDicCode } from '@/api/page'
import { allApi } from '@/api/config'
import { mapGetters } from 'vuex'
import olderDetail from './detail'

const notes = {
  id: null,
  spId: '',
  orderNum: '',
  memberName: '',
  spCode: '',
  orderClass: '',
  orderTime: '',
  orderMoney: '',
  orderState: '',
  operator: ''
}

const outObj = {
  month: '月份',
  orderAnumber: '订单数(a)',
  totalSubsidy: '补贴总额',
  cityAsubsidy: '市级实际补贴',
  areaAsubsidy: '区级实际补贴',
  orderBnumber: '订单数(b)',
  orderBamount: '订单金额(b)',
  cityBsubsidy: '市级补贴(b)',
  areaBsubsidy: '区级补贴(b)',
  orderCnumber: '订单数(c)',
  orderCamount: '订单金额(c)',
  cityCsubsidy: '市级补贴(c)',
  areaCsubsidy: '区级补贴(c)',
  orderDnumber: '订单数(d)',
  orderDamount: '订单金额(d)',
  cityDsubsidy: '市级补贴(d)',
  areaDsubsidy: '区级补贴(d)',
  create_time: '创建时间'
}

const list = [
  {
    id: '1'
  },
  {
    id: '2'
  }
]

export default {
  name: 'HelloWorld',
  components: {
    olderDetail
  },
  data() {
    return {
      list,
      outObj,
      btnPowers: null,
      options: {
        wdClass: []
      },
      timeQuerys: '',
      mulSelection: [],
      currentPage: 1,
      pageSize: 10,
      totalOlders: 30,
      isDetail: false,
      ownPath: this.$route.path,
      listHandlerRow: null,
      isReadonly: false,
      dialogRuleShow: false,
      form: { ...notes },
      rules: {
        dicKey: [
          {
            required: true,
            message: '请输入字典键',
            trigger: 'blur'
          }
        ]
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建',
        detail: '详情'
      }
    }
  },
  computed: {
    ...mapGetters(['sysUser'])
  },
  created() {
    this.btnPowers = this.$route.meta.btnList
    console.log('btnPowers', this.btnPowers)

    this.findDicList()
    this.handleQuery(this.currentPage, this.pageSize)
  },
  mounted() {
    if (this.$route.query.accId) {
      this.isDetail = true
    }
  },
  methods: {
    findDicList() {
      findByDicCode('wdClass').then(response => {
        this.options.wdClass = response.data.dataList
      })
    },
    handleQuery(currentPage, pageSize) {
      this.currentPage = 1
      if (currentPage) this.currentPage = currentPage
      const apiUrl = allApi.spreconciliation.accList
      getRecordList(apiUrl, {
        page: this.currentPage,
        pageSize: this.pageSize,
        month: this.timeQuerys
      }).then(response => {
        this.totalOlders = response.data.totalRecord
        this.list = response.data.dataList
        console.log(666, this.list)
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

          getRecordList(allApi.spreconciliation.accList, {
            page: 1,
            pageSize: 30
          }).then(response => {
            const kkk = response.data.dataList
            vendor.export_json_to_excel(
              tHeader,
              kkk.map(v => filterVal.map(j => v[j])),
              '补贴对账单'
            )
          })
        })
      })
    },
    handleSelectionChange(val) {
      this.mulSelection = val
    },
    handleDetail(row) {
      this.isDetail = true
      this.listHandlerRow = row
      this.$router.push({
        path: this.ownPath,
        query: { accId: row.id }
      })
    },
    handleGoback(data) {
      this.isDetail = false
    },
    handleRule() {
      this.dialogRuleShow = true
    },
    dialogOldClose() {
      this.dialogRuleShow = false
    },
    cancel(formName) {
      this.dialogFormVisible = false
    },
    clearFormValidate(formName) {
      this.$refs[formName].clearValidate()
    }
  }
}
</script>

<style lang="scss" scoped>
.rule {
  padding-left: 30px;
  p {
    height: 45px;
    line-height: 45px;
    font-size: 16px;
  }
}

.el-table /deep/ {
  .is-group {
    th {
      background: #fff;
    }
  }
}
</style>
