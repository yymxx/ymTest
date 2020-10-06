<template>
  <div class="main-container">
    <div class="filter-container">
      <el-input class="filter-input"
        placeholder="请输入服务名称"
        style="width: 280px;margin-right: 20px;"
        v-model="listQuery.nickName">
        <template slot="prepend">服务名称</template>
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
      <el-table-column label="服务项"
        prop="reserve1"
        align="center">
      </el-table-column>
      <el-table-column label="市级补贴比例"
        prop="municipalScale"
        align="center">
      </el-table-column>
      <el-table-column label="区级补贴比例"
        prop="districtRatio"
        align="center">
      </el-table-column>
      <el-table-column label="生效年月(起)"
        prop="cEffectiveYears"
        align="center">
      </el-table-column>
      <el-table-column label="生效年月(止)"
        prop="effectiveYears"
        align="center">
      </el-table-column>
      <el-table-column label="状态"
        prop="reserve2"
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
        label-width="130px">
        <el-form-item label="服务项目"
          prop="spId">
          <el-input v-if="isReadonly"
            v-model="form.reserve1"
            placeholder="请输入服务项目"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
          <el-input v-else
            v-model="form.reserve1"
            placeholder="请输入服务项目"
            @focus="handleProject"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="市级补贴比例"
          prop="municipalScale">
          <el-input type="number"
            v-model="form.municipalScale"
            min="0"
            max="100"
            step="1"
            @keyup.native="handNumChange('municipalScale')"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="区级补贴比例"
          prop="districtRatio">
          <el-input type="number"
            v-model="form.districtRatio"
            min="0"
            max="100"
            step="1"
            @keyup.native="handNumChange('districtRatio')"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="生效年月(起)"
          prop="cEffectiveYears">
          <el-date-picker type="date"
            v-model="form.cEffectiveYears"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            style="width: 240px"
            :disabled="isReadonly">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="生效年月(止)"
          prop="effectiveYears">
          <el-date-picker type="date"
            v-model="form.effectiveYears"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            style="width: 240px"
            :disabled="isReadonly">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态"
          prop="state">
          <el-input readonly
            v-if="isReadonly"
            v-model="form.reserve2"
            style="width: 240px;"></el-input>
          <el-select v-else
            class="filter-item"
            clearable
            v-model="form.state"
            placeholder="请选择"
            style="width: 240px"
            :disabled="isReadonly">
            <el-option v-for="item in signOptions"
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
        <el-button v-if="dialogStatus=='update'"
          type="primary"
          @click="update('form')">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog width="960px"
      title="选择服务项目"
      :visible.sync="dialogProShow"
      @close="dialogOldClose()"
      :close-on-click-modal="false">
      <choose-options v-if="dialogProShow"
        :data="form.reserve1"
        @setGoback="handleOldback"></choose-options>
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
import chooseOptions from './choose'

const notes = {
  id: null,
  spId: '',
  municipalScale: '',
  districtRatio: '',
  cEffectiveYears: '',
  effectiveYears: '',
  state: '',
  reserve1: '',
  reserve2: ''
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
  components: {
    chooseOptions
  },
  data() {
    return {
      list,
      btnPowers: null,
      signOptions: [],
      listQuery: {
        nickName: ''
      },
      mulSelection: [],
      currentPage: 1,
      pageSize: 10,
      totalOlders: 30,
      isReadonly: false,
      dialogProShow: false,
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
  created() {
    this.btnPowers = this.$route.meta.btnList
    console.log('btnPowers', this.btnPowers)

    this.findDicList()
    this.handleQuery(this.currentPage, this.pageSize)
  },
  methods: {
    findDicList() {
      findByDicCode('effectiveSign').then(response => {
        this.signOptions = response.data.dataList
      })
    },
    handleQuery(currentPage, pageSize) {
      this.currentPage = 1
      if (currentPage) this.currentPage = currentPage
      const apiUrl = allApi.subsidyratio.getList
      getRecordList(apiUrl, {
        page: this.currentPage,
        pageSize: this.pageSize,
        nickName: this.listQuery.nickName
      }).then(response => {
        this.totalOlders = response.data.totalRecord
        this.list = response.data.dataList
        console.log('list', this.list)
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
          const apiUrl = allApi.subsidyratio.addData
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
          const apiUrl = allApi.subsidyratio.updateData
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
          const apiUrl = allApi.subsidyratio.delData
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
    handNumChange(val) {
      this.form[val] = this.form[val].replace(/[^0-9]/g, '')
    },
    handleProject() {
      this.dialogProShow = true
    },
    handleOldback(data) {
      console.log(data)
      const rlist = data.split('-')
      this.form.spId = rlist[0]
      this.form.reserve1 = rlist[1]
      this.dialogProShow = false
    },
    dialogOldClose() {
      this.dialogProShow = false
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
