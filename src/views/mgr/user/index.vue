<template>
  <div class="main-container">
    <div class="dept-container">
      <div style="padding-right: 15px;">
        <el-card>
          <div slot="header">
            <span>街道</span>
          </div>
          <div class="dept-tree">
            <el-tree ref="tree"
              node-key="id"
              :data="deptList"
              :props="defaultProps"
              highlight-current
              auto-expand-parent
              :default-expanded-keys="[2]"
              @node-click="handleNodeClick"
              :expand-on-click-node="false">
              <span class="custom-tree-node"
                slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
              </span>
            </el-tree>
          </div>
        </el-card>
      </div>
      <div class="dept-wrapper">
        <div class="filter-container">
          <el-input class="filter-input"
            placeholder="请输入姓名"
            style="width: 280px;margin-right: 20px;"
            v-model="listQuery.name">
            <template slot="prepend">姓名</template>
          </el-input>
          <el-input class="filter-input"
            placeholder="请输入手机号"
            style="width: 280px;margin-right: 20px;"
            v-model="listQuery.mobile">
            <template slot="prepend">手机号</template>
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
          <!-- <el-button type="danger"
            icon="el-icon-delete"
            @click="handleDelete()">删除</el-button> -->
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
          <el-table-column label="账号名"
            prop="userName"
            align="center">
          </el-table-column>
          <el-table-column label="角色名称"
            prop="roleName"
            align="center">
          </el-table-column>
          <el-table-column label="姓名"
            prop="name"
            align="center"
            width="300">
          </el-table-column>
          <!-- <el-table-column label="性别"
            prop="sex"
            align="center"
            width="80">
          </el-table-column>
          <el-table-column label="年龄"
            prop="age"
            align="center"
            width="80">
          </el-table-column> -->
          <el-table-column label="联系方式"
            prop="mobile"
            align="center">
          </el-table-column>
          <!-- <el-table-column label="身份证号"
            prop="cardNum"
            align="center"
            width="190">
          </el-table-column> -->
          <el-table-column label="状态说明"
            prop="statusStr"
            align="center">
          </el-table-column>
          <el-table-column label="操作"
            align="center"
            width="150">
            <template slot-scope="scope">
              <el-button type="primary"
                size="mini"
                @click="handleModifyWd(scope.row)">重置密码</el-button>
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
      </div>
    </div>

    <el-dialog :title="textMap[dialogStatus]"
      @close="clearFormValidate('form')"
      :visible.sync="dialogFormVisible"
      width="860px">
      <el-form :inline="true"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="110px">
        <el-form-item label="用户名"
          prop="userName">
          <el-input v-model="form.userName"
            placeholder="请输入用户名"
            style="width: 240px;"
            :readonly="dialogStatus!='create'"></el-input>
        </el-form-item>
        <el-form-item label="角色"
          prop="roleId">
          <el-select class="filter-item"
            clearable
            v-model="form.roleId"
            placeholder="请选择"
            style="width: 240px">
            <el-option v-for="item in options.roles"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名"
          prop="name">
          <el-input v-model="form.name"
            placeholder="请输入姓名"
            style="width: 240px;"></el-input>
        </el-form-item>
        <el-form-item label="联系方式"
          prop="mobile">
          <el-input v-model="form.mobile"
            maxlength="11"
            placeholder="请输入联系方式"
            style="width: 240px;"></el-input>
        </el-form-item>
        <!-- <el-form-item label="性别"
          prop="sex">
          <el-select class="filter-item"
            clearable
            v-model="form.sex"
            placeholder="请选择"
            style="width: 240px">
            <el-option v-for="item in options.gender"
              :key="item.val"
              :label="item.dataKey"
              :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄"
          prop="age">
          <el-input v-model="form.age"
            placeholder="请输入年龄"
            style="width: 240px;"></el-input>
        </el-form-item>
        <el-form-item label="身份证号"
          prop="cardNum">
          <el-input v-model="form.cardNum"
            minlength="18"
            placeholder="请输入身份证号"
            style="width: 240px;"></el-input>
        </el-form-item> -->
        <el-form-item label="状态"
          prop="status">
          <el-select class="filter-item"
            clearable
            v-model="form.status"
            placeholder="请选择"
            style="width: 240px">
            <el-option v-for="item in options.bank"
              :key="item.val"
              :label="item.dataKey"
              :value="item.val"></el-option>
          </el-select>
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
  delOneRecord,
  findByDicCode
} from '@/api/page'
import { allApi } from '@/api/config'
import { mapGetters } from 'vuex'

const user = {
  id: null,
  userName: '',
  passWd: '123456',
  name: '',
  sex: 1,
  age: '1',
  mobile: '',
  cardNum: '1',
  institutionsId: '',
  institutionsName: '',
  roleId: 1,
  status: 1,
  create_user: ''
}

