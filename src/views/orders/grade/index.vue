<template>
  <div class="main-container">
    <div class="filter-container">
      <el-input class="filter-input"
        placeholder="请输入工单编号"
        style="width: 320px;margin-right: 20px;"
        v-model="listQuery.wdNum">
        <template slot="prepend">工单编号</template>
      </el-input>
      <el-input class="filter-input"
        placeholder="请输入服务商家"
        style="width: 320px;margin-right: 20px;"
        v-model="listQuery.nickName">
        <template slot="prepend">服务商家</template>
      </el-input>
      <el-button type="primary"
        icon="el-icon-search"
        @click="handleQuery()">查询</el-button>
    </div>
    <el-table border
      :data="list"
      style="width: 100%;">
      <el-table-column width="60"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="老人姓名"
        :show-overflow-tooltip="true"
        prop="customer.oldName"
        align="center">
      </el-table-column>
      <el-table-column label="联系电话"
        :show-overflow-tooltip="true"
        prop="customer.telephone"
        align="center">
      </el-table-column>
      <el-table-column label="电话录音"
        :show-overflow-tooltip="true"
        prop="wdmarks"
        align="center">
      </el-table-column>
      <el-table-column label="回访时间"
        :show-overflow-tooltip="true"
        prop="returnvisit.rvTime"
        align="center">
      </el-table-column>
      <el-table-column label="评级星级"
        :show-overflow-tooltip="true"
        prop="returnvisit.rvSatisfaction"
        align="center">
      </el-table-column>
      <el-table-column label="评价内容"
        :show-overflow-tooltip="true"
        prop="returnvisit.rvContent"
        align="center">
      </el-table-column>
      <el-table-column label="服务地址"
        :show-overflow-tooltip="true"
        prop="sAddress"
        align="center"
        width="240">
      </el-table-column>
      <el-table-column label="服务项目"
        :show-overflow-tooltip="true"
        prop="spContent"
        align="center">
      </el-table-column>
      <el-table-column label="服务人员"
        :show-overflow-tooltip="true"
        prop="helpelderly.heName"
        align="center">
      </el-table-column>
      <el-table-column label="服务站/商家"
        :show-overflow-tooltip="true"
        prop="servicestation.ssName"
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
  </div>
</template>

<script>
import { getRecordList, findByDicCode } from '@/api/page'
import { allApi } from '@/api/config'
import { mapGetters } from 'vuex'

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
        wdNum: '',
        nickName: ''
      },
      currentPage: 1,
      pageSize: 10,
      totalOlders: 30,
      isReadonly: false,
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
  computed: {
    ...mapGetters(['sysUser'])
  },
  created() {
    this.btnPowers = this.$route.meta.btnList
    console.log('btnPowers', this.btnPowers)

    this.findDicList()
    this.handleQuery(this.currentPage, this.pageSize)
  },
  methods: {
    findDicList() {
      findByDicCode('sex').then(response => {
        this.options.gender = response.data.dataList
      })
    },
    handleQuery(currentPage, pageSize) {
      this.currentPage = 1
      if (currentPage) this.currentPage = currentPage
      const apiUrl = allApi.workorder.grade
      getRecordList(apiUrl, {
        page: this.currentPage,
        pageSize: this.pageSize,
        create_user: this.sysUser.id,
        roleId: this.sysUser.roleId,
        organizationId: this.sysUser.institutionsId,
        wdNum: this.listQuery.wdNum,
        reserve1: this.listQuery.nickName
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
    handleDetail(row) {
      this.dialogStatus = 'detail'
      this.dialogFormVisible = true
      this.isReadonly = true
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
