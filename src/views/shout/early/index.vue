<template>
  <div class="main-container">
    <div class="filter-container">
      <el-input class="filter-input"
        placeholder="请输入老人姓名"
        style="width: 280px;margin-right: 20px;"
        v-model="listQuery.oldName">
        <template slot="prepend">老人姓名</template>
      </el-input>
      <el-input class="filter-input"
        placeholder="请输入电话号码"
        style="width: 280px;margin-right: 20px;"
        v-model="listQuery.telephone">
        <template slot="prepend">电话号码</template>
      </el-input>
      <div class="select">
        <div class="type">
          预警类型
        </div>
        <el-select placeholder="请选择"
          v-model="listQuery.warnType">
          <el-option v-for="item in options.warnType"
            :key="item.val"
            :label="item.dataKey"
            :value="item.val"></el-option>
        </el-select>
      </div>
      <div class="time-editor">
        <div class="type">
          预警日期
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
    <el-table border
      :data="list"
      style="width: 100%;">
      <el-table-column width="60"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预警时间"
        prop="warnTime"
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
      <el-table-column label="预警类型"
        prop="warnTypeStr"
        align="center">
      </el-table-column>
      <el-table-column label="预警信息"
        prop="warnMessage"
        align="center">
      </el-table-column>
      <el-table-column label="老人类型"
        prop="personType"
        align="center">
      </el-table-column>
      <el-table-column label="处理时间"
        prop="update_time"
        align="center">
      </el-table-column>
      <el-table-column label="状态"
        prop="taskStatusStr"
        align="center">
      </el-table-column>
      <el-table-column label="操作"
        align="center"
        width="210">
        <template slot-scope="scope">
          <el-button v-if="scope.row.taskStatus==0"
            type="warning"
            size="mini"
            @click="handleUpdate(scope.row)">处理</el-button>
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
        <el-form-item label="老人姓名"
          class="turn-box">
          <label class="detail">{{ form.reserve1 }}</label>
        </el-form-item>
        <el-form-item label="联系电话"
          class="turn-box">
          <label class="detail">{{ form.telephone }}</label>
        </el-form-item>
        <el-form-item label="预警类型"
          class="turn-box">
          <label class="detail">{{ form.warnTypeStr }}</label>
        </el-form-item>
        <el-form-item label="预警信息"
          class="turn-box">
          <label class="detail">{{ form.warnMessage }}</label>
        </el-form-item>
        <el-form-item label="紧急联系人"
          class="turn-box"
          style="margin-bottom: 20px;">
          <label class="detail">
            {{ form.urgentContacts }}
            <el-button type="primary"
              size="mini"
              @click="callPhone()"
              style="margin-left: 10px;">拔号</el-button>
          </label>
        </el-form-item>
        <div></div>
        <el-form-item label="处理时间"
          prop="update_time">
          <el-date-picker type="datetime"
            v-model="form.update_time"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
            style="width: 240px"
            :disabled="isReadonly">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="处理详情"
          prop="handleDetails">
          <el-input type="textarea"
            v-model="form.handleDetails"
            placeholder="请输入处理详情"
            style="width: 610px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <!-- <el-form-item label="处理结果"
          prop="taskStatus">
          <el-select class="filter-item"
            clearable
            v-model="form.taskStatus"
            placeholder="请选择"
            style="width: 240px"
            :disabled="isReadonly">
            <el-option v-for="item in options.gender"
              :key="item.val"
              :label="item.dataKey"
              :value="item.val"></el-option>
          </el-select>
        </el-form-item> -->
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
  </div>
</template>

<script>
import {
  getRecordList,
  updateRecord,
  getRecordById,
  findByDicCode
} from '@/api/page'
import { allApi } from '@/api/call'
import { mapGetters } from 'vuex'

const notes = {
  id: null,
  cid: '',
  reserve1: '',
  telephone: '',
  warnTime: '',
  urgentContacts: '',
  warnType: '',
  warnTypeStr: '',
  warnMessage: '',
  handleDetails: '',
  taskStatus: '',
  update_time: ''
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
  data() {
    return {
      list,
      btnPowers: null,
      options: {
        gender: [],
        warnType: []
      },
      timeQuerys: [],
      listQuery: {
        oldName: '',
        telephone: '',
        warnType: ''
      },
      currentPage: 1,
      pageSize: 10,
      totalOlders: 30,
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
    ...mapGetters(['voip'])
  },
  created() {
    this.btnPowers = this.$route.meta.btnList
    console.log('btnPowers', this.btnPowers)

    this.findDicList()
    this.handleQuery(this.currentPage, this.pageSize)
  },
  methods: {
    findDicList() {
      findByDicCode('taskStatus').then(response => {
        this.options.gender = response.data.dataList
      })

      findByDicCode('warnType').then(response => {
        this.options.warnType = response.data.dataList
      })
    },
    handleQuery(currentPage, pageSize) {
      this.currentPage = 1
      if (currentPage) this.currentPage = currentPage
      const apiUrl = allApi.warning.getList
      getRecordList(apiUrl, {
        page: this.currentPage,
        pageSize: this.pageSize,
        oldName: this.listQuery.oldName,
        telephone: this.listQuery.telephone,
        warnType: this.listQuery.warnType,
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
    handleUpdate(row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.isReadonly = false

      let apiUrl = allApi.warning.getById
      getRecordById(apiUrl, row.id).then(response => {
        console.log(222, response)
        if (response.data) {
          for (const key in this.form) {
            this.form[key] = response.data[key]
          }
        }
      })
    },
    update(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          const apiUrl = allApi.warning.updateData
          updateRecord(apiUrl, {
            id: this.form.id,
            handleDetails: this.form.handleDetails,
            taskStatus: 1,
            update_time: this.form.update_time
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
    callPhone() {
      const voip = this.voip
      const that = this
      const rlist = this.form.urgentContacts.split(' ')
      voip.CallPhone(rlist[1], function(data) {
        if (parseInt(data.code) === 0) {
          that.$message({
            type: 'success',
            message: '拔号成功'
          })
        }
      })
    },
    handleDetail(row) {
      console.log(row)
      this.dialogStatus = 'detail'
      this.dialogFormVisible = true
      this.isReadonly = true

      let apiUrl = allApi.warning.getById
      getRecordById(apiUrl, row.id).then(response => {
        console.log(222, response)
        if (response.data) {
          for (const key in this.form) {
            this.form[key] = response.data[key]
          }
        }
      })
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
.turn-box /deep/ {
  margin-bottom: 0;
  .detail {
    width: 240px;
    display: inline-block;
    font-weight: normal;
  }
}
</style>
