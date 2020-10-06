<template>
  <div class="main-container">
    <div class="filter-container">
      <div class="time-editor">
        <div class="type">
          测量时间
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
        prop="reserve1"
        align="center">
      </el-table-column>
      <el-table-column label="身份证号"
        prop="cIdCard"
        align="center">
      </el-table-column>
      <el-table-column label="血氧值"
        prop="bloodoxygenValue"
        align="center">
      </el-table-column>
      <el-table-column label="数据来源"
        prop="measuringLocation"
        align="center">
      </el-table-column>
      <el-table-column label="测量时间"
        prop="measuringTime"
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
        <el-form-item label="老人名称"
          prop="olderName">
          <el-input v-model="form.olderName"
            placeholder="请输入老人名称"
            readonly
            style="width: 240px;"></el-input>
        </el-form-item>
        <el-form-item label="血氧值"
          prop="charge">
          <el-input type="number"
            v-model="form.charge"
            style="width: 240px;"></el-input>
        </el-form-item>
        <el-form-item label="数据来源"
          prop="roleName">
          <el-input v-model="form.roleName"
            placeholder="请输入数据来源"
            style="width: 240px;"></el-input>
        </el-form-item>
        <el-form-item label="测量时间"
          prop="dateBirth">
          <el-date-picker type="datetime"
            v-model="form.dateBirth"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
            style="width: 240px">
          </el-date-picker>
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
import { getRecordList } from '@/api/page'
import { allApi } from '@/api/config'
import { mapGetters } from 'vuex'

const notes = {
  id: null,
  orgContent: '',
  olderName: '',
  idCard: ''
}

export default {
  name: 'olderOxygen',
  data() {
    return {
      list: [
        {
          realName: 100
        }
      ],
      timeQuerys: null,
      mulSelection: [],
      currentPage: 1,
      pageSize: 10,
      totalOlders: 30,
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
        create: '创建'
      }
    }
  },
  props: ['listRow'],
  watch: {
    listRow(newVal, oldVal) {
      this.listRow = newVal
    }
  },
  computed: {
    ...mapGetters(['sysUser'])
  },
  created() {
    this.handleQuery(1, 20)
  },
  methods: {
    handleQuery(currentPage, pageSize) {
      const apiUrl = allApi.healthy.bloodoxygen
      getRecordList(apiUrl, {
        page: currentPage,
        pageSize: pageSize,
        create_user: this.sysUser.id,
        roleId: this.sysUser.roleId
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
      this.handleQuery(val, this.pageSize)
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.form = { ...notes }
      this.form.olderId = this.listRow.olderId
      this.form.olderName = this.listRow.olderName
    },
    create(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
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
        }).then(() => {})
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
