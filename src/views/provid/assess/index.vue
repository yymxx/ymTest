<template>
  <div class="main-container">
    <div class="filter-container">
      <el-input class="filter-input"
        placeholder="请输入服务商名称"
        style="width: 320px;margin-right: 20px;"
        v-model="listQuery.spName">
        <template slot="prepend">服务商名称</template>
      </el-input>
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
      <el-table-column label="服务商名称"
        prop="spId"
        align="center">
      </el-table-column>
      <el-table-column label="线上交易"
        prop="onlineTransaction"
        align="center">
      </el-table-column>
      <el-table-column label="线上订单"
        prop="onlineOrder"
        align="center">
      </el-table-column>
      <el-table-column label="线上客户"
        prop="onlineUser"
        align="center">
      </el-table-column>
      <el-table-column label="服务接洽"
        prop="serviceContact"
        align="center">
      </el-table-column>
      <el-table-column label="客户满意度"
        prop="userSatisfaction"
        align="center">
      </el-table-column>
      <el-table-column label="客户投诉"
        prop="userComplaints"
        align="center">
      </el-table-column>
      <el-table-column label="服务完成"
        prop="serviceCompletion"
        align="center">
      </el-table-column>
      <el-table-column label="服务超时"
        prop="serviceTimeOut"
        align="center">
      </el-table-column>
      <el-table-column label="服务评价"
        prop="serviceEvaluate"
        align="center">
      </el-table-column>
      <el-table-column label="考核A"
        prop="assessmentA"
        align="center">
      </el-table-column>
      <el-table-column label="考核B"
        prop="assessmentB"
        align="center">
      </el-table-column>
      <el-table-column label="评估总分"
        prop="assessmentTotal"
        align="center">
      </el-table-column>
      <el-table-column label="操作"
        align="center"
        width="150">
        <template slot-scope="scope">
          <el-button type="primary"
            size="mini"
            @click="handleDetail(scope.row)">查看详情</el-button>
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
        <el-form-item label="服务商名称"
          prop="spId">
          <el-input v-model="form.spId"
            placeholder="请输入服务商名称"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="线上交易"
          prop="onlineTransaction">
          <el-input v-model="form.onlineTransaction"
            placeholder="请输入线上交易"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="线上订单"
          prop="onlineOrder">
          <el-input v-model="form.onlineOrder"
            placeholder="请输入线上订单"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="线上客户"
          prop="onlineUser">
          <el-input v-model="form.onlineUser"
            placeholder="请输入线上客户"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="服务接洽"
          prop="serviceContact">
          <el-input v-model="form.serviceContact"
            placeholder="请输入服务接洽"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="客户满意度"
          prop="userSatisfaction">
          <el-input v-model="form.userSatisfaction"
            placeholder="请输入客户满意度"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="客户投诉"
          prop="userComplaints">
          <el-input v-model="form.userComplaints"
            placeholder="请输入客户投诉"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="服务完成"
          prop="serviceCompletion">
          <el-input v-model="form.serviceCompletion"
            placeholder="请输入服务完成"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="服务超时"
          prop="serviceTimeOut">
          <el-input v-model="form.serviceTimeOut"
            placeholder="请输入服务超时"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="服务评价"
          prop="serviceEvaluate">
          <el-input v-model="form.serviceEvaluate"
            placeholder="请输入服务评价"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="考核A"
          prop="assessmentA">
          <el-input v-model="form.assessmentA"
            placeholder="请输入考核A"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="考核B"
          prop="assessmentB">
          <el-input v-model="form.assessmentB"
            placeholder="请输入考核B"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="评估总分"
          prop="assessmentTotal">
          <el-input type="number"
            v-model="form.assessmentTotal"
            style="width: 240px;"
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
  delOneRecord
} from '@/api/page'
import { allApi } from '@/api/config'
import { mapGetters } from 'vuex'

const notes = {
  id: null,
  spId: '',
  onlineTransaction: '',
  onlineOrder: '',
  onlineUser: '',
  serviceContact: '',
  userSatisfaction: '',
  userComplaints: '',
  serviceCompletion: '',
  serviceTimeOut: '',
  serviceEvaluate: '',
  assessmentA: '',
  assessmentB: '',
  assessmentTotal: ''
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
      listQuery: {
        spName: ''
      },
      mulSelection: [],
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
    ...mapGetters(['sysUser'])
  },
  created() {
    this.btnPowers = this.$route.meta.btnList
    console.log('btnPowers', this.btnPowers)

    this.handleQuery(this.currentPage, this.pageSize)
  },
  methods: {
    handleQuery(currentPage, pageSize) {
      this.currentPage = 1
      if (currentPage) this.currentPage = currentPage
      const apiUrl = allApi.spassessment.getList
      getRecordList(apiUrl, {
        page: this.currentPage,
        pageSize: this.pageSize,
        reserve1: this.listQuery.spName,
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
          const apiUrl = allApi.spassessment.addData
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
      } else {
        this.$message({
          type: 'warning',
          message: '请选择一条记录'
        })
      }
    },
    update(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          const apiUrl = allApi.spassessment.updateData
          updateRecord(apiUrl, this.form).then(res => {
            if (res.data === 1) {
              this.handleQuery(this.currentPage, this.pageSize)
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
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
          const apiUrl = allApi.spassessment.delData
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
