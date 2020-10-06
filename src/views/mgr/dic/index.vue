<template>
  <div class="main-container">
    <div class="filter-container">
      <el-input class="filter-input"
        placeholder="请输入字典名称"
        style="width: 320px;margin-right: 20px;"
        v-model="listQuery.dicCode">
        <template slot="prepend">字典名称</template>
      </el-input>
      <el-button type="primary"
        icon="el-icon-search"
        @click="handleQuery()">查询</el-button>
    </div>
    <div class="filter-container"
      style="flex-wrap: nowrap;">
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
      <el-table-column label="字典"
        prop="typeName"
        align="center">
      </el-table-column>
      <el-table-column label="字典名称"
        prop="tableName"
        align="center">
      </el-table-column>
      <el-table-column label="键值"
        prop="val"
        align="center">
      </el-table-column>
      <el-table-column label="键名"
        prop="dataKey"
        align="center">
      </el-table-column>
      <el-table-column label="排序"
        prop="sortNum"
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
      width="450px">
      <el-form :model="form"
        :rules="rules"
        ref="form"
        label-width="110px">
        <el-form-item label="字典"
          prop="typeName">
          <el-input v-model="form.typeName"
            placeholder="请输入字典"
            style="width: 240px;"></el-input>
        </el-form-item>
        <el-form-item label="字典名称"
          prop="tableName">
          <el-input v-model="form.tableName"
            placeholder="请输入字典名称"
            style="width: 240px;"></el-input>
        </el-form-item>
        <el-form-item label="字典键"
          prop="val">
          <el-input v-model="form.val"
            placeholder="请输入字典键"
            style="width: 240px;"></el-input>
        </el-form-item>
        <el-form-item label="字典键名"
          prop="dataKey">
          <el-input v-model="form.dataKey"
            placeholder="请输入字典键名"
            style="width: 240px;"></el-input>
        </el-form-item>
        <el-form-item label="排序码">
          <el-input-number v-model="form.sortNum"
            placeholder="请输入排序码"
            style="width: 240px;"></el-input-number>
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

const dic = {
  id: null,
  typeName: '',
  tableName: '',
  val: '',
  dataKey: '',
  create_user: '',
  sortNum: 0
}

export default {
  name: 'HelloWorld',
  data() {
    return {
      list: [],
      btnPowers: null,
      listLoading: false,
      listQuery: {
        dicCode: ''
      },
      listHandlerRow: null,
      mulSelection: [],
      currentPage: 1,
      pageSize: 10,
      totalOlders: 26,
      form: { ...dic },
      rules: {
        dicKey: [
          {
            required: true,
            message: '请输入字典键',
            trigger: 'blur'
          }
        ],
        dicValue: [
          {
            required: true,
            message: '请输入字典值',
            trigger: 'blur'
          }
        ]
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      }
    }
  },
  computed: {
    ...mapGetters(['sysUser'])
  },
  created() {
    console.log('sysUser', this.sysUser)
    this.btnPowers = this.$route.meta.btnList
    console.log('btnPowers', this.btnPowers)
    console.log(this.$store.state)
    this.handleQuery(this.currentPage, this.pageSize)
  },
  methods: {
    formatterYesNo(row) {
      return row.isSys ? '是' : '否'
    },
    handleQuery(currentPage, pageSize) {
      this.currentPage = 1
      if (currentPage) this.currentPage = currentPage
      const apiUrl = allApi.sys.dic.getList
      getRecordList(apiUrl, {
        page: this.currentPage,
        pageSize: this.pageSize,
        tableName: this.listQuery.dicCode
      }).then(response => {
        this.totalOlders = response.data.totalRecord
        this.list = response.data.dataList
        console.log(111, response)
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
      this.form = { ...dic }
      this.form.create_user = this.sysUser.id
    },
    create(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          const apiUrl = allApi.sys.dic.addData
          addRecord(apiUrl, this.form).then(res => {
            console.log(res)
            this.handleQuery(this.currentPage, this.pageSize)
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
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
          const apiUrl = allApi.sys.dic.updateData
          updateRecord(apiUrl, this.form).then(res => {
            this.handleQuery(this.currentPage, this.pageSize)
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
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
          const apiUrl = allApi.sys.dic.delData
          delOneRecord(apiUrl, this.mulSelection[0].id).then(res => {
            this.handleQuery(this.currentPage, this.pageSize)
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
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
