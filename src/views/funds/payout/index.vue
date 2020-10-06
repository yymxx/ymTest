<template>
  <div class="main-container">
    <div class="filter-container">
      <el-input class="filter-input"
        placeholder="请输入标题"
        style="width: 280px;margin-right: 20px;"
        v-model="listQuery.exTitle">
        <template slot="prepend">标题</template>
      </el-input>
      <div class="time-editor">
        <div class="type">
          支出日期
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
          支出类型
        </div>
        <el-select placeholder="请选择"
          v-model="listQuery.exClass">
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
      <el-table-column label="标题"
        prop="exTitle"
        align="center">
      </el-table-column>
      <el-table-column label="支出类型"
        prop="reserve2"
        align="center">
      </el-table-column>
      <el-table-column label="支出日期"
        prop="exTime"
        align="center">
      </el-table-column>
      <el-table-column label="受理人"
        prop="exName"
        align="center">
      </el-table-column>
      <el-table-column label="受理人电话"
        prop="exPhone"
        align="center">
      </el-table-column>
      <el-table-column label="支出金额"
        prop="exMoney"
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
        <el-form-item label="支出类型"
          prop="exClass">
          <el-select class="filter-item"
            clearable
            v-model="form.exClass"
            placeholder="请选择"
            style="width: 240px"
            :disabled="isReadonly">
            <el-option v-for="item in options.gender"
              :key="item.val"
              :label="item.dataKey"
              :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题"
          prop="exTitle">
          <el-input v-model="form.exTitle"
            placeholder="请输入标题"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="受理人"
          prop="exName">
          <el-input v-model="form.exName"
            placeholder="请输入受理人"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="受理人电话"
          prop="exPhone">
          <el-input v-model="form.exPhone"
            placeholder="请输入受理人电话"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="支出日期"
          prop="exTime">
          <el-date-picker type="date"
            v-model="form.exTime"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            style="width: 240px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="支出金额"
          prop="exMoney">
          <el-input type="number"
            v-model="form.exMoney"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="备注"
          prop="reserve1">
          <el-input type="textarea"
            v-model="form.reserve1"
            placeholder="请输入备注"
            style="width: 610px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <span class="avatar-box">
          <el-form-item label="支出凭证">
            <el-upload class="avatar-uploader"
              :action="updateImgUrl"
              accept="image/*"
              :show-file-list="false"
              :on-success="handleAvatar">
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div v-if="form.exExplain"
              class="avatar-uploader">
              <img :src="form.exExplain"
                class="avatar">
            </div>
          </el-form-item>
        </span>
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
  exClass: '',
  exTitle: '',
  exName: '',
  exPhone: '',
  exTime: '',
  exMoney: '',
  exExplain: '',
  reserve1: ''
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
      updateImgUrl: allApi.updateImg,
      options: {
        gender: []
      },
      timeQuerys: [],
      listQuery: {
        exClass: '',
        exTitle: ''
      },
      mulSelection: [],
      currentPage: 1,
      pageSize: 10,
      totalOlders: 30,
      isReadonly: false,
      form: { ...notes },
      rules: {
        exClass: [],
        exTitle: [],
        exName: [],
        exPhone: [],
        exTime: [],
        exMoney: []
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

    for (var key in this.rules) {
      this.rules[key] = [
        {
          required: true,
          message: '必填项',
          trigger: 'blur'
        }
      ]
    }

    this.findDicList()
    this.handleQuery(this.currentPage, this.pageSize)
  },
  computed: {
    ...mapGetters(['sysUser'])
  },
  methods: {
    findDicList() {
      findByDicCode('exClass').then(response => {
        this.options.gender = response.data.dataList
      })
    },
    handleAvatar(res, file) {
      console.log(file)
      this.form.exExplain = res.imgUrl
    },
    handleQuery(currentPage, pageSize) {
      this.currentPage = 1
      if (currentPage) this.currentPage = currentPage
      const apiUrl = allApi.expenditure.getList
      getRecordList(apiUrl, {
        page: this.currentPage,
        pageSize: this.pageSize,
        reserve1: this.timeQuerys[0],
        reserve2: this.timeQuerys[1],
        exTitle: this.listQuery.exTitle,
        exClass: this.listQuery.exClass,
        create_user: this.sysUser.id,
        roleId: this.sysUser.roleId
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
          const apiUrl = allApi.expenditure.addData
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

        this.form.exClass = parseInt(this.form.exClass)
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
          const apiUrl = allApi.expenditure.updateData
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
          const apiUrl = allApi.expenditure.delData
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

      this.form.exClass = parseInt(this.form.exClass)
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
</style>
