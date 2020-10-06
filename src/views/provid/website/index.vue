<template>
  <div class="main-container">
    <div class="filter-container">
      <el-input class="filter-input"
        placeholder="请输入服务站"
        style="width: 280px;margin-right: 20px;"
        v-model="listQuery.nickName">
        <template slot="prepend">服务站</template>
      </el-input>
      <el-button type="primary"
        icon="el-icon-search"
        @click="handleQuery()">查询</el-button>
    </div>
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
      <el-table-column label="服务站名称"
        :show-overflow-tooltip="true"
        prop="ssName"
        align="center">
      </el-table-column>
      <el-table-column label="地址"
        :show-overflow-tooltip="true"
        prop="address"
        align="center"
        width="280">
      </el-table-column>
      <el-table-column label="负责人名称"
        :show-overflow-tooltip="true"
        prop="personLiable"
        align="center">
      </el-table-column>
      <el-table-column label="负责人电话"
        :show-overflow-tooltip="true"
        prop="personPhone"
        align="center">
      </el-table-column>
      <!-- <el-table-column label="服务站照片"
        align="center">
        <template slot-scope="scope">
          <img v-if="scope.row.ssImg"
            :src="scope.row.ssImg"
            class="td-img" />
        </template>
      </el-table-column>
      <el-table-column label="证书照片"
        align="center">
        <template slot-scope="scope">
          <img v-if="scope.row.certificateImg"
            :src="scope.row.certificateImg"
            class="td-img" />
        </template>
      </el-table-column> -->
      <el-table-column label="服务站状态"
        :show-overflow-tooltip="true"
        prop="reserve2"
        align="center">
      </el-table-column>
      <el-table-column label="操作"
        align="center"
        width="150">
        <template slot-scope="scope">
          <el-button type="primary"
            size="mini"
            @click="handleDetail(scope.row)">查看详情</el-button>
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
        <el-form-item label="服务站名称"
          prop="ssName">
          <el-input v-model="form.ssName"
            placeholder="请输入服务站名称"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="服务站账号"
          prop="sId">
          <el-input v-model="form.sId"
            placeholder="请输入服务站账号"
            style="width: 240px;"
            :readonly="dialogStatus!='create'"></el-input>
        </el-form-item>
        <el-form-item label="负责人"
          prop="personLiable">
          <el-input v-model="form.personLiable"
            placeholder="请输入负责人"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="电话"
          prop="personPhone">
          <el-input v-model="form.personPhone"
            placeholder="请输入负责人电话"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="服务站状态"
          prop="ssState">
          <el-select class="filter-item"
            clearable
            v-model="form.ssState"
            placeholder="请选择"
            style="width: 240px"
            :disabled="isReadonly">
            <el-option v-for="item in options.gender"
              :key="item.val"
              :label="item.dataKey"
              :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务项目"
          prop="spId">
          <el-input v-model="clientName"
            placeholder="请输入服务项目"
            @focus="handleProject"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="服务商"
          prop="spId">
          <el-input v-model="form.reserve3"
            placeholder="请输入服务商名称"
            @focus="handleOlder"
            style="width: 610px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="地址"
          prop="address">
          <el-input v-model="form.address"
            placeholder="请输入地址"
            style="width: 500px;"></el-input>
          <span class="seat-map"
            @click="handleAddress()">
            <svg-icon icon-class="seat"></svg-icon>
            <span>选择地址</span>
          </span>
        </el-form-item>
        <span class="avatar-box">
          <el-form-item label="照片">
            <el-upload v-if="!isReadonly"
              class="avatar-uploader"
              :action="updateImgUrl"
              accept="image/*"
              :show-file-list="false"
              :on-success="handleAvatar">
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div v-if="form.ssImg"
              class="avatar-uploader">
              <img :src="form.ssImg"
                class="avatar">
            </div>
          </el-form-item>
        </span>
        <span class="avatar-box">
          <el-form-item label="证书照片">
            <el-upload v-if="!isReadonly"
              class="avatar-uploader"
              :action="updateImgUrl"
              accept="image/*"
              :show-file-list="false"
              :on-success="handleAvatarCard">
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div v-if="form.certificateImg"
              class="avatar-uploader">
              <img :src="form.certificateImg"
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

    <el-dialog width="800px"
      title="点击地图选择地址"
      :visible.sync="dialogMapShow"
      @close="dialogMapClose()"
      :close-on-click-modal="false">
      <gould-map v-if="dialogMapShow"
        @setGoback="handleMapback"></gould-map>
    </el-dialog>

    <el-dialog width="960px"
      title="选择服务项目"
      :visible.sync="dialogProShow"
      @close="dialogOldClose()"
      :close-on-click-modal="false">
      <choose-options multiple="subject"
        v-if="dialogProShow"
        :data="form.reserve1"
        @setGoback="handleOldback"></choose-options>
    </el-dialog>

    <el-dialog width="960px"
      title="选择服务商"
      :visible.sync="dialogOldShow"
      @close="dialogOldClose()"
      :close-on-click-modal="false">
      <choose-options v-if="dialogOldShow"
        :data="form.spId"
        @setGoback="handleOldback"></choose-options>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRecordList,
  addRecord,
  updateRecord,
  delOneRecord,
  findByDicCode
} from '@/api/page'
import { allApi } from '@/api/config'
import gouldMap from '@/components/GouldMap'
import chooseOptions from './choose'
import { mapGetters } from 'vuex'

