<template>
  <div class="main-container">
    <div class="filter-container"
      style="width: 1200px;">
      <div class="time-editor">
        <div class="type">
          下单时间
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
      <el-input class="filter-input"
        placeholder="请输入身份证号"
        style="width: 280px;margin-right: 20px;"
        v-model="listQuery.cIdCard">
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
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单时间"
        :show-overflow-tooltip="true"
        prop="applyTime"
        align="center"
        width="200">
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
      <el-table-column label="工单编号"
        :show-overflow-tooltip="true"
        prop="wdNum"
        align="center">
      </el-table-column>
      <el-table-column label="老人姓名"
        :show-overflow-tooltip="true"
        prop="customer.oldName"
        align="center">
      </el-table-column>
      <el-table-column label="联系电话"
        :show-overflow-tooltip="true"
        prop="customer.telephone"
        align="center">
      </el-table-column>
      <el-table-column label="服务项目"
        :show-overflow-tooltip="true"
        prop="spContent"
        align="center"
        width="200">
      </el-table-column>
      <el-table-column label="服务站/商家"
        :show-overflow-tooltip="true"
        prop="servicestation.ssName"
        align="center">
      </el-table-column>
      <el-table-column label="工单状态"
        :show-overflow-tooltip="true"
        prop="reserve3"
        align="center">
      </el-table-column>
      <el-table-column label="操作"
        align="center"
        width="150">
        <template slot-scope="scope">
          <el-button type="primary"
            size="mini"
            @click="handleVisit(scope.row)">回访</el-button>
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

    <el-dialog title="回访服务"
      @close="clearFormValidate('form')"
      :visible.sync="dialogVisitVisible"
      width="600px">
      <el-form :inline="true"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="110px">
        <div>
          <el-form-item label="老人姓名">
            <span>{{ form.oldName }}</span>
          </el-form-item>
          <el-form-item label="工单编号">
            <span>{{ form.wdNum }}</span>
          </el-form-item>
          <el-form-item label="回访方式"
            prop="exitClass">
            <el-select class="filter-item"
              clearable
              v-model="form.exitClass"
              placeholder="请选择"
              style="width: 240px">
              <el-option v-for="item in options.visit"
                :key="item.val"
                :label="item.dataKey"
                :value="item.val"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="服务评分"
            prop="isExitFree">
            <span class="filter-rate">
              <el-rate v-model="form.isExitFree"
                show-text></el-rate>
            </span>
          </el-form-item>
          <el-form-item label="回访记录"
            prop="exitRemarks">
            <el-input type="textarea"
              v-model="form.exitRemarks"
              placeholder="请输入回访记录"
              style="width: 380px;"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button type="primary"
          @click="update('form')">确定</el-button>
      </div>
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
import { getRecordList, updateRecord, findByDicCode } from '@/api/page'
import { allApi } from '@/api/config'
import gouldMap from '@/components/GouldMap'
import { mapGetters } from 'vuex'

const notes = {
  id: null,
  wdNum: '',
  oldName: '',
  suId: '',
  exitClass: '',
  isExitFree: '',
  exitRemarks: '',
  create_user: ''
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
    gouldMap
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
      dialogMapShow: false,
      dialogVisitVisible: false,
      dialogFormVisible: false,
      dialogStatus: '',
      listHandlerRow: null,
      clientName: '',
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
      const apiUrl = allApi.workorder.getList
      getRecordList(apiUrl, {
        page: this.currentPage,
        pageSize: this.pageSize,
        reserve1: this.listQuery.reserve1,
        cPhone: this.listQuery.cPhone,
        cIdCard: this.listQuery.cIdCard,
        reserve2: this.timeQuerys[0],
        reserve3: this.timeQuerys[1],
        wdNum: this.listQuery.wdNum,
        create_user: this.sysUser.id,
        roleId: this.sysUser.roleId,
        organizationId: this.sysUser.institutionsId,
        wdState: 4
      }).then(response => {
        this.totalOlders = response.data.totalRecord
        this.list = response.data.dataList
        console.log(this.list)
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
    update(formName) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      this.form.create_user = this.sysUser.id
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          this.dialogVisitVisible = false
          const apiUrl = allApi.workorder.visit
          updateRecord(apiUrl, this.form).then(res => {
            loading.close()
            if (res.data === 1) {
              this.handleQuery(this.currentPage, this.pageSize)
              this.$notify({
                title: '成功',
                message: '操作成功',
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
    handleVisit(row) {
      this.dialogVisitVisible = true
      this.dialogStatus = 'visit'
      this.listHandlerRow = row
      row.oldName = row.customer.oldName
      for (const key in this.form) {
        this.form[key] = row[key]
      }
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
      this.dialogVisitVisible = false
    },
    clearFormValidate(formName) {
      this.$refs[formName].clearValidate()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
