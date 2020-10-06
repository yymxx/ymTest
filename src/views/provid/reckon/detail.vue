<template>
  <div>
    <div class="edit-box">
      <el-card class="oldNotes">
        <div slot="header">
          <span>补贴管理 / 补贴对账</span>
        </div>
        <div class="filter-container">
          <el-button type="warning"
            icon="el-icon-edit"
            @click="handleOutExcel()">导出</el-button>
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
          <el-table-column label="订单人姓名"
            prop="reserve1"
            align="center">
          </el-table-column>
          <el-table-column label="持卡人姓名"
            prop="oldName"
            align="center">
          </el-table-column>
          <el-table-column label="身份证号"
            prop="cIdCard"
            align="center"
            width="180">
          </el-table-column>
          <el-table-column label="消费金额"
            prop="wdPrice"
            align="center">
          </el-table-column>
          <el-table-column label="现金消费金额"
            prop="reCharge"
            align="center">
          </el-table-column>
          <el-table-column label="卡支付金额"
            prop="reserve3"
            align="center">
          </el-table-column>
          <el-table-column label="补贴金额"
            prop="reserve4"
            align="center">
          </el-table-column>
          <el-table-column label="市财政补贴金额"
            prop="citySubsidy"
            align="center">
          </el-table-column>
          <el-table-column label="区财政补贴金额"
            prop="localSubsidy"
            align="center">
          </el-table-column>
          <el-table-column label="订单生成时间"
            prop="applyTime"
            align="center"
            width="160">
          </el-table-column>
          <el-table-column label="服务项目名称"
            prop="spName"
            align="center">
          </el-table-column>
          <el-table-column label="服务供应商名称"
            prop="reserve5"
            align="center"
            width="200">
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
        <div class="edit-btn">
          <el-button type="primary"
            @click="handleCancel">返 回</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getRecordList } from '@/api/page'
import { allApi } from '@/api/config'

const outObj = {
  reserve5: '服务供应商名称',
  oldName: '持卡人姓名',
  cIdCard: '持卡人身份证号',
  applyTime: '订单生成时间',
  citySubsidy: '市财政补贴金额',
  localSubsidy: '区财政补贴金额',
  reCharge: '现金消费金额',
  reserve1: '订单人姓名',
  reserve2: '服务项目类别',
  reserve3: '卡支付金额',
  reserve4: '补贴金额',
  sAddress: '消费地址',
  spName: '服务项目名称',
  wdPrice: '消费金额'
}

export default {
  name: 'olderDetail',
  data() {
    return {
      outObj,
      basicWidth: '1600px',
      timeQuerys: '',
      olderId: '',
      list: [],
      currentPage: 1,
      pageSize: 10,
      totalOlders: 30
    }
  },
  props: ['ownPath', 'rowData'],
  created() {
    this.olderId = this.$route.query.accId
    this.handleQuery(this.currentPage, this.pageSize)
  },
  methods: {
    handleQuery(currentPage, pageSize) {
      this.currentPage = 1
      if (currentPage) this.currentPage = currentPage
      const apiUrl = allApi.spreconciliation.accById
      getRecordList(apiUrl, {
        page: this.currentPage,
        pageSize: this.pageSize,
        id: this.olderId,
        month: this.timeQuerys
      }).then(response => {
        this.totalOlders = response.data.totalRecord
        this.list = response.data.dataList
        console.log(666, response)
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

          getRecordList(allApi.spreconciliation.accById, {
            page: 1,
            pageSize: 30,
            id: this.olderId
          }).then(response => {
            const kkk = response.data.dataList
            vendor.export_json_to_excel(
              tHeader,
              kkk.map(v => filterVal.map(j => v[j])),
              '补贴对账单明细'
            )
          })
        })
      })
    },
    handleCancel() {
      this.$emit('setGoback', false)
      this.$router.push({
        path: this.ownPath
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-box {
  text-align: left;
  .el-tabs /deep/ {
    .el-tabs__item {
      width: 194px;
      text-align: center;
    }

    .is-active {
      color: #fff;
      background-color: #00a1ea;
    }
  }

  .detailbox {
    padding-bottom: 30px;
    .el-form-item {
      margin-bottom: 10px;
      .detail {
        width: 240px;
        display: inline-block;
      }
    }
  }

  .avatar-box {
    min-width: 375px;
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
          height: 120px;
          vertical-align: top;
        }

        .cardImg-box {
          .avatar {
            height: 240px;
          }
        }
      }
    }
  }

  .avatar-user {
    float: right;
    width: 389px;
    height: 130px;
  }

  .group-box {
    width: 750px;
  }

  .el-radio-group /deep/ {
    .el-radio-button {
      margin-right: 10px;
      .el-radio-button__inner {
        border-left: 1px solid #dcdfe6;
      }

      .text {
        height: 26px;
        line-height: 26px;
      }
    }

    .is-active {
      .el-radio-button__inner {
        border-left-color: transparent;
      }
    }
  }

  .total {
    margin: 10px 0;
    label {
      display: inline-block;
    }

    .item {
      width: 135px;
      text-align: right;
      padding-right: 12px;
    }
  }

  .edit-btn {
    margin-top: 30px;
    text-align: center;
  }
}
</style>
