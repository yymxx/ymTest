<template>
  <div class="main-container">
    <div class="filter-container">
      <div class="time-editor">
        <div class="type">
          刷卡时间
        </div>
        <el-date-picker v-model="timeQuerys"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <el-input class="filter-input"
        placeholder="请输入工单编号"
        style="width: 280px;margin-right: 20px;"
        v-model="listQuery.wdNum">
        <template slot="prepend">工单编号</template>
      </el-input>
      <el-input class="filter-input"
        placeholder="请输入老人姓名"
        style="width: 280px;margin-right: 20px;"
        v-model="listQuery.reserve1">
        <template slot="prepend">老人姓名</template>
      </el-input>
      <el-input class="filter-input"
        placeholder="请输入联系电话"
        style="width: 280px;margin-right: 20px;"
        v-model="listQuery.cPhone">
        <template slot="prepend">联系电话</template>
      </el-input>
      <el-button type="primary"
        icon="el-icon-search"
        @click="handleQuery()">查询</el-button>
    </div>
    <div class="filter-container">
      <card-reader incident="order"
        @setGoback="handleCardback"></card-reader>
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
      <el-table-column label="刷卡时间"
        prop="applyTime"
        align="center"
        width="200">
      </el-table-column>
      <el-table-column label="工单编号"
        prop="wdNum"
        align="center">
      </el-table-column>
      <el-table-column label="老人姓名"
        prop="customer.oldName"
        align="center">
      </el-table-column>
      <el-table-column label="联系电话"
        prop="customer.telephone"
        align="center">
      </el-table-column>
      <el-table-column label="服务项目"
        prop="spContent"
        align="center">
      </el-table-column>
      <el-table-column label="服务金额"
        prop="wdPrice"
        align="center">
      </el-table-column>
      <el-table-column label="服务站/商家"
        prop="servicestation.ssName"
        align="center">
      </el-table-column>
      <el-table-column label="工单状态"
        prop="reserve3"
        align="center">
      </el-table-column>
      <el-table-column label="操作"
        align="center"
        width="150">
        <template slot-scope="scope">
          <el-button type="primary"
            size="mini"
            @click="handleDetail(scope.row)">工单详情</el-button>
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

    <el-dialog title="刷卡就餐"
      @close="clearFormValidate('form')"
      :visible.sync="dialogFormVisible"
      width="650px">
      <el-form :inline="true"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="120px">
        <div style="margin: 0 60px 30px;">
          <table width="100%"
            cellpadding="0"
            cellspacing="0"
            border="1"
            class="detail-table">
            <tr v-for="(row, num) in basics"
              :key="num">
              <td v-for="(item, index) in row"
                :key="index">
                <div v-if="index%2==1"
                  class="td-box">
                  <span>{{ form[item] }}</span>
                </div>
                <div v-else
                  class="td-center">
                  <span>{{ item }}</span>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </el-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'"
          type="primary"
          @click="create('form')">确 定</el-button>
        <el-button v-if="dialogStatus=='update'"
          type="primary"
          @click="update('form')">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog width="1200px"
      title="工单详细记录"
      :visible.sync="dialogIsDetail"
      @close="dialogDetailClose()"
      :close-on-click-modal="false">
      <sheet-detail v-if="dialogIsDetail"
        :row-data="listHandlerRow"></sheet-detail>
    </el-dialog>

    <el-dialog width="800px"
      title="点击地图选择地址"
      :visible.sync="dialogMapShow"
      @close="dialogMapClose()"
      :close-on-click-modal="false">
      <gould-map v-if="dialogMapShow"
        @setGoback="handleMapback"></gould-map>
    </el-dialog>
  </div>
</template>

<script>
import { getRecordList, addRecord, findByDicCode } from '@/api/page'
import { allApi } from '@/api/config'
import gouldMap from '@/components/GouldMap'
import cardReader from '@/components/CardReader'
import sheetDetail from './detail'
import { mapGetters } from 'vuex'

