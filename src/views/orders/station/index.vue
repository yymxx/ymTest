<template>
  <div class="main-container">
    <div class="filter-container"
      style="width: 1200px;">
      <div class="time-editor">
        <div class="type">
          下单时间
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
        placeholder="请输入工单编号"
        style="width: 280px;margin-right: 20px;"
        v-model="listQuery.wdNum">
        <template slot="prepend">工单编号</template>
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
      <el-table-column label="下单时间"
        :show-overflow-tooltip="true"
        prop="applyTime"
        align="center"
        width="200">
      </el-table-column>
      <el-table-column label="下单渠道"
        :show-overflow-tooltip="true"
        prop="reserve1"
        align="center">
      </el-table-column>
      <el-table-column label="下单人"
        :show-overflow-tooltip="true"
        prop="reserve2"
        align="center">
      </el-table-column>
      <el-table-column label="工单编号"
        :show-overflow-tooltip="true"
        prop="wdNum"
        align="center">
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
      <el-table-column label="服务项目"
        :show-overflow-tooltip="true"
        prop="spContent"
        align="center">
      </el-table-column>
      <el-table-column label="服务金额"
        :show-overflow-tooltip="true"
        prop="wdPrice"
        align="center">
      </el-table-column>
      <el-table-column label="服务站/商家"
        :show-overflow-tooltip="true"
        prop="servicestation.ssName"
        align="center">
      </el-table-column>
      <el-table-column label="工单状态"
        :show-overflow-tooltip="true"
        prop="reserve3"
        align="center">
      </el-table-column>
      <el-table-column label="操作"
        align="center"
        width="320">
        <template slot-scope="scope">
          <div class="btnbox">
            <el-button v-if="scope.row.wdState==1"
              type="primary"
              size="mini"
              @click="handleAssign(scope.row)">派单</el-button>
            <el-button v-if="scope.row.wdState==2"
              type="primary"
              size="mini"
              @click="handleRebook(scope.row)">改派</el-button>
            <el-button v-if="scope.row.wdState==1||scope.row.wdState==2"
              type="danger"
              size="mini"
              @click="handleCancel(scope.row)">取消</el-button>
            <el-button v-if="scope.row.wdState==2"
              type="warning"
              size="mini"
              @click="handleSignIn(scope.row)">签入</el-button>
            <el-button v-if="scope.row.wdState==3"
              type="warning"
              size="mini"
              @click="handleSignOut(scope.row)">签出</el-button>
            <el-button v-if="scope.row.wdState==4"
              type="primary"
              size="mini"
              @click="handleVisit(scope.row)">回访</el-button>
          </div>
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

    <el-dialog title="取消工单"
      @close="clearFormValidate('form')"
      :visible.sync="dialogCancelVisible"
      width="600px">
      <el-form :inline="true"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="110px">
        <el-form-item label="老人姓名">
          <span>{{ form.oldName }}</span>
        </el-form-item>
        <el-form-item label="工单编号">
          <span>{{ form.wdNum }}</span>
        </el-form-item>
        <el-form-item label="取消类型"
          prop="exitClass">
          <el-select class="filter-item"
            clearable
            v-model="form.exitClass"
            placeholder="请选择"
            style="width: 240px">
            <el-option v-for="item in options.exitClass"
              :key="item.val"
              :label="item.dataKey"
              :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否退费"
          prop="isExitFree">
          <el-select class="filter-item"
            clearable
            v-model="form.isExitFree"
            placeholder="请选择"
            style="width: 240px">
            <el-option v-for="item in options.gender"
              :key="item.val"
              :label="item.dataKey"
              :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="取消原因"
          prop="exitRemarks">
          <el-input type="textarea"
            :rows="3"
            v-model="form.exitRemarks"
            placeholder="请输入取消原因"
            style="width: 240px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button type="primary"
          @click="update('form')">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="回访服务"
      @close="clearFormValidate('form')"
      :visible.sync="dialogVisitVisible"
      width="600px">
      <el-form :inline="true"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="110px">
        <el-form-item label="老人姓名">
          <span>{{ form.oldName }}</span>
        </el-form-item>
        <el-form-item label="工单编号">
          <span>{{ form.wdNum }}</span>
        </el-form-item>
        <el-form-item label="回访方式"
          prop="exitClass">
          <el-select class="filter-item"
            clearable
            v-model="form.exitClass"
            placeholder="请选择"
            style="width: 240px">
            <el-option v-for="item in options.visit"
              :key="item.val"
              :label="item.dataKey"
              :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务评分"
          prop="isExitFree">
          <span class="filter-rate">
            <el-rate v-model="score"
              show-text></el-rate>
          </span>
        </el-form-item>
        <el-form-item label="回访记录"
          prop="exitRemarks">
          <el-input type="textarea"
            :rows="3"
            v-model="form.exitRemarks"
            placeholder="请输入回访记录"
            style="width: 240px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button type="primary"
          @click="update('form')">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="派单"
      @close="clearFormValidate('form')"
      :visible.sync="dialogAssignVisible"
      width="960px">
      <el-form :inline="true"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="110px">
        <el-form-item label="老人姓名">
          <span>{{ form.oldName }}</span>
        </el-form-item>
        <el-form-item label="工单编号">
          <span>{{ form.wdNum }}</span>
        </el-form-item>
        <el-form-item label="助老员"
          prop="suId">
          <el-radio-group v-model="form.suId">
            <div class="groupbox"
              v-for="(item, index) in helpeList"
              :key="index">
              <el-radio :label="item.id">
                {{item.heName}}-{{item.hePhone}}
              </el-radio>
            </div>
            <div style="clear: both;"></div>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button type="primary"
          @click="update('form')">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="签入"
      @close="clearFormValidate('form')"
      :visible.sync="dialogInVisible"
      width="600px">
      <el-form :inline="true"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="110px">
        <el-form-item label="老人姓名">
          <span>{{ form.oldName }}</span>
        </el-form-item>
        <el-form-item label="工单编号">
          <span>{{ form.wdNum }}</span>
        </el-form-item>
        <el-form-item label="代签时间"
          prop="actualStartTime">
          <el-date-picker type="datetime"
            v-model="form.actualStartTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
            style="width: 240px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="代签地址"
          prop="signInAddress">
          <el-input type="textarea"
            v-model="form.signInAddress"
            placeholder="请输入服务地址"
            style="width: 240px;"></el-input>
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
        <el-button type="primary"
          @click="update('form')">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="签出"
      @close="clearFormValidate('form')"
      :visible.sync="dialogOutVisible"
      width="980px">
      <el-form :inline="true"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="110px">
        <el-form-item label="老人姓名">
          <span>{{ form.oldName }}</span>
        </el-form-item>
        <el-form-item label="工单编号">
          <span>{{ form.wdNum }}</span>
        </el-form-item>
        <div></div>
        <el-form-item label="签到时间"
          prop="actualEndTime">
          <el-date-picker type="datetime"
            :picker-options="pickerOptions"
            v-model="form.actualEndTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
            style="width: 240px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="签出地址"
          prop="signOutAddress">
          <el-input type="textarea"
            v-model="form.signOutAddress"
            placeholder="请输入签出地址"
            style="width: 240px;"></el-input>
          <span class="seat-map"
            @click="handleAddress()">
            <svg-icon icon-class="seat"></svg-icon>
            <span>选择地址</span>
          </span>
        </el-form-item>
        <el-form-item label="服务报告"
          prop="serviceReport">
          <el-input type="textarea"
            v-model="form.serviceReport"
            placeholder="请输入服务报告"
            style="width: 730px;"></el-input>
        </el-form-item>
        <span class="avatar-box">
          <el-form-item label="报告图片">
            <el-upload class="avatar-uploader"
              :action="updateImgUrl"
              accept="image/*"
              :show-file-list="false"
              :on-success="handleAvatarO">
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div v-if="form.reportPhotoO"
              class="avatar-uploader">
              <img :src="form.reportPhotoO"
                class="avatar">
            </div>
          </el-form-item>
        </span>
        <span class="avatar-box">
          <el-form-item label="报告图片">
            <el-upload class="avatar-uploader"
              :action="updateImgUrl"
              accept="image/*"
              :show-file-list="false"
              :on-success="handleAvatarT">
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div v-if="form.reportPhotoT"
              class="avatar-uploader">
              <img :src="form.reportPhotoT"
                class="avatar">
            </div>
          </el-form-item>
        </span>
        <span class="avatar-box">
          <el-form-item label="报告图片">
            <el-upload class="avatar-uploader"
              :action="updateImgUrl"
              accept="image/*"
              :show-file-list="false"
              :on-success="handleAvatarR">
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div v-if="form.reportPhotoR"
              class="avatar-uploader">
              <img :src="form.reportPhotoR"
                class="avatar">
            </div>
          </el-form-item>
        </span>
      </el-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button type="primary"
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
import { getRecordList, updateRecord, findByDicCode } from '@/api/page'
import { allApi } from '@/api/config'
import gouldMap from '@/components/GouldMap'
import { mapGetters } from 'vuex'