export default {
  name: 'HelloWorld',
  data() {
    const validateName = (rule, value, callback) => {
      if (value && value.length > 0) {
        var reg = /^[0-9]+[a-zA-Z]+[0-9a-zA-Z]*|[a-zA-Z]+[0-9]+[0-9a-zA-Z]*$/
        if (!reg.test(value)) {
          callback()
          // callback(new Error('请输入数字或字母'))
        } else {
          callback()
        }
      } else {
        callback(new Error('请输入'))
      }
    }

    return {
      btnPowers: null,
      currDept: null,
      deptList: [],
      defaultProps: {
        children: 'children',
        label: 'addressName'
      },
      list: [],
      options: {
        gender: [],
        bank: [],
        roles: []
      },
      listQuery: {
        name: '',
        mobile: ''
      },
      mulSelection: [],
      currentPage: 1,
      pageSize: 10,
      totalOlders: 26,
      form: { ...user },
      rules: {
        userName: [
          {
            required: true,
            trigger: 'blur',
            validator: validateName
          }
        ],
        name: [
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
        create: '创建'
      },
      pickerOptions: {
        start: '08:30',
        step: '00:30',
        end: '18:30'
      }
    }
  },
  computed: {
    ...mapGetters(['sysUser'])
  },
  mounted() {
    this.btnPowers = this.$route.meta.btnList
    console.log('btnPowers', this.btnPowers)

    this.findDicList()
    this.handleQuery(this.currentPage, this.pageSize)

    getRecordList(allApi.addresstable.getList, {}).then(response => {
      console.log(222, response)
      this.deptList = response.data.dataList
    })

    getRecordList(allApi.sys.role.getList, {}).then(response => {
      this.options.roles = response.data.dataList
    })
  },
  methods: {
    findDicList() {
      findByDicCode('sex').then(response => {
        this.options.gender = response.data.dataList
      })

      findByDicCode('sysUserState').then(response => {
        this.options.bank = response.data.dataList
      })
    },
    handleNodeClick(data) {
      this.currDept = data
      let dataId = ''
      if (data) dataId = data.id
      const apiUrl = allApi.sys.user.getList
      getRecordList(apiUrl, {
        page: this.currentPage,
        pageSize: this.pageSize,
        institutionsId: dataId
      }).then(response => {
        this.totalOlders = response.data.totalRecord
        this.list = response.data.dataList
      })
    },
    handleQuery(currentPage, pageSize) {
      this.currentPage = 1
      if (currentPage) this.currentPage = currentPage
      const apiUrl = allApi.sys.user.getList
      let dataId = ''
      const data = this.currDept
      if (data && !data.children) dataId = data.id
      getRecordList(apiUrl, {
        page: this.currentPage,
        pageSize: this.pageSize,
        institutionsId: dataId,
        name: this.listQuery.name,
        mobile: this.listQuery.mobile
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
    handleCreate(row) {
      if (this.currDept && !this.currDept.children) {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.form = { ...user }
        this.form.create_user = this.sysUser.id
        this.form.institutionsId = this.currDept.id
        this.form.institutionsName = this.currDept.addressName
      } else if (this.currDept) {
        console.log(this.currDept)
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.form = { ...user }
        this.form.create_user = this.sysUser.id
        this.form.institutionsId = this.currDept.id
        this.form.institutionsName = this.currDept.addressName
      } else {
        this.$message({
          type: 'warning',
          message: '请选择街道'
        })
      }
    },
    create(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          const apiUrl = allApi.sys.user.addData
          addRecord(apiUrl, this.form).then(res => {
            console.log(res)
            this.handleNodeClick(this.currDept)
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

        this.form.roleId = parseInt(this.form.roleId)
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
          const apiUrl = allApi.sys.user.updateData
          console.log(this.form)
          updateRecord(apiUrl, this.form).then(res => {
            console.log(res)
            this.handleNodeClick(this.currDept)
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
          const apiUrl = allApi.sys.user.delData
          delOneRecord(apiUrl, this.mulSelection[0].id).then(res => {
            if (res.data === 1) {
              this.handleNodeClick(this.currDept)
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
    handleModifyWd(row) {
      this.$confirm('此操作将重置密码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const apiUrl = allApi.sys.user.resetWd
        updateRecord(apiUrl, {
          id: row.id,
          status: row.status
        }).then(res => {
          if (res.data === 1) {
            this.handleNodeClick(this.currDept)
            this.$notify({
              title: '成功',
              message: '重置成功',
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
      console.log(row)
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
.avatar-box {
  min-width: 360px;
  display: inline-block;
  .el-form-item /deep/ {
    margin-bottom: 0;
    .avatar-uploader {
      display: table-cell;
      vertical-align: top;
      .el-upload {
        margin-right: 15px;
        .avatar-uploader-icon {
          width: 50px;
          height: 50px;
          line-height: 50px;
        }
      }

      .avatar {
        height: 100px;
        vertical-align: top;
      }
    }
  }
}

.avatar-user {
  float: right;
  width: 455px;
}
</style>
