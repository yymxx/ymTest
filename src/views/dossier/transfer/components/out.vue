<template>
  <div class="main-container">
    <div class="filter-container">
      <el-button type="primary"
        icon="el-icon-plus"
        @click="handleCreate()">添加</el-button>
      <el-button type="warning"
        icon="el-icon-edit"
        @click="handleUpdate()">修改</el-button>
      <el-button type="danger"
        icon="el-icon-delete"
        @click="handleDelete()">删除</el-button>
    </div>
    <el-table border
      :data="list"
      style="width: 100%;"
      ref="checkTable"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection"
        align="center"
        width="70">
      </el-table-column>
      <el-table-column label="老人姓名"
        :show-overflow-tooltip="true"
        prop="oldName"
        align="center">
      </el-table-column>
      <el-table-column label="证件号码"
        :show-overflow-tooltip="true"
        prop="idNumber"
        align="center">
      </el-table-column>
      <el-table-column label="年龄"
        :show-overflow-tooltip="true"
        prop="age"
        align="center">
      </el-table-column>
      <el-table-column label="出生日期"
        :show-overflow-tooltip="true"
        prop="birthday"
        align="center">
      </el-table-column>
      <el-table-column label="户籍社区"
        :show-overflow-tooltip="true"
        prop="censusRegister"
        align="center">
      </el-table-column>
      <el-table-column label="户籍地址"
        :show-overflow-tooltip="true"
        prop="address"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column label="居住社区"
        :show-overflow-tooltip="true"
        prop="community"
        align="center">
      </el-table-column>
      <el-table-column label="居住地址"
        :show-overflow-tooltip="true"
        prop="currentAddress"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column label="迁出时间"
        :show-overflow-tooltip="true"
        prop="outTime"
        align="center">
      </el-table-column>
      <el-table-column label="状态"
        :show-overflow-tooltip="true"
        prop="reserve1"
        align="center">
      </el-table-column>
      <el-table-column label="操作"
        align="center"
        width="150">
        <template slot-scope="scope">
          <el-button type="primary"
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
        <el-form-item label="迁出老人"
          prop="cusId">
          <el-input v-if="isReadonly"
            v-model="clientName"
            placeholder="请输入迁出老人"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
          <el-input v-else
            v-model="clientName"
            placeholder="请输入迁出老人"
            @focus="handleOlder"
            style="width: 240px;"></el-input>
        </el-form-item>
        <!-- <el-form-item label="迁入社区">
          <el-cascader filterable
            v-model="listQuarters"
            :options="bunkOptions"
            @change="handleCommunity()"
            style="width: 240px"
            :disabled="isReadonly"></el-cascader>
        </el-form-item> -->
        <el-form-item label="迁入社区"
          prop="inCommunity">
          <el-input v-model="form.inCommunity"
            placeholder="请输入迁入社区"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="迁入地址"
          prop="inAddress">
          <el-input v-model="form.inAddress"
            placeholder="请输入地址"
            style="width: 460px;"></el-input>
          <span class="seat-map"
            @click="handleAddress()">
            <svg-icon icon-class="seat"></svg-icon>
            <span>选择地址</span>
          </span>
        </el-form-item>
        <el-form-item label="迁出时间"
          prop="outTime">
          <el-date-picker type="datetime"
            :picker-options="taskOptions"
            v-model="form.outTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
            style="width: 240px"
            :disabled="isReadonly">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="迁出原因"
          prop="outReason">
          <el-input type="textarea"
            v-model="form.outReason"
            placeholder="请输入迁出原因"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <span class="avatar-box">
          <el-form-item label="附件">
            <el-upload class="avatar-uploader"
              :action="updateImgUrl"
              :show-file-list="false"
              :on-success="handleAvatar">
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div class="avatar-uploader">
              <div v-if="dialogStatus=='create'"
                style="width: 210px;line-height: 30px;"> {{ oldFileName }} </div>
              <div v-else
                style="width: 210px;line-height: 30px;"> {{ form.enclosure }} </div>
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

    <el-dialog width="960px"
      title="选择老人"
      :visible.sync="dialogOldShow"
      @close="dialogOldClose()"
      :close-on-click-modal="false">
      <older-options v-if="dialogOldShow"
        :data="form.reserve1"
        @setGoback="handleOldback"></older-options>
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
import {
  getRecordList,
  addRecord,
  updateRecord,
  delOneRecord,
  getRecordById,
  findByDicCode
} from '@/api/page'
import { allApi } from '@/api/config'
import gouldMap from '@/components/GouldMap'
import olderOptions from './older'
import { mapGetters } from 'vuex'

const notes = {
  id: null,
  orgid: '',
  cusId: '',
  type: 1,
  inCommunity: '',
  inAddress: '',
  outTime: '',
  outReason: '',
  deathTime: '',
  deathReason: '',
  enclosure: ''
}

const list = [
  {
    id: '1'
  },
  {
    id: '2'
  }
]

