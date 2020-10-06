<template>
  <div class="main-container">
    <div class="filter-container">
      <div class="select">
        <div class="type">
          任务类型
        </div>
        <el-select clearable
          placeholder="请选择"
          v-model="listQuery.wdState">
          <el-option v-for="item in options.gender"
            :key="item.val"
            :label="item.dataKey"
            :value="item.val"></el-option>
        </el-select>
      </div>
      <div class="time-editor">
        <div class="type">
          任务时间
        </div>
        <el-date-picker v-model="timeQuerys"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <el-button type="primary"
        icon="el-icon-search"
        @click="handleQuery()">查询</el-button>
    </div>
    <div class="filter-container">
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
      <el-table-column label="任务时间"
        prop="taskTime"
        align="center">
      </el-table-column>
      <el-table-column label="老人姓名"
        prop="reserve1"
        align="center">
      </el-table-column>
      <el-table-column label="联系电话"
        prop="telephone"
        align="center">
      </el-table-column>
      <el-table-column label="执行人"
        prop="reserve2"
        align="center">
      </el-table-column>
      <el-table-column label="老人类型"
        prop="personType"
        align="center">
      </el-table-column>
      <el-table-column label="任务类型"
        prop="taskTypeStr"
        align="center">
      </el-table-column>
      <el-table-column label="状态"
        prop="taskStatusStr"
        align="center">
      </el-table-column>
      <el-table-column label="操作"
        align="center"
        width="150">
        <template slot-scope="scope">
          <el-button v-if="scope.row.taskStatus==0"
            type="warning"
            size="mini"
            @click="handleUpdate(scope.row)">处理任务</el-button>
          <el-button v-else
            type="primary"
            size="mini"
            @click="handleDetail(scope.row)">查看</el-button>
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
      width="860px">
      <el-form :inline="true"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="120px">
        <el-form-item label="访问对象"
          prop="cid">
          <el-input v-model="form.reserve1"
            placeholder="请输入访问对象"
            @focus="handleProject('older')"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="提醒时间"
          prop="remindTime">
          <el-date-picker type="datetime"
            :picker-options="taskOptions"
            v-model="form.remindTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
            style="width: 240px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="计划时间"
          prop="taskTime">
          <el-date-picker type="datetime"
            :picker-options="taskOptions"
            v-model="form.taskTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
            style="width: 240px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="执行人员"
          prop="zxid">
          <el-input v-model="form.reserve2"
            placeholder="请输入执行人员"
            @focus="handleProject('wroker')"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="任务类型"
          prop="taskType">
          <el-select class="filter-item"
            clearable
            v-model="form.taskType"
            placeholder="请选择"
            style="width: 240px"
            :disabled="isReadonly">
            <el-option v-for="item in options.gender"
              :key="item.val"
              :label="item.dataKey"
              :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务备注"
          prop="taskRemarks">
          <el-input type="textarea"
            v-model="form.taskRemarks"
            placeholder="请输入任务备注"
            style="width: 610px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
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

    <el-dialog title="处理任务"
      @close="clearFormValidate('form')"
      :visible.sync="dialogDealVisible"
      width="860px">
      <el-form :inline="true"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="120px">
        <shout-turn v-if="dialogDealVisible"
          :listRow="listHandlerRow"></shout-turn>
        <el-form-item v-if="listHandlerRow.taskStatus==0"
          label="执行报告"
          style="margin-top: 15px;"
          prop="presentation">
          <el-input type="textarea"
            v-model="form.presentation"
            placeholder="请输入执行报告"
            style="width: 520px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
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

    <el-dialog width="960px"
      :title="defaultTitle"
      :visible.sync="dialogProShow"
      @close="dialogOldClose()"
      :close-on-click-modal="false">
      <div v-if="dialogProShow">
        <chart-choose v-if="defaultType=='older'"
          :data="form.reserve1"
          @setGoback="handleOldback">
        </chart-choose>
        <wroker-choose v-if="defaultType=='wroker'"
          :data="form.reserve2"
          @setGoback="handleOldback">
        </wroker-choose>
      </div>
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
import { allApi } from '@/api/call'
import { dateFormat } from '@/utils/pick'
import chartChoose from './singer'
import wrokerChoose from './wroker'
import shoutTurn from './turn'

