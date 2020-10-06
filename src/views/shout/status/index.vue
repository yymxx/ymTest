<template>
  <div class="main-container">
    <el-table border
      :data="list"
      style="width: 100%;">
      <el-table-column width="60"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="坐席工号"
        prop="exteExtension"
        align="center">
      </el-table-column>
      <el-table-column label="姓名"
        prop="exteName"
        align="center">
      </el-table-column>
      <el-table-column label="坐席状态"
        prop="zxStateStr"
        align="center">
      </el-table-column>
      <el-table-column label="服务电话"
        prop="exteMobile"
        align="center">
      </el-table-column>
      <el-table-column label="今日拨打数量"
        prop="reserve2"
        align="center">
      </el-table-column>
      <el-table-column label="今日接听数量"
        prop="reserve1"
        align="center">
      </el-table-column>
      <el-table-column label="操作"
        align="center"
        width="210">
        <template slot-scope="scope">
          <el-button type="primary"
            size="mini"
            @click="handleDetail(scope.row)">监听</el-button>
          <el-button type="primary"
            size="mini"
            @click="handleDelete(scope.row)">强踢</el-button>
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
        <el-form-item label="坐席状态"
          prop="wdNum">
          <el-select class="filter-item"
            clearable
            v-model="form.wdNum"
            placeholder="请选择"
            style="width: 240px">
            <el-option v-for="item in options.gender"
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
  </div>
</template>

<script>
import { getRecordList, findByDicCode } from '@/api/page'
import { allApi } from '@/api/call'

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
      findByDicCode('zxStateStr').then(response => {
        this.options.gender = response.data.dataList
      })
    },
    handleQuery(currentPage, pageSize) {
      this.currentPage = 1
      if (currentPage) this.currentPage = currentPage
      const apiUrl = allApi.zuoxiRecord.getList
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
    handleDelete(row) {
      this.$confirm('您确认要结束正在进行的通话？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {})
    },
    handleDetail(row) {
      this.dialogStatus = 'detail'
      this.dialogFormVisible = true
      for (const key in this.form) {
        this.form[key] = row[key]
      }
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
