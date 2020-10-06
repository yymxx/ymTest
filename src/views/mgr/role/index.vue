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
      <el-table-column label="角色名"
        prop="roleName"
        align="center">
      </el-table-column>
      <el-table-column label="角色描述"
        prop="details"
        align="center">
      </el-table-column>
      <el-table-column label="创建时间"
        prop="create_time"
        align="center">
      </el-table-column>
      <el-table-column label="操作"
        align="center"
        width="200">
        <template slot-scope="scope">
          <el-button type="primary"
            size="mini"
            @click="handlePower(scope.row)">赋权</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]"
      @close="clearFormValidate('form')"
      :visible.sync="dialogFormVisible"
      width="450px">
      <el-form :model="form"
        :rules="rules"
        ref="form"
        label-width="110px">
        <el-form-item label="角色名"
          prop="roleName">
          <el-input v-model="form.roleName"
            placeholder="请输入角色名"
            style="width: 240px;"></el-input>
        </el-form-item>
        <el-form-item label="角色描述"
          prop="details">
          <el-input type="textarea"
            v-model="form.details"
            placeholder="请输入角色描述"
            style="width: 240px;"></el-input>
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

    <el-dialog width="1200px"
      class="limitDialog"
      title="角色赋权"
      :visible.sync="dialogIsPower"
      @close="dialogPowerClose()"
      :close-on-click-modal="false">
      <customer-power v-if="dialogIsPower"
        :row-data="listHandlerRow"
        :modules="moduleList"
        @setGoback="handleGoback"></customer-power>
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
import customerPower from './power'
import { toStrMenuId } from '@/utils/pick'
import { mapGetters } from 'vuex'

const role = {
  id: null,
  roleName: '',
  roleStr: '',
  buttonRoleStr: '',
  create_user: '',
  details: '',
  create_time: '',
  sortNum: 0
}

const list = [
  {
    id: '',
    orgContent: '蔡甸养老院',
    roleName: '楼A',
    createTime: '2019-10-20'
  },
  {
    id: '',
    orgContent: '蔡甸养老院',
    roleName: '楼B',
    createTime: '2019-10-20'
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
  components: {
    customerPower
  },
  data() {
    return {
      list,
      btnPowers: null,
      organOptions,
      mulSelection: [],
      moduleList: [],
      listHandlerRow: null,
      dialogIsPower: false,
      timeValue: new Date(),
      form: { ...role },
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
    const apiUrl = allApi.sys.menu.getList
    getRecordList(apiUrl, {}).then(response => {
      this.moduleList = toStrMenuId(response.data)
    })
  },
  methods: {
    handleQuery() {
      const apiUrl = allApi.sys.role.getList
      getRecordList(apiUrl, {}).then(response => {
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
      this.form = { ...role }
      this.form.create_user = this.sysUser.id
    },
    create(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          const apiUrl = allApi.sys.role.addData
          addRecord(apiUrl, this.form).then(res => {
            console.log(res)
            this.handleQuery()
            if (res.data) {
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
          const apiUrl = allApi.sys.role.updateData
          updateRecord(apiUrl, this.form).then(res => {
            console.log(res)
            this.handleQuery()
            if (res.data) {
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
          const apiUrl = allApi.sys.role.delData
          delOneRecord(apiUrl, this.mulSelection[0].id).then(res => {
            console.log('删除', res)
            this.handleQuery()
            if (res.data) {
              this.$notify({
                title: '成功',
                message: '删除成功',
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
    handlePower(row) {
      this.listHandlerRow = row
      this.dialogIsPower = true
      for (const key in this.form) {
        this.form[key] = row[key]
      }
    },
    handleGoback(data) {
      this.form.roleStr = data.menuIds.join()
      this.form.buttonRoleStr = data.btnIds.join()
      this.dialogIsPower = false
      console.log(this.form)
      const apiUrl = allApi.sys.role.updateData
      updateRecord(apiUrl, this.form).then(res => {
        console.log('赋权', res)
        this.handleQuery()
        if (res.data) {
          this.$notify({
            title: '成功',
            message: '赋权成功',
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
    },
    dialogPowerClose() {
      this.dialogIsPower = false
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
.el-card {
  text-align: left;
  .module-box {
    min-height: 360px;
    padding: 0 30px;
    .filter-container /deep/ {
      .select {
        .el-input__inner {
          width: 240px;
        }
      }
    }
  }
}

.limitDialog /deep/ {
  .el-dialog__body {
    padding-top: 10px;
    padding-bottom: 10px;
  }
}
</style>