const notes = {
  id: null,
  wdNum: '',
  oldName: '',
  suId: '',
  exitClass: '',
  isExitFree: '',
  exitRemarks: '',
  applyTime: '',
  signInAddress: '',
  actualStartTime: '',
  signOutAddress: '',
  actualEndTime: '',
  serviceReport: '',
  reportPhotoO: '',
  reportPhotoT: '',
  reportPhotoR: '',
  create_user: ''
}

const list = [
  {
    id: '1'
  },
  {
    id: '2'
  }
]

const helpeList = [
  {
    id: '1',
    heName: '小明'
  },
  {
    id: '2',
    heName: '小敏'
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
      updateImgUrl: allApi.updateImg,
      helpeList,
      listQuar: [],
      stationTree: [],
      options: {
        gender: [],
        wdState: [],
        exitClass: [],
        visit: []
      },
      timeQuerys: [],
      listQuery: {
        nickName: '',
        wdNum: ''
      },
      currentPage: 1,
      pageSize: 10,
      totalOlders: 30,
      listHandlerRow: null,
      dialogIsDetail: false,
      dialogMapShow: false,
      isReadonly: false,
      score: 0,
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
      dialogAssignVisible: false,
      dialogCancelVisible: false,
      dialogVisitVisible: false,
      dialogInVisible: false,
      dialogOutVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建',
        detail: '详情'
      }
    }
  },
  computed: {
    ...mapGetters(['sysUser']),
    pickerOptions() {
      const plan = this.form.actualStartTime
      return {
        disabledDate(time) {
          if (plan) return time.getTime() < new Date(plan).getTime()
        }
      }
    }
  },
  created() {
    this.btnPowers = this.$route.meta.btnList
    console.log('btnPowers', this.btnPowers)

    this.findDicList()
    this.handleQuery(this.currentPage, this.pageSize)
    const apiUrl = allApi.orderrecord.station
    getRecordList(apiUrl, {
      spState: 3
    }).then(response => {
      this.stationTree = response.data
    })
  },
  methods: {
    findDicList() {
      findByDicCode('basicYesNo').then(response => {
        this.options.gender = response.data.dataList
        console.log('dic', this.options.gender)
      })

      findByDicCode('wdState').then(response => {
        this.options.wdState = response.data.dataList
      })

      findByDicCode('exitClass').then(response => {
        this.options.exitClass = response.data.dataList
      })

      findByDicCode('visitClass').then(response => {
        this.options.visit = response.data.dataList
      })
    },
    handleCader() {
      this.listQuery.spId = this.listQuar[0]
      this.listQuery.stId = this.listQuar[1]
    },
    handleAvatarO(res, file) {
      this.form.reportPhotoO = res.imgUrl
    },
    handleAvatarT(res, file) {
      this.form.reportPhotoT = res.imgUrl
    },
    handleAvatarR(res, file) {
      this.form.reportPhotoR = res.imgUrl
    },
    handleQuery(currentPage, pageSize) {
      this.currentPage = 1
      if (currentPage) this.currentPage = currentPage
      const apiUrl = allApi.workorder.patchList
      getRecordList(apiUrl, {
        page: this.currentPage,
        pageSize: this.pageSize,
        reserve2: this.timeQuerys[0],
        reserve3: this.timeQuerys[1],
        wdNum: this.listQuery.wdNum,
        create_user: this.sysUser.id,
        organizationId: this.sysUser.institutionsId
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
    update(formName) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      this.form.create_user = this.sysUser.id
      this.$refs[formName].validate(valid => {
        if (valid) {
          let apiUrl = ''
          switch (this.dialogStatus) {
            case 'cancel':
              apiUrl = allApi.workorder.callOff
              this.dialogCancelVisible = false
              break
            case 'visit':
              apiUrl = allApi.workorder.visit
              this.dialogVisitVisible = false
              this.form.isExitFree = this.score
              break
            case 'signIn':
              apiUrl = allApi.workorder.signIn
              this.dialogInVisible = false
              break
            case 'signOut':
              apiUrl = allApi.workorder.signOut
              this.dialogOutVisible = false
              break
            case 'rebook':
              apiUrl = allApi.workorder.reform
              this.dialogAssignVisible = false
              break
            default:
              apiUrl = allApi.workorder.patch
              this.dialogAssignVisible = false
          }

          // this.form.suId = this.helpelder.join()
          updateRecord(apiUrl, this.form).then(res => {
            console.log(res)
            loading.close()
            if (res.data === 1) {
              this.handleQuery(this.currentPage, this.pageSize)
              this.$notify({
                title: '成功',
                message: '操作成功',
                type: 'success',
                duration: 2000
              })
            }

            if (res.msg !== '') {
              this.$message({
                type: 'warning',
                message: res.msg
              })
            }
          })
        } else {
          return false
        }
      })
    },
    handleAssign(row) {
      getRecordList('/web/helpelderly/findHelpelderlyByssId.htm', {
        id: row.stId
      }).then(response => {
        this.helpeList = response.data
        console.log('helpeList', response)
      })

      this.dialogAssignVisible = true
      this.dialogStatus = 'assign'
      this.form = { ...notes }
      row.oldName = row.customer.oldName
      for (const key in this.form) {
        this.form[key] = row[key]
      }
    },
    handleRebook(row) {
      console.log(row)
      getRecordList('/web/helpelderly/findHelpelderlyByssId.htm', {
        id: row.stId
      }).then(response => {
        this.helpeList = response.data
      })

      this.dialogAssignVisible = true
      this.dialogStatus = 'rebook'
      this.form = { ...notes }
      row.oldName = row.customer.oldName
      for (const key in this.form) {
        this.form[key] = row[key]
      }
    },
    handleCancel(row) {
      this.dialogCancelVisible = true
      this.dialogStatus = 'cancel'
      this.form = { ...notes }
      row.oldName = row.customer.oldName
      for (const key in this.form) {
        this.form[key] = row[key]
      }
    },
    handleVisit(row) {
      this.dialogVisitVisible = true
      this.dialogStatus = 'visit'
      this.form = { ...notes }
      row.oldName = row.customer.oldName
      for (const key in this.form) {
        this.form[key] = row[key]
      }

      this.form.exitClass = 1
    },
    handleSignIn(row) {
      this.dialogInVisible = true
      this.dialogStatus = 'signIn'
      this.form = { ...notes }
      row.oldName = row.customer.oldName
      for (const key in this.form) {
        this.form[key] = row[key]
      }
    },
    handleSignOut(row) {
      console.log(row)
      this.dialogOutVisible = true
      this.dialogStatus = 'signOut'
      this.form = { ...notes }
      row.oldName = row.customer.oldName
      for (const key in this.form) {
        this.form[key] = row[key]
      }
    },
    handleAddress() {
      this.dialogMapShow = true
    },
    handleMapback(data) {
      this.dialogMapShow = false
      if (this.dialogStatus === 'signIn') {
        this.form.signInAddress = data.address
      }

      if (this.dialogStatus === 'signOut') {
        this.form.signOutAddress = data.address
      }
    },
    dialogMapClose() {
      this.dialogMapShow = false
    },
    cancel(formName) {
      this.dialogAssignVisible = false
      this.dialogCancelVisible = false
      this.dialogVisitVisible = false
      this.dialogInVisible = false
      this.dialogOutVisible = false
    },
    clearFormValidate(formName) {
      this.$refs[formName].clearValidate()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-radio-group {
  width: 750px;
  max-height: 300px;
  overflow-y: auto;
  .groupbox {
    float: left;
    width: 185px;
    height: 40px;
    padding-top: 12px;
  }
}

.btnbox {
  .el-button {
    &:nth-child(3n + 1) {
      margin-left: 0;
    }

    &:nth-child(4) {
      margin-top: 10px;
    }
  }
}

.avatar-box {
  min-width: 280px;
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
        max-width: 90px;
        height: 100px;
        vertical-align: top;
      }
    }
  }
}
</style>
