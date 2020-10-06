<template>
  <div class="main-container">
    <div class="filter-container">
      <el-button type="warning"
        icon="el-icon-edit"
        @click="handleOutExcel()">导出</el-button>
    </div>
    <el-table border
      :data="list"
      style="width: 100%;">
      <el-table-column label="老人姓名"
        :show-overflow-tooltip="true"
        prop="reserve1"
        align="center">
      </el-table-column>
      <el-table-column label="证件号码"
        :show-overflow-tooltip="true"
        prop="reserve2"
        align="center">
      </el-table-column>
      <el-table-column label="工单编号"
        :show-overflow-tooltip="true"
        prop="reserve3"
        align="center">
      </el-table-column>
      <el-table-column label="居住社区"
        :show-overflow-tooltip="true"
        prop="reserve4"
        align="center">
      </el-table-column>
      <el-table-column label="服务内容"
        :show-overflow-tooltip="true"
        prop="reserve5"
        align="center">
      </el-table-column>
      <el-table-column label="服务商"
        :show-overflow-tooltip="true"
        prop="memberName"
        align="center">
      </el-table-column>
      <el-table-column label="服务价格"
        :show-overflow-tooltip="true"
        prop="orderMoney"
        align="center">
      </el-table-column>
      <el-table-column label="市级补贴扣款金额"
        :show-overflow-tooltip="true"
        prop="cityMoney"
        align="center">
      </el-table-column>
      <el-table-column label="区级补贴扣款金额"
        :show-overflow-tooltip="true"
        prop="areaMoney"
        align="center">
      </el-table-column>
      <el-table-column label="个人自付"
        :show-overflow-tooltip="true"
        prop="congzhiMoney"
        align="center">
      </el-table-column>
      <el-table-column label="操作时间"
        :show-overflow-tooltip="true"
        prop="orderTime"
        align="center">
      </el-table-column>
    </el-table>
    <div style="text-align: center;padding-top: 20px;">
      <el-pagination background
        hide-on-single-page
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next"
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
  </div>
</template>

<script>
import { getRecordList, updateRecord, findByDicCode } from '@/api/page'
import { allApi } from '@/api/config'

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

const outObj = {
  reserve1: '老人姓名',
  reserve2: '证件号码',
  reserve3: '工单编号',
  reserve4: '居住社区',
  reserve5: '服务内容',
  memberName: '服务商',
  orderMoney: '服务价格',
  cityMoney: '市补贴扣款额',
  areaMoney: '区补贴扣款额',
  congzhiMoney: '个人自付',
  orderTime: '操作时间'
}

export default {
  name: 'accpayDetail',
  data() {
    return {
      outObj,
      list: [],
      btnPowers: null,
      updateImgUrl: allApi.updateImg,
      options: {
        gender: []
      },
      listQuery: {
        nickName: ''
      },
      mulSelection: [],
      currentPage: 1,
      pageSize: 5,
      totalOlders: 0,
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
  props: ['rowData'],
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
      const apiUrl = allApi.spreconciliation.detailList
      getRecordList(apiUrl, {
        page: this.currentPage,
        pageSize: this.pageSize,
        id: this.rowData.id
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
    handleOutExcel() {
      this.$confirm('此操作将导出excel文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        require.ensure([], () => {
          const vendor = require('@/vendor/Export2Excel')
          let tHeader = []
          let filterVal = []
          for (var key in this.outObj) {
            tHeader.push(this.outObj[key])
            filterVal.push(key)
          }

          getRecordList(allApi.spreconciliation.detailList, {
            page: 1,
            pageSize: 50,
            id: this.rowData.id
          }).then(response => {
            console.log(response)
            const kkk = response.data.dataList
            vendor.export_json_to_excel(
              tHeader,
              kkk.map(v => filterVal.map(j => v[j])),
              '供应商结算账单明细'
            )
          })
        })
      })
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
