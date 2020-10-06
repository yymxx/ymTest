<template>
  <div class="main-container">
    <div class="filter-container">
      <el-input class="filter-input"
        placeholder="请输入老人姓名"
        style="width: 280px;margin-right: 20px;"
        v-model="listQuery.oldName">
        <template slot="prepend">老人姓名</template>
      </el-input>
      <el-input class="filter-input"
        placeholder="请输入电话号码"
        style="width: 280px;margin-right: 20px;"
        v-model="listQuery.telephone">
        <template slot="prepend">电话号码</template>
      </el-input>
      <div class="select">
        <div class="type">
          来电类型
        </div>
        <el-select placeholder="请选择"
          v-model="listQuery.callType">
          <el-option v-for="item in options.wdState"
            :key="item.val"
            :label="item.dataKey"
            :value="item.val"></el-option>
        </el-select>
      </div>
      <el-button type="primary"
        icon="el-icon-search"
        @click="handleQuery()">查询</el-button>
    </div>
    <el-tabs type="card">
      <el-tab-pane label="呼入管理">
        <el-table border
          :data="inList"
          style="width: 100%;">
          <el-table-column width="60"
            align="center">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="老人姓名"
            prop="reserve1"
            align="center">
          </el-table-column>
          <el-table-column label="联系电话"
            prop="customer.telephone"
            align="center">
          </el-table-column>
          <el-table-column label="来电时间"
            prop="callTime"
            align="center">
          </el-table-column>
          <el-table-column label="接线分机"
            prop="zuoxiRecord.exteExtension"
            align="center">
          </el-table-column>
          <el-table-column label="接线坐席"
            prop="zuoxiRecord.exteName"
            align="center">
          </el-table-column>
          <el-table-column label="呼叫单号"
            prop="callNumber"
            align="center">
          </el-table-column>
          <el-table-column label="来电类型"
            prop="callTypeStr"
            align="center">
          </el-table-column>
          <el-table-column label="通话时长"
            prop="talkTime"
            align="center">
          </el-table-column>
          <el-table-column label="操作"
            align="center"
            width="150">
            <template slot-scope="scope">
              <el-button type="primary"
                size="mini"
                @click="handleInDetail(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align: center;padding-top: 20px;">
          <el-pagination background
            hide-on-single-page
            @size-change="handleInSize"
            @current-change="handleOneChange"
            :current-page.sync="currOnePage"
            :page-sizes="[10, 20]"
            :page-size="pageInSize"
            layout="total, prev, pager, next, sizes"
            :total="totalOneNotes"></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="呼出管理">
        <el-table border
          :data="outList"
          style="width: 100%;">
          <el-table-column width="60"
            align="center">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="老人姓名"
            prop="reserve3"
            align="center">
          </el-table-column>
          <el-table-column label="联系电话"
            prop="customer.telephone"
            align="center">
          </el-table-column>
          <el-table-column label="去电时间"
            prop="calloutTime"
            align="center">
          </el-table-column>
          <el-table-column label="接线分机"
            prop="reserve1"
            align="center">
          </el-table-column>
          <el-table-column label="接线坐席"
            prop="reserve2"
            align="center">
          </el-table-column>
          <el-table-column label="呼叫单号"
            prop="callNumber"
            align="center">
          </el-table-column>
          <el-table-column label="呼出类型"
            prop="calloutTypeStr"
            align="center">
          </el-table-column>
          <el-table-column label="通话时长"
            prop="talkTime"
            align="center">
          </el-table-column>
          <el-table-column label="操作"
            align="center"
            width="150">
            <template slot-scope="scope">
              <el-button type="primary"
                size="mini"
                @click="handleOutDetail(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align: center;padding-top: 20px;">
          <el-pagination background
            hide-on-single-page
            @size-change="handleOutSize"
            @current-change="handleTwoChange"
            :current-page.sync="currTwoPage"
            :page-sizes="[10, 20]"
            :page-size="pageOutSize"
            layout="total, prev, pager, next, sizes"
            :total="totalTwoNotes"></el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog width="900px"
      title="来电记录"
      :visible.sync="dialogIsTurn"
      @close="dialogTurnClose()"
      :close-on-click-modal="false">
      <shout-turn v-if="dialogIsTurn"
        :listRow="listHandlerRow"
        :callTotype="turnType"
        @setGoback="handleTurnback"></shout-turn>
    </el-dialog>
  </div>
