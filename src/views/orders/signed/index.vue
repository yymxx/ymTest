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
        align="center">
      </el-table-column>
      <el-table-column label="服务金额"
        :show-overflow-tooltip="true"
        prop="wdPrice"
        align="center">
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
        width="180">
        <template slot-scope="scope">
          <el-button type="primary"
            size="mini"
            @click="handleSignIn(scope.row)">结算</el-button>
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

    <el-dialog title="工单结算"
      @close="clearFormValidate('form')"
      :visible.sync="dialogAssignVisible"
      width="580px">
      <el-form :model="form"
        :rules="rules"
        ref="form"
        label-width="110px">
        <el-form-item label="工单编号">
          <span>{{ form.wdNum }}</span>
          <span style="font-size: 18px;margin-left: 8px;">是否确定结算？</span>
        </el-form-item>
      </el-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button type="primary"
          @click="update('form')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRecordList, updateRecord, findByDicCode } from '@/api/page'
import { allApi } from '@/api/config'
import { mapGetters } from 'vuex'

const notes = {
  id: null,
  wdNum: '',
  suId: '',
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

const helpeList = [
  {
    id: '1',
    name: '对对对'
  },
  {
    id: '2',
    name: '是是是'
  }
]

export default {
  name: 'HelloWorld',
  data() {
    return {
      list,
      btnPowers: null,
      helpeList,
      listQuar: [],
      stationTree: [],
      options: {
        gender: [],
        wdState: []
      },
      timeQuerys: [],
      listQuery: {
        nickName: '',
        wdNum: ''
      },
      currentPage: 1,
      pageSize: 10,
      totalOlders: 30,
      listHandlerRow: null,
      dialogIsDetail: false,
      helpelder: [],
      isReadonly: false,
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
      dialogAssignVisible: false,
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
    const apiUrl = allApi.orderrecord.station
    getRecordList(apiUrl, {
      spState: 3
    }).then(response => {
      this.stationTree = response.data
    })
  },
  methods: {
    findDicList() {
      findByDicCode('sex').then(response => {
        this.options.gender = response.data.dataList
        console.log(this.options.gender)
      })

      findByDicCode('wdState').then(response => {
        this.options.wdState = response.data.dataList
      })
    },
    handleCader() {
      this.listQuery.spId = this.listQuar[0]
      this.listQuery.stId = this.listQuar[1]
    },
    handleQuery(currentPage, pageSize) {
      this.currentPage = 1
      if (currentPage) this.currentPage = currentPage
      const apiUrl = allApi.workorder.getList
      getRecordList(apiUrl, {
        page: this.currentPage,
        pageSize: this.pageSize,
        reserve2: this.timeQuerys[0],
        reserve3: this.timeQuerys[1],
        wdNum: this.listQuery.wdNum,
        create_user: this.sysUser.id,
        organizationId: this.sysUser.institutionsId,
        wdState: 6
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
    update(formName) {
      this.form.create_user = this.sysUser.id
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogAssignVisible = false
          let apiUrl = allApi.workorder.settle
          updateRecord(apiUrl, this.form).then(res => {
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
    handleSignIn(row) {
      this.helpelder = []
      this.dialogAssignVisible = true
      this.dialogStatus = 'signIn'
      for (const key in this.form) {
        this.form[key] = row[key]
      }
    },
    cancel(formName) {
      this.dialogAssignVisible = false
    },
    clearFormValidate(formName) {
      this.$refs[formName].clearValidate()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-checkbox-group {
  width: 360px;
  max-height: 300px;
  overflow-y: auto;
  .groupbox {
    float: left;
    width: 110px;
  }
}
</style>
