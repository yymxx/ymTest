<template>
  <div>
    <div v-show="!dialogFormVisible">
      <div class="filter-container">
        <div class="select">
          <div class="type">
            有效标志
          </div>
          <el-select placeholder="请选择"
            v-model="listQuery.activeSign">
            <el-option v-for="item in signOptions"
              :key="item.val"
              :label="item.dataKey"
              :value="item.val"></el-option>
          </el-select>
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
        <el-table-column label="适用老人"
          prop="applicableElderly"
          align="center">
        </el-table-column>
        <el-table-column label="标准名称"
          prop="areaSubsidyName"
          align="center">
        </el-table-column>
        <el-table-column label="补贴比例"
          prop="sharingRatio"
          align="center">
        </el-table-column>
        <el-table-column label="有效标注"
          prop="effectiveSign"
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
    </div>
    <div v-if="dialogFormVisible">
      <el-form :inline="true"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="120px">
        <el-form-item label="标准名称"
          prop="areaSubsidyName">
          <el-input v-model="form.areaSubsidyName"
            placeholder="请输入标准名称"
            style="width: 240px;"></el-input>
        </el-form-item>
        <el-form-item label="适用老人"
          prop="applicableElderly">
          <el-select class="filter-item"
            clearable
            v-model="form.applicableElderly"
            placeholder="请选择"
            style="width: 240px">
            <el-option v-for="item in olderOptions"
              :key="item.val"
              :label="item.dataKey"
              :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="补贴比例"
          prop="sharingRatio">
          <el-input type="number"
            v-model="form.sharingRatio"
            @keyup.native="handNumChange"
            style="width: 240px;"></el-input>
        </el-form-item>
        <el-form-item label="有效标志"
          prop="effectiveSign">
          <el-select class="filter-item"
            clearable
            v-model="form.effectiveSign"
            placeholder="请选择"
            style="width: 240px">
            <el-option v-for="item in signOptions"
              :key="item.val"
              :label="item.dataKey"
              :value="item.val"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="det-footer">
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
      </div>
    </div>
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
  name: 'subsidyDetail',
  data() {
    return {
      list,
      olderOptions: [],
      signOptions: [],
      listQuery: {
        activeSign: ''
      },
      mulSelection: [],
      currentPage: 1,
      pageSize: 10,
      totalOlders: 30,
      dialogFormVisible: false,
      dialogStatus: '',
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
  props: ['rowData'],
  created() {
    this.findDicList()
    this.handleQuery(this.currentPage, this.pageSize)
  },
  methods: {
    findDicList() {
      findByDicCode('effectiveSign').then(response => {
        this.signOptions = response.data.dataList
      })

      findByDicCode('districtType').then(response => {
        this.olderOptions = response.data.dataList
      })
    },
    handleQuery(currentPage, pageSize) {
      const apiUrl = allApi.areasubsidystandard.getList
      if (currentPage && pageSize) {
        getRecordList(apiUrl, {
          page: currentPage,
          pageSize: pageSize
        }).then(response => {
          this.totalOlders = response.data.totalRecord
          this.list = response.data.dataList
          console.log(111, response)
        })
      } else {
        getRecordList(apiUrl, {
          page: this.currentPage,
          pageSize: this.pageSize,
          activeSign: this.listQuery.activeSign
        }).then(response => {
          this.totalOlders = response.data.totalRecord
          this.list = response.data.dataList
        })
      }
    },
    handleSizeChange(val) {
      this.currentPage = 1
      this.pageSize = val
      this.handleQuery(this.currentPage, val)
    },
    handleCurrentChange(val) {
      this.handleQuery(val, this.pageSize)
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$emit('setGoback', ['860px', '创建区级补贴'])
      this.form = { ...notes }
    },
    create(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          this.$emit('setGoback', ['1200px', '区级补贴'])
          const apiUrl = allApi.areasubsidystandard.addData
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
        this.$emit('setGoback', ['860px', '编辑区级补贴'])
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
          this.$emit('setGoback', ['1200px', '区级补贴'])
          const apiUrl = allApi.areasubsidystandard.updateData
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
          const apiUrl = allApi.areasubsidystandard.delData
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
    handNumChange() {
      this.form.charge = this.form.charge.replace(/[^0-9]/g, '')
    },
    cancel(formName) {
      this.dialogFormVisible = false
      this.$emit('setGoback', ['1200px', '区级补贴'])
    },
    clearFormValidate(formName) {
      this.$refs[formName].clearValidate()
    }
  }
}
</script>

<style lang="scss" scoped>
.det-footer {
  padding-top: 30px;
  text-align: right;
}
</style>
