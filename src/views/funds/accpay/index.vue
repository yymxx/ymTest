<template>
  <div class="main-container">
    <div class="filter-container">
      <div class="time-editor">
        <div class="type">
          结算周期
        </div>
        <el-date-picker v-model="timeQuerys"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <el-input class="filter-input"
        placeholder="请输入服务商名称"
        style="width: 280px;margin-right: 20px;"
        v-model="listQuery.nickName">
        <template slot="prepend">服务商名称</template>
      </el-input>
      <el-button type="primary"
        icon="el-icon-search"
        @click="handleQuery()">查询</el-button>
    </div>
    <el-table border
      :data="list"
      style="width: 100%;">
      <el-table-column label="服务商名称"
        prop="memberName"
        align="center"
        width="300">
      </el-table-column>
      <el-table-column label="结算周期"
        prop="orderTime"
        align="center">
      </el-table-column>
      <el-table-column label="工单总数"
        prop="orderState"
        align="center">
      </el-table-column>
      <el-table-column label="工单总额"
        prop="orderMoney"
        align="center">
      </el-table-column>
      <el-table-column label="市补贴总额"
        prop="cityMoney"
        align="center">
      </el-table-column>
      <el-table-column label="区补贴总额"
        prop="areaMoney"
        align="center">
      </el-table-column>
      <el-table-column label="充值付款总额"
        prop="congzhiMoney"
        align="center">
      </el-table-column>
      <el-table-column label="操作"
        align="center"
        width="180">
        <template slot-scope="scope">
          <!-- <el-button type="primary"
            size="mini"
            @click="handleUpdate(scope.row)">结算</el-button> -->
          <el-button type="primary"
            size="mini"
            @click="handleDetail(scope.row)">账单明细</el-button>
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
        <el-form-item label="供应商名称"
          prop="wdRemarks">
          <label class="detail">{{ form.reserve2 }}</label>
        </el-form-item>
        <el-form-item label="联系人"
          prop="wdRemarks">
          <label class="detail">{{ form.reserve2 }}</label>
        </el-form-item>
        <el-form-item label="联系电话"
          prop="wdRemarks">
          <label class="detail">{{ form.reserve2 }}</label>
        </el-form-item>
        <el-form-item label="未结算金额"
          prop="wdRemarks">
          <label class="detail">{{ form.reserve2 }}</label>
        </el-form-item>
        <el-form-item label="本期结算金额"
          prop="wdNum">
          <el-input type="number"
            v-model="form.wdNum"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="可结算金额"
          prop="wdRemarks">
          <label class="detail">{{ form.reserve2 }}</label>
        </el-form-item>
        <el-form-item label="备注"
          prop="wdNum">
          <el-input type="textarea"
            v-model="form.wdNum"
            placeholder="请输入备注"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <span class="avatar-box">
          <el-form-item label="照片">
            <el-upload class="avatar-uploader"
              :action="updateImgUrl"
              accept="image/*"
              :show-file-list="false"
              :on-success="handleAvatar">
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div v-if="form.license"
              class="avatar-uploader">
              <img :src="form.license"
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

    <el-dialog width="1200px"
      title="账单明细"
      :visible.sync="dialogDetailShow"
      :close-on-click-modal="false">
      <accpay-detail v-if="dialogDetailShow"
        :row-data="listHandlerRow"></accpay-detail>
    </el-dialog>
  </div>
</template>

<script>
import { getRecordList, updateRecord, findByDicCode } from '@/api/page'
import { allApi } from '@/api/config'
import accpayDetail from './detaile'

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
    accpayDetail
  },
  data() {
    return {
      list,
      btnPowers: null,
      updateImgUrl: allApi.updateImg,
      timeQuerys: [],
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
      isReadonly: false,
      dialogDetailShow: false,
      listHandlerRow: null,
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
    handleAvatar(res, file) {
      console.log(file)
      this.form.olderImg = res.imgUrl
    },
    handleQuery(currentPage, pageSize) {
      this.currentPage = 1
      if (currentPage) this.currentPage = currentPage
      const apiUrl = allApi.spreconciliation.getList
      getRecordList(apiUrl, {
        page: this.currentPage,
        pageSize: this.pageSize,
        reserve1: this.timeQuerys[0],
        reserve2: this.timeQuerys[1],
        memberName: this.listQuery.nickName
      }).then(response => {
        this.totalOlders = response.data.totalRecord
        this.list = response.data.dataList
        console.log(this.list)
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
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.isReadonly = false
      for (const key in this.form) {
        this.form[key] = row[key]
      }
    },
    update(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          const apiUrl = allApi.spreconciliation.updateData
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
    handleDetail(row) {
      this.listHandlerRow = row
      this.dialogDetailShow = true
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
.el-form {
  .el-form-item {
    .detail {
      width: 240px;
      display: inline-block;
      font-weight: normal;
    }
  }
}

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
