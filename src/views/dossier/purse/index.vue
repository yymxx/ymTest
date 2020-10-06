<template>
  <div class="main-container">
    <div class="filter-container">
      <el-input class="filter-input"
        placeholder="请输入姓名"
        style="width: 280px;margin-right: 20px;"
        v-model="listQuery.reserve1">
        <template slot="prepend">姓名</template>
      </el-input>
      <el-input class="filter-input"
        placeholder="请输入证件号码"
        style="width: 280px;margin-right: 20px;"
        v-model="listQuery.idNumber">
        <template slot="prepend">证件号码</template>
      </el-input>
      <div class="time-editor">
        <div class="type">
          时间范围
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
      style="width: 100%;"
      ref="checkTable"
      @selection-change="handleSelectionChange">
      <el-table-column width="60"
        header-align="center"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="老人名称"
        :show-overflow-tooltip="true"
        prop="reserve1"
        align="center">
      </el-table-column>
      <el-table-column label="证件号码"
        :show-overflow-tooltip="true"
        prop="reserve4"
        align="center">
      </el-table-column>
      <el-table-column label="手机号"
        :show-overflow-tooltip="true"
        prop="reserve5"
        align="center">
      </el-table-column>
      <el-table-column label="工单编号"
        :show-overflow-tooltip="true"
        prop="wdId"
        align="center">
      </el-table-column>
      <el-table-column label="服务内容"
        :show-overflow-tooltip="true"
        prop="reserve2"
        align="center">
      </el-table-column>
      <el-table-column label="服务价格"
        :show-overflow-tooltip="true"
        prop="reserve3"
        align="center">
      </el-table-column>
      <el-table-column label="市补贴扣款金额"
        :show-overflow-tooltip="true"
        prop="citySubsidy"
        align="center">
      </el-table-column>
      <el-table-column label="区补贴扣款金额"
        :show-overflow-tooltip="true"
        prop="localSubsidy"
        align="center">
      </el-table-column>
      <el-table-column label="充值扣款金额"
        :show-overflow-tooltip="true"
        prop="reCharge"
        align="center">
      </el-table-column>
      <el-table-column label="用户类型"
        :show-overflow-tooltip="true"
        prop="oIdStr"
        align="center">
      </el-table-column>
      <el-table-column label="操作时间"
        :show-overflow-tooltip="true"
        prop="create_time"
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
        <el-form-item label="老人"
          prop="cId">
          <el-select class="filter-item"
            clearable
            v-model="form.cId"
            placeholder="请选择"
            style="width: 240px"
            :disabled="isReadonly">
            <el-option v-for="item in organOptions"
              :key="item.dicKey"
              :label="item.dicValue"
              :value="item.dicKey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="市补贴金额"
          prop="citySubsidy">
          <el-input type="number"
            v-model="form.citySubsidy"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="区补贴金额"
          prop="localSubsidy">
          <el-input type="number"
            v-model="form.localSubsidy"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="充值金额"
          prop="reCharge">
          <el-input type="number"
            v-model="form.reCharge"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="积分"
          prop="integral">
          <el-input type="number"
            v-model="form.integral"
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
  cId: '',
  citySubsidy: '',
  localSubsidy: '',
  reCharge: '',
  integral: ''
}

const list = [
  {
    id: '1'
  },
  {
    id: '2'
  }
]

const organOptions = [
  {
    dicKey: '01',
    dicValue: '蔡甸养老院'
  }
]

export default {
  name: 'HelloWorld',
  data() {
    return {
      list,
      btnPowers: null,
      timeQuerys: [],
      organOptions,
      listQuery: {
        reserve1: '',
        idNumber: ''
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
      const apiUrl = allApi.cuswallet.purList
      getRecordList(apiUrl, {
        page: this.currentPage,
        pageSize: this.pageSize,
        reserve1: this.listQuery.reserve1,
        reserve2: this.listQuery.idNumber,
        reserve3: this.timeQuerys[0],
        reserve4: this.timeQuerys[1],
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
          const apiUrl = allApi.cuswallet.addData
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
          const apiUrl = allApi.cuswallet.updateData
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
          const apiUrl = allApi.cuswallet.delData
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
