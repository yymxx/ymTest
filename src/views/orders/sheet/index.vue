<template>
  <div class="main-container">
    <div class="filter-container"
      style="width: 1400px;">
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
      <div class="select">
        <div class="type">
          工单状态
        </div>
        <el-select clearable
          placeholder="请选择"
          v-model="listQuery.wdState">
          <el-option v-for="item in options.wdState"
            :key="item.val"
            :label="item.dataKey"
            :value="item.val"></el-option>
        </el-select>
      </div>
      <div class="select">
        <div class="type">
          项目/服务站
        </div>
        <el-cascader clearable
          v-model="listQuar"
          :options="stationTree"
          @change="handleCader"
          filterable>
        </el-cascader>
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
    <div v-if="isServeShow"
      class="filter-container">
      <el-button type="primary"
        icon="el-icon-plus"
        @click="handleCreate()">添加</el-button>
      <el-button type="danger"
        icon="el-icon-delete"
        @click="handleDelete()">删除</el-button>
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
        width="150">
        <template slot-scope="scope">
          <el-button v-if="scope.row.wdState==1&&isServeShow"
            type="warning"
            size="mini"
            @click="handleUpdate(scope.row)">修改</el-button>
          <el-button v-else
            type="primary"
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

    <el-dialog :title="textMap[dialogStatus]"
      @close="clearFormValidate('form')"
      :visible.sync="dialogFormVisible"
      width="890px">
      <el-form :inline="true"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="130px">
        <el-form-item label="服务对象"
          prop="reserve1">
          <el-input v-if="dialogStatus=='create'"
            v-model="clientName"
            placeholder="请输入服务对象"
            @focus="handleOlder"
            style="width: 625px"></el-input>
          <el-input v-else
            v-model="clientName"
            placeholder="请输入服务对象"
            readonly
            style="width: 625px"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'"
          label="服务类型"
          prop="spState">
          <el-select class="filter-item"
            clearable
            v-model="form.spState"
            placeholder="请选择"
            @change="handleTypes"
            style="width: 240px">
            <el-option v-for="item in options.serType"
              :key="item.val"
              :label="item.dataKey"
              :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务时间"
          prop="sTime">
          <el-date-picker type="datetime"
            v-model="form.sTime"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
            style="width: 240px">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'"
          label="项目/服务站"
          prop="stId">
          <el-cascader clearable
            filterable
            v-model="listPar"
            :options="stationTree"
            @change="handleParents"
            style="width: 240px"></el-cascader>
        </el-form-item>
        <el-form-item label="紧急程度"
          prop="state">
          <el-select class="filter-item"
            clearable
            v-model="form.state"
            placeholder="请选择"
            style="width: 240px">
            <el-option v-for="item in options.urgent"
              :key="item.val"
              :label="item.dataKey"
              :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'"
          label="服务金额"
          prop="wdPrice">
          <el-input readonly
            v-model="form.wdPrice"
            style="width: 240px;"></el-input>
        </el-form-item>
        <el-form-item label="服务地址"
          prop="sAddress">
          <el-input v-model="form.sAddress"
            placeholder="请输入服务地址"
            style="width: 500px;"></el-input>
          <span class="seat-map"
            @click="handleAddress()">
            <svg-icon icon-class="seat"></svg-icon>
            <span>选择地址</span>
          </span>
        </el-form-item>
        <el-form-item label="工单备注"
          prop="wdRemarks">
          <el-input type="textarea"
            v-model="form.wdRemarks"
            placeholder="请输入工单备注"
            style="width: 630px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'"
          type="primary"
          @click="create('form')">确 定</el-button>
        <el-button v-else
          type="primary"
          @click="update('form')">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="detailTop.title"
      :width="detailTop.width"
      :visible.sync="dialogIsDetail"
      @close="dialogDetailClose()"
      :close-on-click-modal="false">
      <sheet-detail v-if="dialogIsDetail"
        :row-data="listHandlerRow"
        @setGoback="handleGoback"></sheet-detail>
    </el-dialog>

    <el-dialog width="800px"
      title="点击地图选择地址"
      :visible.sync="dialogMapShow"
      @close="dialogMapClose()"
      :close-on-click-modal="false">
      <gould-map v-if="dialogMapShow"
        @setGoback="handleMapback"></gould-map>
    </el-dialog>

    <el-dialog width="960px"
      title="添加服务对象"
      :visible.sync="dialogOldShow"
      @close="dialogOldClose()"
      :close-on-click-modal="false">
      <older-options multiple
        v-if="dialogOldShow"
        :data="form.reserve1"
        @setGoback="handleOldback"></older-options>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRecordList,
  addRecord,
  updateRecord,
  delOneRecord,
  findByDicCode
} from '@/api/page'
import { allApi } from '@/api/config'
import sheetDetail from './detail'
import gouldMap from '@/components/GouldMap'
import olderOptions from './older'
import { mapGetters } from 'vuex'

const notes = {
  id: null,
  reserve1: '',
  wdClass: 1,
  spId: '',
  wdPrice: '',
  sTime: '',
  state: '',
  stId: '',
  sAddress: '',
  wdRemarks: '',
  spState: '',
  create_user: ''
}

