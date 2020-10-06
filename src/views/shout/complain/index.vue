<template>
  <div class="main-container">
    <div class="filter-container">
      <el-input class="filter-input"
        placeholder="请输入来电号码"
        style="width: 280px;margin-right: 20px;"
        v-model="listQuery.nickName">
        <template slot="prepend">来电号码</template>
      </el-input>
      <el-button type="primary"
        icon="el-icon-search"
        @click="handleQuery()">查询</el-button>
    </div>
    <el-table border
      :data="list"
      style="width: 100%;">
      <el-table-column type="selection"
        align="center"
        width="70">
      </el-table-column>
      <el-table-column label="投诉人"
        prop="reserve1"
        align="center">
      </el-table-column>
      <el-table-column label="联系电话"
        prop="customer.telephone"
        align="center">
      </el-table-column>
      <el-table-column label="接线分机"
        prop="reserve2"
        align="center">
      </el-table-column>
      <el-table-column label="接线坐席"
        prop="reserve3"
        align="center">
      </el-table-column>
      <el-table-column label="来电时间"
        prop="reserve4"
        align="center">
      </el-table-column>
      <el-table-column label="投诉类型"
        prop="cpTypeStr"
        align="center">
      </el-table-column>
      <el-table-column label="处理状态"
        prop="handleTypeStr"
        align="center">
      </el-table-column>
      <el-table-column label="操作"
        align="center"
        width="150">
        <template slot-scope="scope">
          <el-button v-if="scope.row.handleType==0"
            type="warning"
            size="mini"
            @click="handleUpdate(scope.row)">处理</el-button>
          <el-button v-else
            type="primary"
            size="mini"
            @click="handleDetail(scope.row)">查看</el-button>
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
        <shout-turn v-if="dialogFormVisible"
          :listRow="listHandlerRow"></shout-turn>
        <el-form-item v-if="listHandlerRow.handleType==0"
          label="关联工单"
          prop="woid"
          style="margin-bottom: 0;">
          <el-input v-model="form.ssIdName"
            placeholder="请输入关联工单"
            @focus="handleOlder"
            style="width: 240px;"></el-input>
        </el-form-item>
        <el-form-item v-if="listHandlerRow.handleType==0"
          label="工单状态"
          class="turn-box">
          <label class="detail">{{ form.wdState }}</label>
        </el-form-item>
        <el-form-item v-if="listHandlerRow.handleType==0"
          label="服务商家"
          class="turn-box">
          <label class="detail">{{ form.ssName }}</label>
        </el-form-item>
        <el-form-item v-if="listHandlerRow.handleType==0"
          label="服务项目"
          class="turn-box">
          <label class="detail">{{ form.spContent }}</label>
        </el-form-item>
        <el-form-item v-if="listHandlerRow.handleType==0"
          label="助老员"
          class="turn-box">
          <label class="detail">{{ form.heName }}</label>
        </el-form-item>
        <el-form-item v-if="listHandlerRow.handleType==0"
          label="服务时间"
          class="turn-box">
          <label class="detail">{{ form.applyTime }}</label>
        </el-form-item>
        <el-form-item v-if="listHandlerRow.handleType==0"
          label="处理结果"
          prop="handleResult"
          style="margin: 30px 0 0;">
          <el-input type="textarea"
            v-model="form.handleResult"
            placeholder="请输入处理结果"
            style="width: 520px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='update'"
          type="primary"
          @click="update('form')">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog width="960px"
      title="选择关联工单"
      :visible.sync="dialogOldShow"
      @close="dialogOldClose()"
      :close-on-click-modal="false">
      <choose-options v-if="dialogOldShow"
        :data="form.reserve1"
        @setGoback="handleOldback"></choose-options>
    </el-dialog>
  </div>
</template>

<script>
import { getRecordList, updateRecord, findByDicCode } from '@/api/page'
import { allApi } from '@/api/call'
import shoutTurn from './turn'
import chooseOptions from './choose'

const notes = {
  id: null,
  woid: '',
  ssIdName: '',
  handleResult: '',
  wdState: '',
  ssName: '',
  spContent: '',
  heName: '',
  applyTime: ''
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
    shoutTurn,
    chooseOptions
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
      currentPage: 1,
      pageSize: 10,
      totalOlders: 30,
      isReadonly: false,
      dialogOldShow: false,
      listHandlerRow: {
        handleType: ''
      },
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
      const apiUrl = allApi.complaint.getList
      getRecordList(apiUrl, {
        page: this.currentPage,
        pageSize: this.pageSize,
        telephone: this.listQuery.nickName
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
    handleUpdate(row) {
      console.log(row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.isReadonly = false
      this.listHandlerRow = row
      for (const key in this.form) {
        this.form[key] = row[key]
      }
    },
    update(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          const apiUrl = allApi.complaint.updateData
          updateRecord(apiUrl, {
            id: this.form.id,
            woid: this.form.woid,
            ssIdName: this.form.ssIdName,
            handleResult: this.form.handleResult
          }).then(res => {
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
    handleDetail(row) {
      console.log(row)
      this.dialogStatus = 'detail'
      this.dialogFormVisible = true
      this.isReadonly = true
      this.listHandlerRow = row
      for (const key in this.form) {
        this.form[key] = row[key]
      }
    },
    handleOlder() {
      this.dialogOldShow = true
    },
    handleOldback(data) {
      console.log(data)
      this.form.woid = data.id
      this.form.ssIdName = data.wdNum
      this.form.wdState = data.reserve3
      this.form.ssName = data.servicestation.ssName
      this.form.spContent = data.spContent
      this.form.heName = data.helpelderly.heName
      this.form.applyTime = data.applyTime
      this.dialogOldShow = false
    },
    dialogOldClose() {
      this.dialogOldShow = false
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
.turn-box /deep/ {
  margin-bottom: 0;
  .detail {
    width: 240px;
    display: inline-block;
    font-weight: normal;
  }
}
</style>