const notes = {
  id: null,
  oldcard: '',
  idNumber: '',
  oldName: '',
  telephone: '',
  reserve1: '',
  wdPrice: 0
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
    gouldMap,
    cardReader,
    sheetDetail
  },
  data() {
    return {
      list,
      btnPowers: null,
      options: {
        visit: [],
        wdState: []
      },
      listPar: [],
      listQuar: [],
      stationTree: [],
      timeQuerys: [],
      listQuery: {
        reserve1: '',
        cPhone: '',
        cIdCard: '',
        spId: '',
        wdState: '',
        stId: '',
        wdNum: ''
      },
      currentPage: 1,
      pageSize: 10,
      totalOlders: 30,
      basics: [],
      dialogMapShow: false,
      dialogFormVisible: false,
      dialogStatus: '',
      listHandlerRow: null,
      dialogIsDetail: false,
      form: { ...notes },
      rules: {
        dicKey: [
          {
            required: true,
            message: '请输入字典键',
            trigger: 'blur'
          }
        ]
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
    const apiUrl = allApi.orderrecord.station
    getRecordList(apiUrl, {
      spState: 3
    }).then(response => {
      this.stationTree = response.data
    })
  },
  methods: {
    findDicList() {
      findByDicCode('visitClass').then(response => {
        this.options.visit = response.data.dataList
      })

      findByDicCode('wdState').then(response => {
        this.options.wdState = response.data.dataList
      })
    },
    handleQuery(currentPage, pageSize) {
      this.currentPage = 1
      if (currentPage) this.currentPage = currentPage
      const apiUrl = allApi.cardorder.cardList
      getRecordList(apiUrl, {
        page: this.currentPage,
        pageSize: this.pageSize,
        reserve1: this.listQuery.reserve1,
        cPhone: this.listQuery.cPhone,
        reserve2: this.timeQuerys[0],
        reserve3: this.timeQuerys[1],
        wdNum: this.listQuery.wdNum,
        create_user: this.sysUser.id,
        roleId: this.sysUser.roleId,
        organizationId: this.sysUser.institutionsId
      }).then(response => {
        console.log(555, response)
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
    handleCader() {
      this.listQuery.spId = this.listQuar[0]
      this.listQuery.stId = this.listQuar[1]
    },
    handleCardback(val) {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.form = { ...notes }
      this.basics = [
        ['姓名', 'oldName'],
        ['手机号', 'telephone'],
        ['身份证号', 'idNumber'],
        ['服务中心', 'reserve1']
      ]

      getRecordList(allApi.cardorder.olderbycard, {
        oldcard: val
      }).then(response => {
        console.log(555, response)
        for (const key in this.form) {
          this.form[key] = response.data[key]
        }

        this.form.oldcard = val
      })
    },
    create(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          const apiUrl = allApi.cardorder.addCard
          addRecord(apiUrl, {
            cId: this.form.id,
            wdPrice: this.form.wdPrice,
            create_user: this.sysUser.id,
            organizationId: this.sysUser.institutionsId
          }).then(res => {
            console.log(res)
            if (res.data === 1) {
              this.handleQuery(this.currentPage, this.pageSize)
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            } else {
              if (res.msg !== '') {
                this.$message({
                  type: 'warning',
                  message: res.msg
                })
              }
            }
          })
        } else {
          return false
        }
      })
    },
    handleDetail(row) {
      this.dialogIsDetail = true
      this.listHandlerRow = row
    },
    dialogDetailClose() {
      this.dialogIsDetail = false
    },
    handleAddress() {
      this.dialogMapShow = true
    },
    handleMapback(data) {
      this.dialogMapShow = false
      this.form.sAddress = data.address
    },
    dialogMapClose() {
      this.dialogMapShow = false
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
.detail-table /deep/ {
  border-color: #fff;
  td {
    &:first-child {
      width: 100px;
    }

    .td-box {
      padding: 12px 20px;
    }

    .td-center {
      line-height: 40px;
      text-align: center;
    }
  }
}
</style>