const notes = {
  id: null,
  sId: '',
  spId: '',
  ssName: '',
  address: '',
  longitude: '',
  latitude: '',
  personLiable: '',
  personPhone: '',
  ssImg: '',
  certificateImg: '',
  ssState: '',
  reserve1: '',
  reserve3: ''
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
    gouldMap,
    chooseOptions
  },
  data() {
    return {
      list,
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
      pageSize: 10,
      totalOlders: 30,
      dialogMapShow: false,
      dialogOldShow: false,
      dialogProShow: false,
      clientName: '',
      isReadonly: false,
      form: { ...notes },
      rules: {
        ssName: [],
        sId: [],
        personLiable: [],
        personPhone: [],
        ssState: [],
        spId: [],
        address: []
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

    for (var key in this.rules) {
      this.rules[key] = [
        {
          required: true,
          message: '必填项',
          trigger: 'blur'
        }
      ]
    }

    this.findDicList()
    this.handleQuery(this.currentPage, this.pageSize)
  },
  methods: {
    findDicList() {
      findByDicCode('stationState').then(response => {
        this.options.gender = response.data.dataList
      })
    },
    handleAvatar(res, file) {
      this.form.ssImg = res.imgUrl
    },
    handleAvatarCard(res, file) {
      this.form.certificateImg = res.imgUrl
    },
    handleQuery(currentPage, pageSize) {
      this.currentPage = 1
      if (currentPage) this.currentPage = currentPage
      const apiUrl = allApi.servicestation.getList
      getRecordList(apiUrl, {
        page: this.currentPage,
        pageSize: this.pageSize,
        ssName: this.listQuery.nickName,
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
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.isReadonly = false
      this.clientName = ''
      this.form = { ...notes }
    },
    create(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          const apiUrl = allApi.servicestation.addData
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
        this.isReadonly = false
        this.clientName = this.mulSelection[0].reserve4
        for (const key in this.form) {
          this.form[key] = this.mulSelection[0][key]
        }
      } else {
        this.$message({
          type: 'warning',
          message: '请选择一条记录'
        })
      }
    },
    update(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          const apiUrl = allApi.servicestation.updateData
          updateRecord(apiUrl, this.form).then(res => {
            console.log(res)
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
          const apiUrl = allApi.servicestation.delData
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
      this.isReadonly = true
      for (const key in this.form) {
        this.form[key] = row[key]
      }
    },
    handleAddress() {
      this.dialogMapShow = true
    },
    handleMapback(data) {
      this.dialogMapShow = false
      this.form.address = data.address
      this.form.longLatitude = data.lnglat
    },
    dialogMapOpen(a, b) {
      console.log(a, b)
    },
    dialogMapClose() {
      this.dialogMapShow = false
    },
    handleProject() {
      this.dialogProShow = true
    },
    handleOlder() {
      this.dialogOldShow = true
    },
    handleOldback(data) {
      if (this.dialogOldShow) {
        const rlist = data.split('-')
        this.form.spId = rlist[0]
        this.form.reserve3 = rlist[1]
        this.dialogOldShow = false
      }

      if (this.dialogProShow) {
        this.clientName = data.replace(/[\d-]/g, '')
        const rlist = data.split(',').reduce((res, item) => {
          return res.concat(parseInt(item))
        }, [])

        this.form.reserve1 = rlist.join()
        console.log('服务项目', this.form.reserve1)
        this.dialogProShow = false
      }
    },
    dialogOldClose() {
      this.dialogOldShow = false
      this.dialogProShow = false
    },
    cancel(formName) {
      this.dialogFormVisible = false
      this.dialogOldShow = false
      this.dialogProShow = false
    },
    clearFormValidate(formName) {
      this.$refs[formName].clearValidate()
    }
  }
}
</script>

<style lang="scss" scoped>
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
