<template>
  <div class="main-container">
    <div class="filter-container">
      <el-input class="filter-input"
        placeholder="请输入标题"
        style="width: 280px;margin-right: 20px;"
        v-model="listQuery.nickName">
        <template slot="prepend">标题</template>
      </el-input>
      <div class="time-editor">
        <div class="type">培训日期</div>
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
      <el-table-column label="标题"
        :show-overflow-tooltip="true"
        prop="theme"
        align="center">
      </el-table-column>
      <el-table-column label="培训时间"
        :show-overflow-tooltip="true"
        prop="time"
        align="center">
      </el-table-column>
      <el-table-column label="培训地点"
        :show-overflow-tooltip="true"
        prop="place"
        align="center">
      </el-table-column>
      <el-table-column label="负责人"
        :show-overflow-tooltip="true"
        prop="liablePerson"
        align="center">
      </el-table-column>
      <el-table-column label="联系电话"
        :show-overflow-tooltip="true"
        prop="telephone"
        align="center">
      </el-table-column>
      <!-- <el-table-column label="内容"
        :show-overflow-tooltip="true"
        prop="content"
        align="center">
      </el-table-column>
      <el-table-column label="培训总结"
        :show-overflow-tooltip="true"
        prop="summary"
        align="center">
      </el-table-column> -->
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
      width="1200px">
      <el-form :inline="true"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="115px">
        <el-form-item label="标题"
          prop="theme">
          <el-input v-model="form.theme"
            placeholder="请输入标题"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="负责人"
          prop="liablePerson">
          <el-input v-model="form.liablePerson"
            placeholder="请输入负责人"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="联系电话"
          prop="telephone">
          <el-input v-model="form.telephone"
            placeholder="请输入联系电话"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <el-form-item label="培训时间"
          prop="time">
          <el-date-picker type="datetime"
            v-model="form.time"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
            style="width: 240px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="培训地点"
          prop="place">
          <el-input v-model="form.place"
            placeholder="请输入地址"
            style="width: 460px;"></el-input>
          <span class="seat-map"
            @click="handleAddress()">
            <svg-icon icon-class="seat"></svg-icon>
            <span>选择地址</span>
          </span>
        </el-form-item>
        <el-form-item label="内容"
          prop="content">
          <!-- <el-input type="textarea"
            v-model="form.content"
            placeholder="请输入内容"
            style="width: 240px;"
            :readonly="isReadonly"></el-input> -->
          <!-- <div v-if="isReadonly"
            v-html="form.content"
            class="detail"
            style="width: 965px;"></div> -->
          <vue-editor v-model="form.content"
            style="width: 965px;"
            :disabled="isReadonly"></vue-editor>
        </el-form-item>
        <el-form-item label="培训总结"
          prop="summary">
          <el-input type="textarea"
            v-model="form.summary"
            placeholder="请输入培训总结"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
        </el-form-item>
        <span class="avatar-box"
          v-if="!isReadonly">
          <el-form-item label="附件">
            <el-upload class="avatar-uploader"
              :action="updateImgUrl"
              :show-file-list="false"
              :on-success="handleAvatar">
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div class="avatar-uploader">
              <div style="width: 210px;line-height: 30px;"> {{ oldFileName }} </div>
            </div>
            <!-- <div v-if="form.enclosure"
              class="avatar-uploader">
              <img :src="form.enclosure"
                class="avatar">
            </div> -->
          </el-form-item>
        </span>
        <span class="avatar-box">
          <el-form-item label="现场图片">
            <el-upload class="avatar-uploader"
              :action="updateImgUrl"
              accept="image/*"
              :show-file-list="false"
              :on-success="handleAvatarImg">
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div v-if="form.sceneImg"
              class="avatar-uploader">
              <img :src="form.sceneImg"
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
  addPostRecord,
  updatePostRecord,
  delOneRecord,
  findByDicCode
} from '@/api/page'
import { allApi } from '@/api/config'
import { VueEditor } from 'vue2-editor'
import { mapGetters } from 'vuex'
import gouldMap from '@/components/GouldMap'

const notes = {
  id: null,
  orgId: '',
  theme: '',
  time: '',
  place: '',
  liablePerson: '',
  telephone: '',
  content: '',
  enclosure: '',
  summary: '',
  sceneImg: ''
}

const list = []

export default {
  name: 'HelloWorld',
  components: {
    gouldMap,
    VueEditor
  },
  data() {
    return {
      list,
      btnPowers: null,
      updateImgUrl: allApi.updateImg,
      oldFileName: '',
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
      dialogMapShow: false,
      form: { ...notes },
      rules: {
        theme: [
          {
            required: true,
            message: '请输入培训主题',
            trigger: 'blur'
          }
        ],
        place: [
          {
            required: true,
            message: '请输入地点',
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
  computed: {
    ...mapGetters(['sysUser'])
  },
  created() {
    this.btnPowers = this.$route.meta.btnList
    console.log('btnPowers', this.btnPowers)

    this.findDicList()
    this.handleQuery(this.currentPage, this.pageSize)
    console.log(this.uniqueId())
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
    handleAvatarImg(res, file) {
      this.form.sceneImg = res.imgUrl
    },
    handleQuery(currentPage, pageSize) {
      this.currentPage = 1
      if (currentPage) this.currentPage = currentPage
      const apiUrl = allApi.materTrain.getList
      getRecordList(apiUrl, {
        page: this.currentPage,
        pageSize: this.pageSize,
        reserve1: this.timeQuerys[0],
        reserve2: this.timeQuerys[1],
        theme: this.listQuery.nickName
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
      this.oldFileName = ''
      this.form = { ...notes }
      this.form.orgId = this.sysUser.institutionsId
    },
    create(formName) {
      this.form.content = escape(this.form.content)
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          const apiUrl = allApi.materTrain.addData
          addPostRecord(apiUrl, this.form).then(res => {
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

        // this.form.content = unescape(this.form.content)
        this.form.content = ''
      } else {
        this.$message({
          type: 'warning',
          message: '请选择一条记录'
        })
      }
    },
    update(formName) {
      this.form.content = escape(this.form.content)
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          const apiUrl = allApi.materTrain.updateData
          updatePostRecord(apiUrl, this.form).then(res => {
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
          const apiUrl = allApi.materTrain.delData
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

      // this.form.content = unescape(this.form.content)
      this.form.content = ''
    },
    uniqueId() {
      let rdNum = ('' + Date.now()).slice(-8)
      let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
      let res = str[Math.floor(Math.random() * str.length)]
      return res + rdNum
    },
    handleAddress() {
      this.dialogMapShow = true
    },
    handleMapback(data) {
      this.dialogMapShow = false
      this.form.place = data.address
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
</style>
