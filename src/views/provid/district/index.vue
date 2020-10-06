<template>
  <div class="main-container">
    <div class="filter-container">
      <el-input class="filter-input"
        placeholder="请输入姓名"
        style="width: 320px;margin-right: 20px;"
        v-model="listQuery.nickName">
        <template slot="prepend">姓名</template>
      </el-input>
      <el-input class="filter-input"
        placeholder="请输入身份证号"
        style="width: 320px;margin-right: 20px;"
        v-model="listQuery.cIdCard">
        <template slot="prepend">身份证号</template>
      </el-input>
      <div class="select">
        <div class="type">
          申请状态
        </div>
        <el-select placeholder="请选择"
          v-model="listQuery.applyState">
          <el-option v-for="item in applyOptions"
            :key="item.val"
            :label="item.dataKey"
            :value="item.val"></el-option>
        </el-select>
      </div>
      <el-button type="primary"
        icon="el-icon-search"
        @click="handleQuery()">查询</el-button>
    </div>
    <div class="filter-container">
      <span class="excel-wrapper">
        <el-button type="primary"
          icon="el-icon-plus"
          @click="handleCreate()">添加</el-button>
      </span>
      <span class="excel-wrapper">
        <el-button type="warning"
          icon="el-icon-edit"
          @click="handleUpdate()">修改</el-button>
      </span>
      <span class="excel-wrapper">
        <el-button type="danger"
          icon="el-icon-delete"
          @click="handleDelete()">删除</el-button>
      </span>
      <span class="excel-wrapper">
        <el-button type="primary"
          icon="el-icon-upload"
          @click="handleIntoExcel('city')">市级导入</el-button>
      </span>
      <span class="excel-wrapper">
        <el-button type="primary"
          icon="el-icon-upload"
          @click="handleIntoExcel('area')">区级导入</el-button>
      </span>
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
      <el-table-column label="姓名"
        :show-overflow-tooltip="true"
        prop="cName"
        align="center">
      </el-table-column>
      <el-table-column label="身份证号"
        :show-overflow-tooltip="true"
        prop="cIdCard"
        align="center">
      </el-table-column>
      <el-table-column label="户籍社区"
        :show-overflow-tooltip="true"
        prop="houseCommunity"
        align="center">
      </el-table-column>
      <el-table-column label="居住社区"
        :show-overflow-tooltip="true"
        prop="liveCommunity"
        align="center">
      </el-table-column>
      <el-table-column label="联系电话"
        :show-overflow-tooltip="true"
        prop="telePhone"
        align="center">
      </el-table-column>
      <el-table-column label="居住地址"
        :show-overflow-tooltip="true"
        prop="address"
        align="center"
        width="200">
      </el-table-column>
      <el-table-column label="评估时间"
        :show-overflow-tooltip="true"
        prop="aplyEvTime"
        align="center">
      </el-table-column>
      <el-table-column label="完成时间"
        :show-overflow-tooltip="true"
        prop="aplyEndTime"
        align="center">
      </el-table-column>
      <el-table-column label="操作"
        align="center"
        width="220">
        <template slot-scope="scope">
          <el-button type="primary"
            size="mini"
            @click="handleDetail(scope.row)">查看</el-button>
          <el-button type="primary"
            size="mini"
            @click="handleUrgent(scope.row)">紧急联系人</el-button>
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
        <el-form-item label="老人姓名"
          prop="cId">
          <el-input v-if="isReadonly"
            v-model="form.cName"
            placeholder="请输入老人姓名"
            style="width: 240px;"
            readonly></el-input>
          <el-input v-else
            v-model="form.cName"
            placeholder="请输入老人姓名"
            @focus="handleProject('older')"
            style="width: 240px;"></el-input>
        </el-form-item>
        <el-form-item label="户口性质"
          v-if="form.cId||dialogStatus!='create'">
          <el-input readonly
            v-if="form.reserve4"
            v-model="form.reserve4"
            placeholder="请输入户口性质"
            style="width: 240px;"></el-input>
          <label v-else>暂无</label>
        </el-form-item>
        <!-- <el-form-item label="户口性质">
          <el-select class="filter-item"
            clearable
            v-model="form.reserve3"
            placeholder="请选择"
            style="width: 240px"
            :disabled="isReadonly">
            <el-option v-for="item in kkOptions"
              :key="item.val"
              :label="item.dataKey"
              :value="item.val"></el-option>
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="户籍社区"
          prop="houseCommunity">
          <el-cascader filterable
            v-model="listVals.houseCommunity"
            :options="bunkOptions"
            @change="handleCommunity('houseCommunity')"
            style="width: 240px"
            :disabled="isReadonly"></el-cascader>
        </el-form-item>
        <el-form-item label="居住社区"
          prop="liveCommunity">
          <el-cascader filterable
            v-model="listVals.liveCommunity"
            :options="bunkOptions"
            @change="handleCommunity('liveCommunity')"
            style="width: 240px"
            :disabled="isReadonly"></el-cascader>
        </el-form-item> -->
        <!-- <el-form-item label="补贴标准"
          prop="subid">
          <el-input readonly
            v-model="form.subid"
            placeholder="请输入补贴标准"
            style="width: 240px;"></el-input>
        </el-form-item> -->
        <el-form-item label="补贴标准"
          prop="subid">
          <el-select class="filter-item"
            clearable
            v-model="form.subid"
            placeholder="请选择"
            style="width: 240px"
            :disabled="isReadonly">
            <el-option v-for="item in markOptions"
              :key="item.val"
              :label="item.dataKey"
              :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogStatus!='create'"
          label="补助金额"
          prop="subMoney">
          <el-input readonly
            v-model="form.subMoney"
            placeholder="请输入补助金额"
            style="width: 240px;"></el-input>
        </el-form-item>
        <el-form-item label="申请状态"
          prop="applyState">
          <el-select class="filter-item"
            clearable
            v-model="form.applyState"
            placeholder="请选择"
            style="width: 240px"
            :disabled="isReadonly">
            <el-option v-for="item in applyOptions"
              :key="item.val"
              :label="item.dataKey"
              :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="评估总分"
          prop="evTotal">
          <el-input v-model="form.evTotal"
            placeholder="请输入评估总分"
            style="width: 240px;"
            :readonly="isReadonly"></el-input>
          <!-- <span class="filter-rate">
            <el-rate allow-half
              v-model="form.isExitFree"
              show-text></el-rate>
          </span> -->
        </el-form-item>
        <el-form-item label="评估时间"
          prop="aplyEvTime">
          <el-date-picker type="datetime"
            v-model="form.aplyEvTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
            style="width: 240px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="完成时间"
          prop="aplyEndTime">
          <el-date-picker type="datetime"
            v-model="form.aplyEndTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
            style="width: 240px">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="居住地址"
          prop="address">
          <el-input v-model="form.address"
            placeholder="请输入地址"
            style="width: 460px;"></el-input>
          <span class="seat-map"
            @click="handleAddress()">
            <svg-icon icon-class="seat"></svg-icon>
            <span>选择地址</span>
          </span>
        </el-form-item> -->
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
      :title="defaultTitle"
      :visible.sync="dialogProShow"
      @close="dialogOldClose()"
      :close-on-click-modal="false">
      <div v-if="dialogProShow">
        <chart-choose v-if="defaultType=='older'"
          :data="form.cName"
          @setGoback="handleOldback">
        </chart-choose>
        <mark-choose v-if="defaultType=='mark'"
          :data="form.reserve2"
          @setGoback="handleOldback"></mark-choose>
      </div>
    </el-dialog>

    <el-dialog width="600px"
      :title="lotSign.title"
      :visible.sync="dialogLotShow"
      @close="dialogLotClose()"
      :close-on-click-modal="false">
      <div class="lot-dialog">
        <span class="excel-wrapper">
          <input ref="excelInputer"
            class="excel-upload"
            type="file"
            accept=".xlsx, .xls"
            @change="intoExcel" />
          <el-button type="primary">上传文件</el-button>
        </span>
        <div class="lot-link">
          <a href="http://120.202.177.101:8090/ProvideManager/cardIssueVehicleInfo/exportVehicleInfo.htm"
            class="link">
            <svg-icon icon-class="leadin"></svg-icon>
            <span>老人信息模板下载</span>
          </a>
          <div class="text">
            <p>模板说明...</p>
            <p>模板说明...</p>
            <p>模板说明...</p>
            <p>模板说明...</p>
            <p>模板说明...</p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRecordList,
  addRecord,
  updateRecord,
  delOneRecord,
  findByDicCode,
  importExcelData
} from '@/api/page'
import { allApi } from '@/api/config'
import chartChoose from './older'
import markChoose from './mark'
import gouldMap from '@/components/GouldMap'
import { mapGetters } from 'vuex'