const list = []

export default {
  name: 'HelloWorld',
  components: {
    sheetDetail,
    gouldMap,
    olderOptions
  },
  data() {
    return {
      list,
      btnPowers: null,
      isServeShow: false,
      options: {
        urgent: [],
        serType: [],
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
      mulSelection: [],
      currentPage: 1,
      pageSize: 10,
      totalOlders: 30,
      dialogOldShow: false,
      dialogMapShow: false,
      listHandlerRow: null,
      dialogIsDetail: false,
      detailTop: {
        width: '1200px',
        title: '工单详情'
      },
      clientName: '',
      pickerOptions: {
        shortcuts: []
      },
      form: { ...notes },
      rules: {
        reserve1: [
          {
            required: true,
            message: '必填项',
            trigger: 'blur'
          }
        ],
        spState: [
          {
            required: true,
            message: '必填项',
            trigger: 'blur'
          }
        ],
        sTime: [
          {
            required: true,
            message: '必填项',
            trigger: 'blur'
          }
        ],
        stId: [
          {
            required: true,
            message: '必填项',
            trigger: 'blur'
          }
        ],
        sAddress: [
          {
            required: true,
            message: '必填项',
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
  watch: {
    $route(val) {
      this.isServeShow = val.path.indexOf('serve') > 0
    }
  },
  created() {
    this.btnPowers = this.$route.meta.btnList
    console.log('btnPowers', this.btnPowers)

    this.isServeShow = this.$route.path.indexOf('serve') > 0

    for (let i = 30; i < 320; i += 30) {
      this.pickerOptions.shortcuts.push({
        text: (i / 60).toFixed(1) + '小时后',
        onClick(picker) {
          const date = new Date()
          date.setTime(date.getTime() + 3600 * 1000 * i / 60)
          picker.$emit('pick', date)
        }
      })
    }

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
      findByDicCode('urgentState').then(response => {
        this.options.urgent = response.data.dataList
      })

      findByDicCode('serviceType').then(response => {
        this.options.serType = response.data.dataList
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
        spId: this.listQuery.spId,
        wdState: this.listQuery.wdState,
        stId: this.listQuery.stId,
        wdNum: this.listQuery.wdNum,
        create_user: this.sysUser.id,
        roleId: this.sysUser.roleId,
        organizationId: this.sysUser.institutionsId
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
    handleTypes(val) {
      console.log(val)
      const apiUrl = allApi.orderrecord.station
      getRecordList(apiUrl, {
        spState: val
      }).then(response => {
        this.stationTree = response.data
      })
    },
    handleCader() {
      this.listQuery.spId = this.listQuar[0]
      this.listQuery.stId = this.listQuar[1]
    },
    handleParents() {
      this.form.wdPrice = this.stationTree.reduce((total, item) => {
        if (item.value === this.listPar[0]) return item.spPrice
        return total
      }, 0)
      this.form.spId = this.listPar[0]
      this.form.stId = this.listPar[1]
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.clientName = ''
      this.listPar = []
      this.form = { ...notes }
      this.form.create_user = this.sysUser.id
    },
    create(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          this.dialogFormVisible = false
          const apiUrl = allApi.workorder.addData
          addRecord(apiUrl, this.form).then(res => {
            console.log(555, res)
            loading.close()
            if (res.data === 1) {
              this.handleQuery(this.currentPage, this.pageSize)
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            }

            if (res.msg !== '') {
              this.$message({
                type: 'warning',
                message: res.msg
              })
            }
          })
        } else {
          return false
        }
      })
    },
    handleUpdate(row) {
      console.log('row', row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.clientName = row.customer.oldName
      for (const key in this.form) {
        this.form[key] = row[key]
      }
    },
    update(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          const apiUrl = allApi.workorder.updateData
          updateRecord(apiUrl, this.form).then(res => {
            if (res.data === 1) {
              this.handleQuery(this.currentPage, this.pageSize)
              this.$notify({
                title: '成功',
                message: '修改成功',
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
    handleDelete() {
      if (this.mulSelection.length > 0) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const apiUrl = allApi.workorder.delData
          delOneRecord(apiUrl, this.mulSelection[0].id).then(res => {
            if (res.data === 1) {
              this.handleQuery(this.currentPage, this.pageSize)
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
            }
          })
        })
      } else {
        this.$message({
          type: 'warning',
          message: '请选择记录'
        })
      }
    },
    handleSelectionChange(val) {
      this.mulSelection = val
    },
    handleDetail(row) {
      this.dialogIsDetail = true
      this.listHandlerRow = row
    },
    handleGoback(data) {
      this.detailTop.width = data[0]
      this.detailTop.title = data[1]
    },
    dialogDetailClose() {
      this.dialogIsDetail = false
      this.detailTop = {
        width: '1200px',
        title: '工单详细记录'
      }
    },
    handleOlder() {
      this.dialogOldShow = true
    },
    handleOldback(data) {
      this.clientName = data.replace(/[\d-]/g, '')
      this.form.reserve1 = data
      this.dialogOldShow = false
    },
    dialogOldClose() {
      this.dialogOldShow = false
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
</style>