</template>

<script>
import { getRecordList, findByDicCode } from '@/api/page'
import { allApi } from '@/api/call'
import shoutTurn from './turn'

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

export default {
  name: 'HelloWorld',
  components: {
    shoutTurn
  },
  data() {
    return {
      inList: [],
      outList: [],
      btnPowers: null,
      options: {
        wdState: []
      },
      listQuery: {
        oldName: '',
        telephone: '',
        callType: ''
      },
      pageInSize: 10,
      currOnePage: 1,
      totalOneNotes: 3,
      pageOutSize: 10,
      currTwoPage: 1,
      totalTwoNotes: 9,
      dialogIsTurn: false,
      listHandlerRow: null,
      turnType: '',
      form: { ...notes },
      rules: {
        dicKey: [
          {
            required: true,
            message: '请输入字典键',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.btnPowers = this.$route.meta.btnList
    console.log('btnPowers', this.btnPowers)

    this.findDicList()
    this.handleQuery(this.currOnePage, this.pageInSize, 'in')
    this.handleQuery(this.currTwoPage, this.pageOutSize, 'out')
  },
  methods: {
    findDicList() {
      findByDicCode('callType').then(response => {
        this.options.wdState = response.data.dataList
      })
    },
    handleQuery(currentPage, pageSize, mark) {
      this.currentPage = 1
      if (currentPage) this.currentPage = currentPage
      let apiUrl = allApi.callmanage.callIn
      if (mark === 'in') {
        getRecordList(apiUrl, {
          page: currentPage,
          pageSize: pageSize,
          oldName: this.listQuery.oldName,
          telephone: this.listQuery.telephone,
          callType: this.listQuery.callType
        }).then(response => {
          this.totalOneNotes = response.data.totalRecord
          this.inList = response.data.dataList
          console.log(121, response)
        })
      } else if (mark === 'out') {
        apiUrl = allApi.callmanage.callOut
        getRecordList(apiUrl, {
          page: currentPage,
          pageSize: pageSize,
          oldName: this.listQuery.oldName,
          telephone: this.listQuery.telephone,
          callType: this.listQuery.callType
        }).then(response => {
          this.totalTwoNotes = response.data.totalRecord
          this.outList = response.data.dataList
          console.log(121, response)
        })
      } else {
        getRecordList(allApi.callmanage.callIn, {
          page: this.currOnePage,
          pageSize: this.pageInSize,
          oldName: this.listQuery.oldName,
          telephone: this.listQuery.telephone,
          callType: this.listQuery.callType
        }).then(response => {
          this.totalOneNotes = response.data.totalRecord
          this.inList = response.data.dataList
        })

        getRecordList(allApi.callmanage.callOut, {
          page: this.currTwoPage,
          pageSize: this.pageOutSize,
          oldName: this.listQuery.oldName,
          telephone: this.listQuery.telephone,
          callType: this.listQuery.callType
        }).then(response => {
          this.totalTwoNotes = response.data.totalRecord
          this.outList = response.data.dataList
        })
      }
    },
    handleInSize(val) {
      this.currOnePage = 1
      this.pageInSize = val
      this.handleQuery(this.currOnePage, val, 'in')
    },
    handleOneChange(val) {
      this.handleQuery(val, this.pageInSize, 'in')
    },
    handleOutSize(val) {
      this.currTwoPage = 1
      this.pageOutSize = val
      this.handleQuery(this.currTwoPage, val, 'out')
    },
    handleTwoChange(val) {
      this.handleQuery(val, this.pageOutSize, 'out')
    },
    handleInDetail(row) {
      this.dialogIsTurn = true
      this.listHandlerRow = row
      this.turnType = 'in'
    },
    handleOutDetail(row) {
      this.dialogIsTurn = true
      this.listHandlerRow = row
      this.turnType = 'out'
    },
    handleTurnback() {
      this.dialogIsTurn = false
    },
    dialogTurnClose() {
      this.dialogIsTurn = false
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tabs /deep/ {
  .el-tabs__item {
    width: 200px;
    text-align: center;
  }

  .is-active {
    color: #fff;
    background-color: #00a1ea;
  }
}
</style>