const notes = {
  id: null,
  cId: '',
  subid: '',
  evTotal: '',
  applyState: 1,
  aplyEvTime: '',
  aplyEndTime: '',
  cName: '',
  reserve2: '',
  reserve3: '',
  reserve4: '',
  subMoney: '',
  create_user: ''
}

const list = []

export default {
  name: 'HelloWorld',
  components: {
    chartChoose,
    markChoose,
    gouldMap
  },
  data() {
    return {
      list,
      btnPowers: null,
      markOptions: [],
      applyOptions: [],
      kkOptions: [],
      listQuery: {
        nickName: '',
        cIdCard: '',
        applyState: ''
      },
      listVals: {
        applyCommunity: [],
        liveCommunity: [],
        houseCommunity: []
      },
      bunkOptions: [],
      mulSelection: [],
      currentPage: 1,
      pageSize: 10,
      totalOlders: 30,
      defaultTitle: '',
      defaultType: '',
      dialogProShow: false,
      dialogMapShow: false,
      dialogLotShow: false,
      lotSign: {
        title: '市级批量上传',
        sign: 'city'
      },
      isReadonly: false,
      form: { ...notes },
      rules: {
        cId: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          }
        ],
        subid: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          }
        ],
        evTotal: [
          {
            required: true,
            message: '请输入',
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

    getRecordList(allApi.addresstable.getList, {}).then(response => {
      this.bunkOptions = this.handleHigher(response.data.dataList)
    })

    this.findDicList()
    this.handleQuery(this.currentPage, this.pageSize)
  },
  methods: {
    findDicList() {
      findByDicCode('applyState').then(response => {
        this.applyOptions = response.data.dataList
      })

      findByDicCode('benchmark').then(response => {
        this.markOptions = response.data.dataList
      })

      findByDicCode('character').then(response => {
        this.kkOptions = response.data.dataList
      })
    },
    handleUrgent(row) {
      console.log(row)
      this.$router.push({
        path: '/sidy/urgent',
        query: { cid: row.id }
      })
    },
    handleCommunity(val) {
      if (val === 'applyCommunity') {
        this.form.applyCommunity = this.listVals.applyCommunity.join()
      }
      if (val === 'liveCommunity') {
        this.form.liveCommunity = this.listVals.liveCommunity.join()
      }

      if (val === 'houseCommunity') {
        this.form.houseCommunity = this.listVals.houseCommunity.join()
      }
    },
    handleQuery(currentPage, pageSize) {
      this.currentPage = 1
      if (currentPage) this.currentPage = currentPage
      const apiUrl = allApi.areasubsidytarget.getList
      getRecordList(apiUrl, {
        page: this.currentPage,
        pageSize: this.pageSize,
        organizationId: this.sysUser.institutionsId,
        create_user: this.sysUser.id,
        roleId: this.sysUser.roleId,
        cName: this.listQuery.nickName,
        cIdCard: this.listQuery.cIdCard,
        applyState: this.listQuery.applyState
      }).then(response => {
        this.totalOlders = response.data.totalRecord
        this.list = response.data.dataList
        console.log('response', response)
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
      this.form.create_user = this.sysUser.id

      this.listVals = {
        applyCommunity: [],
        liveCommunity: [],
        houseCommunity: []
      }
    },
    create(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          const apiUrl = allApi.areasubsidytarget.addData
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

        this.form.applyState = parseInt(this.form.applyState)
        this.listVals = {
          applyCommunity: this.form.applyCommunity
            ? this.form.applyCommunity.split(',').map(i => parseInt(i))
            : [],
          liveCommunity: this.form.liveCommunity
            ? this.form.liveCommunity.split(',').map(i => parseInt(i))
            : [],
          houseCommunity: this.form.houseCommunity
            ? this.form.houseCommunity.split(',').map(i => parseInt(i))
            : []
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
          const apiUrl = allApi.areasubsidytarget.updateData
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
          const apiUrl = allApi.areasubsidytarget.delData
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

      this.form.applyState = parseInt(this.form.applyState)
      this.listVals = {
        applyCommunity: this.form.applyCommunity
          ? this.form.applyCommunity.split(',').map(i => parseInt(i))
          : [],
        liveCommunity: this.form.liveCommunity
          ? this.form.liveCommunity.split(',').map(i => parseInt(i))
          : [],
        houseCommunity: this.form.houseCommunity
          ? this.form.houseCommunity.split(',').map(i => parseInt(i))
          : []
      }
    },
    handleIntoExcel(val) {
      this.dialogLotShow = true
      this.lotSign = {
        title: '市级批量上传',
        sign: 'city'
      }

      if (val === 'area') {
        this.lotSign = {
          title: '区级批量上传',
          sign: 'area'
        }
      }
    },
    intoExcel(e) {
      const files = e.target.files
      const rawFile = files[0]
      if (rawFile) {
        if (files[0].size / 1024 > 1024) {
          this.$message({
            message: '上传的Excel文件不能大于1mb.',
            type: 'warning'
          })
        } else {
          let formData = new FormData()
          formData.append('idep', rawFile)
          this.dialogLotShow = false
          let apiUrl = ''
          if (this.lotSign.sign === 'city') {
            apiUrl = allApi.areasubsidytarget.importData
          } else if (this.lotSign.sign === 'area') {
            apiUrl = allApi.areasubsidytarget.importAreaData
          }

          importExcelData(apiUrl, formData).then(res => {
            console.log('res', res)
            this.handleQuery(this.currentPage, this.pageSize)
            this.$notify({
              title: '成功',
              message: '上传成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      }
    },
    dialogLotClose() {
      this.dialogLotShow = false
    },
    handleProject(val) {
      this.defaultType = val
      this.dialogProShow = true
      this.defaultTitle = '选择访老人'
      if (this.defaultType === 'mark') {
        this.defaultTitle = '选择补贴标准'
      }
    },
    handleOldback(data) {
      console.log(data)
      this.dialogProShow = false
      const rlist = data.split('-')
      if (this.defaultType === 'older') {
        this.form.cId = rlist[0]
        this.form.cName = rlist[1]
        this.form.reserve4 = rlist[2]
      } else if (this.defaultType === 'mark') {
        this.form.subid = rlist[0]
        this.form.reserve2 = rlist[1]
      }
    },
    dialogOldClose() {
      this.dialogProShow = false
    },
    handleAddress() {
      this.dialogMapShow = true
    },
    handleMapback(data) {
      this.dialogMapShow = false
      this.form.address = data.address
    },
    dialogMapClose() {
      this.dialogMapShow = false
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
</style>
