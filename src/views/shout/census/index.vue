<template>
  <div class="main-container">
    <div class="filter-container">
      <el-input class="filter-input"
        placeholder="请输入坐席号"
        style="width: 280px;margin-right: 20px;"
        v-model="listQuery.nickName">
        <template slot="prepend">坐席号</template>
      </el-input>
      <div class="time-editor">
        <div class="type">日期</div>
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
      style="width: 100%;">
      <el-table-column width="60"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="坐席号"
        prop="seatsNo"
        align="center">
      </el-table-column>
      <el-table-column label="坐席名称"
        prop="seatsName"
        align="center">
      </el-table-column>
      <el-table-column label="日期"
        prop="callDate"
        align="center">
      </el-table-column>
      <el-table-column label="呼入（分钟）"
        align="center">
        <el-table-column label="平均时长"
          prop="callAvgTime"
          align="center">
        </el-table-column>
        <el-table-column label="次数"
          prop="callNum"
          align="center">
        </el-table-column>
        <el-table-column label="接通率"
          prop="callRate"
          align="center">
        </el-table-column>
        <el-table-column label="时长"
          prop="callTime"
          align="center">
        </el-table-column>
      </el-table-column>
      <el-table-column label="呼出（分钟）"
        align="center">
        <el-table-column label="平均时长"
          prop="breatheAvgTime"
          align="center">
        </el-table-column>
        <el-table-column label="次数"
          prop="breatheNum"
          align="center">
        </el-table-column>
        <el-table-column label="接通率"
          prop="breatheRate"
          align="center">
        </el-table-column>
        <el-table-column label="时长"
          prop="breatheTime"
          align="center">
        </el-table-column>
      </el-table-column>
      <el-table-column label="平均时长"
        prop="averageTime"
        align="center">
      </el-table-column>
      <el-table-column label="合计次数"
        prop="combinedNum"
        align="center">
      </el-table-column>
      <el-table-column label="接通率"
        prop="connectionRate"
        align="center">
      </el-table-column>
      <el-table-column label="合计总时长"
        prop="combinedTime"
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
        <el-form-item label="经营类型"
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
        <el-form-item label="名称"
          prop="wdNum">
          <el-input v-model="form.wdNum"
            placeholder="请输入名称"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="补贴比例"
          prop="wdNum">
          <el-input type="number"
            v-model="form.wdNum"
            @keyup.native="handNumChange"
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
      timeQuerys: [],
      options: {
        gender: []
      },
      listQuery: {
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
      if (this.timeQuerys.length > 0) {
        getRecordList(allApi.statisByTime, {
          page: this.currentPage,
          pageSize: this.pageSize,
          seatsNo: this.listQuery.nickName,
          beginDate: this.timeQuerys[0],
          endDate: this.timeQuerys[1]
        }).then(response => {
          this.totalOlders = response.data.totalRecord
          this.list = response.data.dataList
        })
      } else {
        getRecordList(allApi.statis, {
          page: this.currentPage,
          pageSize: this.pageSize,
          seatsNo: this.listQuery.nickName
        }).then(response => {
          this.totalOlders = response.data.totalRecord
          this.list = response.data.dataList
        })
      }
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
