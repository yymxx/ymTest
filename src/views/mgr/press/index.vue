<template>
  <div class="main-container">
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
      <el-table-column label="按钮名称"
        prop="buttonName"
        align="center">
      </el-table-column>
      <el-table-column label="按钮类型"
        prop="type"
        align="center">
      </el-table-column>
      <el-table-column label="排序"
        prop="sortNum"
        align="center">
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]"
      @close="clearFormValidate('form')"
      :visible.sync="dialogFormVisible"
      width="460px">
      <el-form :model="form"
        :rules="rules"
        ref="form"
        label-width="120px">
        <el-form-item label="按钮名称"
          prop="buttonName">
          <el-input v-model="form.buttonName"
            placeholder="请输入按钮名称"
            style="width: 240px;"></el-input>
        </el-form-item>
        <el-form-item label="按钮类型"
          prop="type">
          <el-select class="filter-item"
            clearable
            v-model="form.type"
            placeholder="请选择"
            style="width: 240px">
            <el-option v-for="item in btnOptions"
              :key="item.dicKey"
              :label="item.dicValue"
              :value="item.dicKey"></el-option>
          </el-select>
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

const powers = {
  id: null,
  buttonName: '',
  type: '',
  create_user: '',
  sortNum: 0
}

const list = []

const btnOptions = [
  {
    dicKey: 'addBtn',
    dicValue: '添加按钮'
  },
  {
    dicKey: 'editBtn',
    dicValue: '修改按钮'
  },
  {
    dicKey: 'delBtn',
    dicValue: '删除按钮'
  },
  {
    dicKey: 'lotBtn',
    dicValue: '导入按钮'
  },
  {
    dicKey: 'outBtn',
    dicValue: '导出按钮'
  },
  {
    dicKey: 'funcBtn',
    dicValue: '操作按钮'
  },
  {
    dicKey: 'detailBtn',
    dicValue: '详情按钮'
  }
]

export default {
  name: 'HelloWorld',
  data() {
    return {
      list,
      btnPowers: null,
      listQuarters: null,
      bunkOptions: [],
      btnOptions,
      mulSelection: [],
      form: { ...powers },
      rules: {
        title: [
          {
            required: true,
            message: '请输入模块名称',
            trigger: 'blur'
          }
        ]
      },
      isReadonly: false,
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
    this.btnPowers = this.$route.meta.btnList
    console.log('btnPowers', this.btnPowers)

    this.handleQuery()
  },
  methods: {
    handleCascader() {
      this.listQuery.quarters = this.listQuarters[1]
    },
    handleQuery() {
      const apiUrl = allApi.sys.button.getList
      getRecordList(apiUrl, {
        page: 1,
        pageSize: 20,
        buttonName: ''
      }).then(response => {
        console.log(111, response)
        if (response.data) {
          this.totalOlders = response.data.totalRecord
          this.list = response.data.dataList
        }
      })
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.form = { ...powers }
      this.form.create_user = this.sysUser.id
    },
    create(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          const apiUrl = allApi.sys.button.addData
          addRecord(apiUrl, this.form).then(res => {
            this.handleQuery()
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
          const apiUrl = allApi.sys.button.updateData
          updateRecord(apiUrl, this.form).then(res => {
            this.handleQuery()
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
          const apiUrl = allApi.sys.button.delData
          delOneRecord(apiUrl, this.mulSelection[0].id).then(res => {
            this.handleQuery()
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
