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
            v-model="listQuery.nickName">
            <template slot="prepend">服务中心</template>
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
          <el-table-column label="服务中心"
            prop="wdNum"
            align="center">
          </el-table-column>
          <el-table-column label="场所"
            prop="wdClass"
            align="center">
          </el-table-column>
          <el-table-column label="品牌"
            prop="wdState"
            align="center">
          </el-table-column>
          <el-table-column label="型号"
            prop="applyTime"
            align="center">
          </el-table-column>
          <el-table-column label="编码"
            prop="wdCreateId"
            align="center">
          </el-table-column>
          <el-table-column label="接入时间"
            prop="wdRemarks"
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
        label-width="120px">
        <el-form-item label="服务中心"
          prop="wdNum">
          <el-input v-model="form.wdNum"
            placeholder="请输入服务中心"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="设备品牌"
          prop="wdNum">
          <el-input v-model="form.wdNum"
            placeholder="请输入设备品牌"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="设备型号"
          prop="wdNum">
          <el-select class="filter-item"
            clearable
            v-model="form.wdNum"
            placeholder="请选择"
            style="width: 240px"
            :disabled="isReadonly">
            <el-option v-for="item in options.gender"
              :key="item.val"
              :label="item.dataKey"
              :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备编码"
          prop="wdNum">
          <el-input v-model="form.wdNum"
            placeholder="请输入设备编码"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="场所位置"
          prop="spAddress">
          <el-input v-model="form.spAddress"
            placeholder="请输入地址"
            style="width: 460px;"></el-input>
          <span class="seat-map"
            @click="handleAddress()">
            <svg-icon icon-class="seat"></svg-icon>
            <span>选择地址</span>
          </span>
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

    <el-dialog width="800px"
      title="点击地图选择地址"
      :visible.sync="dialogMapShow"
      @close="dialogMapClose()"
      :close-on-click-modal="false">
      <gould-map v-if="dialogMapShow"
        @setGoback="handleMapback"></gould-map>
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
import gouldMap from '@/components/GouldMap'

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
  components: {
    gouldMap
  },
  data() {
    return {
      list,
      btnPowers: null,
      options: {
        gender: []
      },
      listQuery: {
        nickName: ''
      },
      mulSelection: [],
      currentPage: 1,
      pageSize: 10,
      totalOlders: 30,
      currDept: null,
      deptList: [],
      defaultProps: {
        children: 'children',
        label: 'addressName'
      },
      isReadonly: false,
      dialogMapShow: false,
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
    getRecordList(allApi.addresstable.getList, {}).then(response => {
      console.log(222, response)
      this.deptList = response.data.dataList
    })
  },
  methods: {
    findDicList() {
      findByDicCode('sex').then(response => {
        this.options.gender = response.data.dataList
      })
    },
    handleNodeClick(data) {
      this.currDept = data
      let dataId = ''
      if (data && !data.children) dataId = data.id
      console.log(dataId)
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
    handleDelete() {
      if (this.mulSelection.length > 0) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const apiUrl = allApi.subsidyratio.getList
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
    handleAddress() {
      this.dialogMapShow = true
    },
    handleMapback(data) {
      this.dialogMapShow = false
      this.form.spAddress = data.address
    },
    dialogMapClose() {
      this.dialogMapShow = false
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