const deptList = [
  {
    deptName: '蔡甸',
    children: [
      {
        deptName: '蔡甸'
      },
      {
        deptName: '蔡甸'
      }
    ]
  }
]

export default {
  name: 'removalDie',
  components: {
    gouldMap,
    olderOptions
  },
  data() {
    return {
      list,
      btnPowers: null,
      updateImgUrl: allApi.updateImg,
      oldFileName: '',
      innerVisible: false,
      deptList,
      defaultProps: {
        children: 'children',
        label: 'deptName'
      },
      options: {
        gender: []
      },
      listQuarters: [],
      bunkOptions: [],
      mulSelection: [],
      currentPage: 1,
      pageSize: 10,
      totalOlders: 30,
      isReadonly: false,
      clientName: '',
      dialogOldShow: false,
      dialogMapShow: false,
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
  props: ['listQuery'],
  computed: {
    ...mapGetters(['sysUser']),
    taskOptions() {
      return {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  mounted() {
    getRecordList(allApi.addresstable.getList, {}).then(response => {
      this.bunkOptions = this.handleHigher(response.data.dataList)
    })

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
      this.form.enclosure = res.imgUrl
      this.oldFileName = res.oldFileName
    },
    handleQuery(currentPage, pageSize) {
      this.currentPage = 1
      if (currentPage) this.currentPage = currentPage
      const apiUrl = allApi.oldtransfers.getList
      getRecordList(apiUrl, {
        page: this.currentPage,
        pageSize: this.pageSize,
        type: 1,
        reserve1: this.listQuery.reserve1,
        reserve2: this.listQuery.reserve2,
        reserve3: this.listQuery.community[2],
        create_user: this.sysUser.id,
        roleId: this.sysUser.roleId
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
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.clientName = ''
      this.oldFileName = ''
      this.isReadonly = false
      this.form = { ...notes }
      this.listQuarters = []
    },
    create(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          const apiUrl = allApi.oldtransfers.addData
          addRecord(apiUrl, this.form).then(res => {
            console.log(res)
            if (res.data === 1) {
              this.handleQuery(this.currentPage, this.pageSize)
              this.$notify({
                title: '成功',
                message: '创建成功',
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
    handleUpdate() {
      console.log(this.mulSelection)
      if (this.mulSelection.length === 1) {
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.clientName = this.mulSelection[0].oldName
        this.isReadonly = false

        let apiUrl = allApi.oldtransfers.getById
        getRecordById(apiUrl, this.mulSelection[0].id).then(response => {
          console.log(222, response)
          if (response.data) {
            for (const key in this.form) {
              this.form[key] = response.data[key]
            }
          }
        })

        this.listQuarters = this.form.inCommunity
          ? this.form.inCommunity.split(',')
          : []
      } else {
        this.$message({
          type: 'warning',
          message: '请选择一条记录'
        })
      }
    },
    update(formName) {
      this.form.deathTime = ''
      this.form.deathReason = ''
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          const apiUrl = allApi.oldtransfers.updateData
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
    handleDelete() {
      if (this.mulSelection.length > 0) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const apiUrl = allApi.oldtransfers.delData
          delOneRecord(apiUrl, this.mulSelection[0].id).then(res => {
            if (res.data === 1) {
              this.handleQuery(this.currentPage, this.pageSize)
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
            }
          })
        })
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
    handleDetail(row) {
      this.dialogStatus = 'detail'
      this.dialogFormVisible = true
      this.clientName = row.oldName
      this.isReadonly = true

      let apiUrl = allApi.oldtransfers.getById
      getRecordById(apiUrl, row.id).then(response => {
        console.log(222, response)
        if (response.data) {
          for (const key in this.form) {
            this.form[key] = response.data[key]
          }
        }
      })
    },
    handleOlder() {
      this.dialogOldShow = true
    },
    handleOldback(data) {
      this.clientName = data.replace(/[\d-]/g, '')
      this.form.cusId = parseInt(data)
      this.dialogOldShow = false
    },
    dialogOldClose() {
      this.dialogOldShow = false
    },
    handleAddress() {
      this.dialogMapShow = true
    },
    handleMapback(data) {
      this.dialogMapShow = false
      this.form.inAddress = data.address
    },
    dialogMapClose() {
      this.dialogMapShow = false
    },
    handleCascader() {
      console.log(this.listQuery.community)
    },
    handleCommunity() {
      this.form.inCommunity = this.listQuarters.join()
    },
    handleHigher(data) {
      let rlist = JSON.parse(JSON.stringify(data))
      return rlist.reduce((res, item) => {
        if (item.children && item.children.length > 0) {
          return res.concat({
            value: item.id,
            label: item.addressName,
            children: this.handleHigher(item.children)
          })
        }

        return res.concat({
          value: item.id,
          label: item.addressName
        })
      }, [])
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
.custom-tree-node {
  .svg-icon {
    color: #2095ed;
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
