<template>
  <div class="main-container">
    <div class="filter-container">
      <el-input class="filter-input"
        placeholder="请输入老人姓名"
        style="width: 280px;margin-right: 20px;"
        v-model="listQuery.cusName">
        <template slot="prepend">老人姓名</template>
      </el-input>
      <el-input class="filter-input"
        placeholder="请输入联系电话"
        style="width: 280px;margin-right: 20px;"
        v-model="listQuery.cusPhone">
        <template slot="prepend">联系电话</template>
      </el-input>
      <div class="time-editor">
        <div class="type">
          充值时间
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
          充值方式
        </div>
        <el-select clearable
          placeholder="请选择"
          v-model="listQuery.reClass">
          <el-option v-for="item in options.gender"
            :key="item.val"
            :label="item.dataKey"
            :value="item.val"></el-option>
        </el-select>
      </div>
      <el-button type="primary"
        icon="el-icon-search"
        @click="handleQuery()">查询</el-button>
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
      <el-table-column label="充值时间"
        :show-overflow-tooltip="true"
        prop="create_time"
        align="center">
      </el-table-column>
      <el-table-column label="充值流水号"
        :show-overflow-tooltip="true"
        prop="reNum"
        align="center">
      </el-table-column>
      <el-table-column label="老人姓名"
        :show-overflow-tooltip="true"
        prop="cusName"
        align="center">
      </el-table-column>
      <el-table-column label="联系电话"
        :show-overflow-tooltip="true"
        prop="cusPhone"
        align="center">
      </el-table-column>
      <el-table-column label="身份证号"
        :show-overflow-tooltip="true"
        prop="cusCard"
        align="center">
      </el-table-column>
      <el-table-column label="充值方式"
        :show-overflow-tooltip="true"
        prop="reserve1"
        align="center">
      </el-table-column>
      <el-table-column label="充值金额"
        :show-overflow-tooltip="true"
        prop="reMoney"
        align="center">
      </el-table-column>
      <el-table-column label="充值服务中心"
        :show-overflow-tooltip="true"
        prop="cusAddress"
        align="center">
      </el-table-column>
      <el-table-column label="操作"
        align="center"
        width="150">
        <template slot-scope="scope">
          <!-- <el-button type="danger"
            size="mini"
            @click="handleDelete(scope.row)">删除</el-button> -->
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
        <el-form-item label="流水号"
          prop="reNum">
          <el-input v-model="form.reNum"
            placeholder="请输入流水号"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="老人名称"
          prop="cusName">
          <el-input v-model="form.cusName"
            placeholder="请输入老人名称"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="联系电话"
          prop="cusPhone">
          <el-input v-model="form.cusPhone"
            placeholder="请输入联系电话"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="身份证号"
          prop="cusCard">
          <el-input v-model="form.cusCard"
            placeholder="请输入身份证号"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="支付方式"
          prop="reserve1">
          <el-input v-model="form.reserve1"
            placeholder="请输入支付方式"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="充值金额"
          prop="reMoney">
          <el-input v-model="form.reMoney"
            placeholder="请输入充值金额"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="服务站"
          prop="cusAddress">
          <el-input type="textarea"
            v-model="form.cusAddress"
            placeholder="请输入服务站"
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
  delOneRecord,
  findByDicCode
} from '@/api/page'
import { allApi } from '@/api/config'
import { mapGetters } from 'vuex'

const notes = {
  id: null,
  cId: '',
  cPhone: '',
  cIdCard: '',
  wdNum: '',
  wdClass: '',
  wdState: '',
  applyTime: '',
  wdCreateId: '',
  wdRemarks: ''
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
        gender: []
      },
      timeQuerys: [],
      listQuery: {
        cusName: '',
        cusPhone: '',
        reClass: ''
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

    this.findDicList()
    this.handleQuery(this.currentPage, this.pageSize)
  },
  methods: {
    findDicList() {
      findByDicCode('reClass').then(response => {
        this.options.gender = response.data.dataList
      })
    },
    handleQuery(currentPage, pageSize) {
      this.currentPage = 1
      if (currentPage) this.currentPage = currentPage
      const apiUrl = allApi.cusrecharge.getList
      getRecordList(apiUrl, {
        page: this.currentPage,
        pageSize: this.pageSize,
        reserve1: this.timeQuerys[0],
        reserve2: this.timeQuerys[1],
        cusName: this.listQuery.cusName,
        cusPhone: this.listQuery.cusPhone,
        reClass: this.listQuery.reClass,
        create_user: this.sysUser.id,
        roleId: this.sysUser.roleId
      }).then(response => {
        console.log(response)
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
          const apiUrl = allApi.subsidyratio.getList
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
          const apiUrl = allApi.subsidyratio.getList
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
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const apiUrl = allApi.cusrecharge.delData
        delOneRecord(apiUrl, row.id).then(res => {
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
    },
    handleSelectionChange(val) {
      this.mulSelection = val
    },
    handleDetail(row) {
      this.dialogStatus = 'detail'
      this.dialogFormVisible = true
      this.isReadonly = true
      this.form = row
      // for (const key in this.form) {
      //   this.form[key] = row[key]
      // }
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
