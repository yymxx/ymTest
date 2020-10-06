<template>
  <div class="main-container">
    <div class="filter-container">
      <el-input class="filter-input"
        placeholder="请输入服务商名称"
        style="width: 320px;margin-right: 20px;"
        v-model="listQuery.spName">
        <template slot="prepend">服务商名称</template>
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
      <el-table-column label="服务商名称"
        :show-overflow-tooltip="true"
        prop="spName"
        align="center">
      </el-table-column>
      <el-table-column label="服务商地址"
        :show-overflow-tooltip="true"
        prop="spAddress"
        align="center"
        width="200">
      </el-table-column>
      <el-table-column label="联系电话"
        :show-overflow-tooltip="true"
        prop="spTelePhone"
        align="center">
      </el-table-column>
      <!-- <el-table-column label="服务商照片"
        align="center">
        <template slot-scope="scope">
          <img v-if="scope.row.spPhoto"
            :src="scope.row.spPhoto"
            class="td-img" />
        </template>
      </el-table-column> -->
      <el-table-column label="经营类型"
        :show-overflow-tooltip="true"
        prop="spClass"
        align="center">
      </el-table-column>
      <el-table-column label="经营方式"
        :show-overflow-tooltip="true"
        prop="spMode"
        align="center">
      </el-table-column>
      <el-table-column label="负责人名称"
        :show-overflow-tooltip="true"
        prop="spUserName"
        align="center">
      </el-table-column>
      <el-table-column label="负责人电话"
        :show-overflow-tooltip="true"
        prop="spUserPhone"
        align="center">
      </el-table-column>
      <!-- <el-table-column label="营业执照"
        align="center">
        <template slot-scope="scope">
          <img v-if="scope.row.businessLicense"
            :src="scope.row.businessLicense"
            class="td-img" />
        </template>
      </el-table-column> -->
      <el-table-column label="许可证号"
        :show-overflow-tooltip="true"
        prop="businessPermit"
        align="center">
      </el-table-column>
      <el-table-column label="服务商状态"
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
      width="1150px">
      <el-form :inline="true"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="120px">
        <el-form-item label="服务商名称"
          prop="spName">
          <el-input v-model="form.spName"
            placeholder="请输入服务商名称"
            style="width: 220px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="联系电话"
          prop="spTelePhone">
          <el-input v-model="form.spTelePhone"
            placeholder="请输入联系电话"
            style="width: 220px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <span class="avatar-box avatar-user">
          <el-form-item label="服务商照片">
            <el-upload v-if="!isReadonly"
              class="avatar-uploader"
              :action="updateImgUrl"
              accept="image/*"
              :show-file-list="false"
              :on-success="handleAvatar">
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div v-if="form.spPhoto"
              class="avatar-uploader">
              <img :src="form.spPhoto"
                class="avatar">
            </div>
          </el-form-item>
        </span>
        <el-form-item label="经营类型"
          prop="spClass">
          <el-input v-model="form.spClass"
            placeholder="请输入经营类型"
            style="width: 220px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="经营方式"
          prop="spMode">
          <el-input v-model="form.spMode"
            placeholder="请输入经营方式"
            style="width: 220px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="负责人名称"
          prop="spUserName">
          <el-input v-model="form.spUserName"
            placeholder="请输入负责人名称"
            style="width: 220px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="负责人电话"
          prop="spUserPhone">
          <el-input v-model="form.spUserPhone"
            placeholder="请输入负责人电话"
            style="width: 220px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="许可证号"
          prop="businessPermit">
          <el-input v-model="form.businessPermit"
            placeholder="请输入许可证号"
            style="width: 220px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="服务商状态"
          prop="spState">
          <el-select class="filter-item"
            clearable
            v-model="form.spState"
            placeholder="请选择"
            style="width: 220px"
            :disabled="isReadonly">
            <el-option v-for="item in options.spState"
              :key="item.val"
              :label="item.dataKey"
              :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务商地址"
          prop="spAddress">
          <el-input v-model="form.spAddress"
            placeholder="请输入地址"
            style="width: 460px;"></el-input>
          <span class="seat-map"
            @click="handleAddress()">
            <svg-icon icon-class="seat"></svg-icon>
            <span>选择地址</span>
          </span>
        </el-form-item>
        <span class="avatar-box">
          <el-form-item label="营业执照">
            <el-upload v-if="!isReadonly"
              class="avatar-uploader"
              :action="updateImgUrl"
              accept="image/*"
              :show-file-list="false"
              :on-success="handleAvatarCard">
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div v-if="form.businessLicense"
              class="avatar-uploader">
              <img :src="form.businessLicense"
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
import { mapGetters } from 'vuex'

const notes = {
  id: null,
  spName: '',
  spAddress: '',
  spTelePhone: '',
  spPhoto: '',
  spClass: '',
  spMode: '',
  spUserName: '',
  spUserPhone: '',
  businessLicense: '',
  businessPermit: '',
  spAccount: '',
  spState: '',
  spJurisdiction: ''
}

const list = []

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
      options: {
        spState: []
      },
      listQuery: {
        spName: ''
      },
      mulSelection: [],
      currentPage: 1,
      pageSize: 10,
      totalOlders: 30,
      isReadonly: false,
      dialogMapShow: false,
      form: { ...notes },
      rules: {
        spName: [],
        spAddress: [],
        spTelePhone: [],
        spClass: [],
        spMode: [],
        spUserName: [],
        spUserPhone: [],
        spAccount: [],
        spState: [],
        businessPermit: [],
        spJurisdiction: []
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
      findByDicCode('sproviderState').then(response => {
        this.options.spState = response.data.dataList
      })
    },
    handleAvatar(res, file) {
      this.form.spPhoto = res.imgUrl
    },
    handleAvatarCard(res, file) {
      this.form.businessLicense = res.imgUrl
    },
    handleQuery(currentPage, pageSize) {
      this.currentPage = 1
      if (currentPage) this.currentPage = currentPage
      const apiUrl = allApi.serviceprovider.getList
      getRecordList(apiUrl, {
        page: this.currentPage,
        pageSize: this.pageSize,
        spName: this.listQuery.spName,
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
      this.form = { ...notes }
    },
    create(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          const apiUrl = allApi.serviceprovider.addData
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
          const apiUrl = allApi.serviceprovider.updateData
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
          const apiUrl = allApi.serviceprovider.delData
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
      this.form.spAddress = data.address
    },
    dialogMapClose() {
      this.dialogMapShow = false
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

.avatar-user {
  float: right;
  width: 402px;
}
</style>