const notes = {
  id: null,
  cid: '',
  taskTime: '',
  zxid: 1,
  remindTime: '',
  taskType: '',
  taskRemarks: '',
  reserve1: '',
  reserve2: '',
  presentation: ''
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
    chartChoose,
    wrokerChoose,
    shoutTurn
  },
  data() {
    return {
      list,
      btnPowers: null,
      options: {
        gender: []
      },
      timeQuerys: [],
      listQuery: {
        nickName: '',
        wdState: ''
      },
      mulSelection: [],
      currentPage: 1,
      pageSize: 10,
      totalOlders: 30,
      isReadonly: false,
      defaultTitle: '',
      defaultType: '',
      listHandlerRow: {
        taskStatus: ''
      },
      dialogDealVisible: false,
      dialogProShow: false,
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
    taskOptions() {
      return {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      }
    },
    pickerOptions() {
      const plan = this.form.taskTime
      return {
        disabledDate(time) {
          if (plan) return time.getTime() > new Date(plan).getTime()
        }
      }
    }
  },
  created() {
    this.btnPowers = this.$route.meta.btnList
    console.log('btnPowers', this.btnPowers)

    for (var key in this.rules) {
      this.rules[key] = [
        {
          required: true,
          message: '必填项',
          trigger: 'blur'
        }
      ]
    }

    this.findDicList()
    this.handleQuery(this.currentPage, this.pageSize)
  },
  methods: {
    findDicList() {
      findByDicCode('taskType').then(response => {
        this.options.gender = response.data.dataList
      })
    },
    handleQuery(currentPage, pageSize) {
      this.currentPage = 1
      if (currentPage) this.currentPage = currentPage
      const apiUrl = allApi.plan.getList
      getRecordList(apiUrl, {
        page: this.currentPage,
        pageSize: this.pageSize,
        taskType: this.listQuery.wdState,
        reserve1: this.timeQuerys[0],
        reserve2: this.timeQuerys[1]
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
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.isReadonly = false
      this.form = { ...notes }
    },
    create(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          const apiUrl = allApi.plan.addData
          addRecord(apiUrl, this.form).then(res => {
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
    handleUpdate(row) {
      console.log(row)
      this.dialogStatus = 'update'
      this.dialogDealVisible = true
      this.isReadonly = false
      this.listHandlerRow = row
      for (const key in this.form) {
        this.form[key] = row[key]
      }
    },
    update(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogDealVisible = false
          const apiUrl = allApi.plan.updateData
          updateRecord(apiUrl, {
            id: this.form.id,
            presentation: this.form.presentation
          }).then(res => {
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
    handleDetail(row) {
      this.dialogStatus = 'detail'
      this.dialogDealVisible = true
      this.isReadonly = true
      this.listHandlerRow = row
      for (const key in this.form) {
        this.form[key] = row[key]
      }
    },
    handleDelete() {
      if (this.mulSelection.length > 0) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const apiUrl = allApi.plan.delData
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
    handleTaskTime(val) {
      const date = new Date(val)
      date.setTime(date.getTime() - 3600 * 500)
      console.log(dateFormat(date, 'yyyy-MM-dd hh:mm:ss'))
      // this.form.remindTime = date
    },
    handleProject(val) {
      this.defaultType = val
      this.dialogProShow = true
      this.defaultTitle = '选择访问对象'
      if (this.defaultType === 'wroker') {
        this.defaultTitle = '选择执行人员'
      }
    },
    handleOldback(data) {
      console.log(data)
      this.dialogProShow = false
      const rlist = data.split('-')
      if (this.defaultType === 'older') {
        this.form.cid = rlist[0]
        this.form.reserve1 = rlist[1]
      } else if (this.defaultType === 'wroker') {
        this.form.zxid = rlist[0]
        this.form.reserve2 = rlist[1]
      }
    },
    dialogOldClose() {
      this.dialogProShow = false
    },
    cancel(formName) {
      this.dialogFormVisible = false
      this.dialogDealVisible = false
    },
    clearFormValidate(formName) {
      this.$refs[formName].clearValidate()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
