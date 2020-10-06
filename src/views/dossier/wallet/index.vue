<template>
  <div class="main-container">
    <div class="filter-container">
      <el-input class="filter-input"
        placeholder="请输入姓名"
        style="width: 280px;margin-right: 20px;"
        v-model="listQuery.nickName">
        <template slot="prepend">姓名</template>
      </el-input>
      <el-input class="filter-input"
        placeholder="请输入证件号码"
        style="width: 280px;margin-right: 20px;"
        v-model="listQuery.idNumber">
        <template slot="prepend">证件号码</template>
      </el-input>
      <div class="select">
        <div class="type">
          居住社区
        </div>
        <el-cascader clearable
          v-model="listQuarters"
          :options="bunkOptions"
          :show-all-levels="false"
          @change="handleCascader"
          filterable>
        </el-cascader>
      </div>
      <el-button type="primary"
        icon="el-icon-search"
        @click="handleQuery()">查询</el-button>
    </div>
    <div class="filter-container">
      <el-button type="warning"
        icon="el-icon-edit"
        @click="handleRecharge()">充值</el-button>
      <!-- <el-button type="warning"
        icon="el-icon-edit"
        @click="handleUpdate()">修改</el-button> -->
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
        prop="reserve1"
        align="center">
      </el-table-column>
      <el-table-column label="证件号码"
        prop="reserve2"
        align="center">
      </el-table-column>
      <el-table-column label="所属街道"
        prop="reserve4"
        align="center">
      </el-table-column>
      <el-table-column label="居住社区"
        prop="reserve3"
        align="center">
      </el-table-column>
      <el-table-column label="市补贴金额"
        prop="citySubsidy"
        align="center">
      </el-table-column>
      <el-table-column label="区补贴金额"
        prop="localSubsidy"
        align="center">
      </el-table-column>
      <el-table-column label="充值金额"
        prop="reCharge"
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
          <el-input readonly
            v-model="form.reserve1"
            placeholder="请输入老人"
            style="width: 240px;"></el-input>
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

    <el-dialog title="修改充值"
      @close="clearFormValidate('formR')"
      :visible.sync="dialogRVisible"
      width="550px">
      <el-form :model="formR"
        :rules="rules"
        ref="formR"
        label-width="120px">
        <el-form-item label="充值金额"
          prop="reCharge">
          <el-input type="number"
            v-model="formR.reCharge"
            style="width: 280px;"></el-input>
        </el-form-item>
        <el-form-item label="充值方式"
          prop="reserve1">
          <el-select class="filter-item"
            clearable
            v-model="formR.reserve1"
            placeholder="请选择"
            style="width: 280px">
            <el-option v-for="item in options.gender"
              :key="item.val"
              :label="item.dataKey"
              :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注"
          prop="reserve2">
          <el-input type="textarea"
            v-model="formR.reserve2"
            placeholder="请输入备注"
            style="width: 280px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button @click="cancel('formR')">取 消</el-button>
        <el-button type="primary"
          @click="recharge('formR')">确定</el-button>
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
  citySubsidy: '',
  localSubsidy: '',
  reCharge: '',
  integral: '',
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
      organOptions,
      listQuarters: [],
      bunkOptions: [],
      options: {
        gender: []
      },
      listQuery: {
        nickName: '',
        idNumber: ''
      },
      mulSelection: [],
      currentPage: 1,
      pageSize: 10,
      totalOlders: 30,
      isReadonly: false,
      dialogRVisible: false,
      formR: {
        id: null,
        reCharge: '',
        reserve1: '',
        reserve2: '',
        create_user: ''
      },
      form: { ...notes },
      rules: {
        reCharge: [],
        reserve1: []
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

    for (var key in this.rules) {
      this.rules[key] = [
        {
          required: true,
          message: '必填项',
          trigger: 'blur'
        }
      ]
    }

    getRecordList(allApi.addresstable.getList, {}).then(response => {
      this.bunkOptions = this.handleHigher(response.data.dataList)
    })

    this.findDicList()
    this.handleQuery(this.currentPage, this.pageSize)
  },
  methods: {
    handleCascader() {
      console.log(this.listQuarters[1])
    },
    findDicList() {
      findByDicCode('reClass').then(response => {
        this.options.gender = response.data.dataList
      })
    },
    handleQuery(currentPage, pageSize) {
      this.currentPage = 1
      if (currentPage) this.currentPage = currentPage
      const apiUrl = allApi.cuswallet.getList
      getRecordList(apiUrl, {
        page: this.currentPage,
        pageSize: this.pageSize,
        reserve1: this.listQuery.nickName,
        reserve2: this.listQuery.idNumber,
        reserve3: this.listQuarters[2],
        organizationId: this.sysUser.institutionsId
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
    handleRecharge() {
      console.log(this.mulSelection)
      if (this.mulSelection.length === 1) {
        this.dialogRVisible = true
        // this.formR.reCharge = this.mulSelection[0].reCharge
        this.formR = {
          id: this.mulSelection[0].id,
          reCharge: '',
          reserve1: '',
          reserve2: '',
          create_user: this.sysUser.id
        }
      } else {
        this.$message({
          type: 'warning',
          message: '请选择一条记录'
        })
      }
    },
    recharge(formName) {
      console.log(this.formR)
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogRVisible = false
          const apiUrl = allApi.cuswallet.updData
          updateRecord(apiUrl, this.formR).then(res => {
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
    handleHigher(data) {
      let rlist = JSON.parse(JSON.stringify(data))
      return rlist.reduce((res, item) => {
        if (item.children && item.children.length > 0) {
          return res.concat({
            value: item.id,
            label: item.addressName,
            children: this.handleHigher(item.children)
          })
        }

        return res.concat({
          value: item.id,
          label: item.addressName
        })
      }, [])
    },
    cancel(formName) {
      this.dialogFormVisible = false
      this.dialogRVisible = false
    },
    clearFormValidate(formName) {
      this.$refs[formName].clearValidate()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
