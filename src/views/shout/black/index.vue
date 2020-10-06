<template>
  <div class="main-container">
    <div class="filter-container">
      <el-input class="filter-input"
        placeholder="请输入来电号码"
        style="width: 280px;margin-right: 20px;"
        v-model="listQuery.nickName">
        <template slot="prepend">来电号码</template>
      </el-input>
      <div class="select">
        <div class="type">
          拉黑原因
        </div>
        <el-select placeholder="请选择"
          v-model="listQuery.wdState">
          <el-option v-for="item in options.cause"
            :key="item.val"
            :label="item.dataKey"
            :value="item.val"></el-option>
        </el-select>
      </div>
      <div class="time-editor">
        <div class="type">
          处理日期
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
      <el-button type="warning"
        icon="el-icon-edit"
        @click="handleUpdate()">修改</el-button>
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
      <el-table-column label="老人姓名"
        prop="cName"
        align="center">
      </el-table-column>
      <el-table-column label="联系电话"
        prop="telephone"
        align="center">
      </el-table-column>
      <el-table-column label="拉黑原因"
        prop="pullBlackStr"
        align="center">
      </el-table-column>
      <el-table-column label="处理人员"
        prop="reserve1"
        align="center">
      </el-table-column>
      <el-table-column label="处理时间"
        prop="handleTime"
        align="center">
      </el-table-column>
      <el-table-column label="状态"
        prop="statusStr"
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

    <el-dialog :title="textMap[dialogStatus]"
      @close="clearFormValidate('form')"
      :visible.sync="dialogFormVisible"
      width="860px">
      <el-form :inline="true"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="120px">
        <el-form-item label="拉黑号码"
          prop="telephone">
          <el-input v-model="form.telephone"
            placeholder="请输入拉黑号码"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="客户姓名"
          prop="cName">
          <el-input v-model="form.cName"
            placeholder="请输入客户姓名"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="拉黑原因"
          prop="pullBlack">
          <el-select class="filter-item"
            clearable
            v-model="form.pullBlack"
            placeholder="请选择"
            style="width: 240px"
            :disabled="isReadonly">
            <el-option v-for="item in options.cause"
              :key="item.val"
              :label="item.dataKey"
              :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="拉黑时效"
          prop="blackAgeing">
          <el-select class="filter-item"
            clearable
            v-model="form.blackAgeing"
            placeholder="请选择"
            style="width: 240px"
            :disabled="isReadonly">
            <el-option v-for="item in options.ageing"
              :key="item.val"
              :label="item.dataKey"
              :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注"
          prop="remarks">
          <el-input type="textarea"
            v-model="form.remarks"
            placeholder="请输入备注"
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

const notes = {
  id: null,
  zxid: 1,
  cName: '',
  telephone: '',
  pullBlack: '',
  blackAgeing: '',
  remarks: ''
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
        ageing: [],
        cause: []
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
      form: { ...notes },
      rules: {
        cName: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          }
        ],
        telephone: [
          {
            required: true,
            message: '请输入',
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
  created() {
    this.btnPowers = this.$route.meta.btnList
    console.log('btnPowers', this.btnPowers)

    this.findDicList()
    this.handleQuery(this.currentPage, this.pageSize)
  },
  methods: {
    findDicList() {
      findByDicCode('blackCause').then(response => {
        this.options.cause = response.data.dataList
      })

      findByDicCode('blackAgeing').then(response => {
        this.options.ageing = response.data.dataList
      })
    },
    handleQuery(currentPage, pageSize) {
      this.currentPage = 1
      if (currentPage) this.currentPage = currentPage
      const apiUrl = allApi.black.getList
      getRecordList(apiUrl, {
        page: this.currentPage,
        pageSize: this.pageSize,
        telephone: this.listQuery.nickName,
        pullBlack: this.listQuery.wdState,
        reserve1: this.timeQuerys[0],
        reserve2: this.timeQuerys[1]
      }).then(response => {
        console.log(response.data)
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
          const apiUrl = allApi.black.addData
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
    handleUpdate() {
      console.log(this.mulSelection)
      if (this.mulSelection.length === 1) {
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.isReadonly = false
        for (const key in this.form) {
          this.form[key] = this.mulSelection[0][key]
        }

        this.form.blackAgeing = parseInt(this.form.blackAgeing)
      } else {
        this.$message({
          type: 'warning',
          message: '请选择一条记录'
        })
      }
    },
    update(formName) {
      console.log(this.form)
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          const apiUrl = allApi.black.updateData
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
          const apiUrl = allApi.black.delData
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
      this.dialogStatus = 'detail'
      this.dialogFormVisible = true
      this.isReadonly = true
      for (const key in this.form) {
        this.form[key] = row[key]
      }
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
