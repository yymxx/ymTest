<template>
  <div class="main-container">
    <div class="filter-container"
      style="width: 990px;">
      <div class="select">
        <div class="type">
          行政区划
        </div>
        <el-cascader clearable
          v-model="listQuarters"
          :options="bunkOptions"
          @change="handleCascader"
          filterable>
        </el-cascader>
      </div>
      <el-input class="filter-input"
        placeholder="请输入机构名称"
        style="width: 280px;margin-right: 20px;"
        v-model="listQuery.orgName">
        <template slot="prepend">机构名称</template>
      </el-input>
      <el-input class="filter-input"
        placeholder="统一信用代码"
        style="width: 280px;margin-right: 20px;"
        v-model="listQuery.greditCode">
        <template slot="prepend">统一信用代码</template>
      </el-input>
      <div class="select">
        <div class="type">
          机构性质
        </div>
        <el-select placeholder="请选择"
          v-model="listQuery.orgNature">
          <el-option v-for="item in options.orgNature"
            :key="item.val"
            :label="item.dataKey"
            :value="item.val"></el-option>
        </el-select>
      </div>
      <div class="select">
        <div class="type">
          机构类型
        </div>
        <el-select placeholder="请选择"
          v-model="listQuery.orgType">
          <el-option v-for="item in options.organType"
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
      <el-button type="primary"
        icon="el-icon-plus"
        @click="handleCreate()">添加</el-button>
      <el-button type="warning"
        icon="el-icon-edit"
        @click="handleUpdate()">修改</el-button>
      <el-button type="danger"
        icon="el-icon-delete"
        @click="handleDelete()">删除</el-button>
      <el-button type="warning"
        icon="el-icon-rank"
        @click="handleOlder()">老人</el-button>
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
      <el-table-column label="机构名称"
        :show-overflow-tooltip="true"
        prop="orgName"
        align="center">
      </el-table-column>
      <el-table-column label="行政划区"
        :show-overflow-tooltip="true"
        prop="addressName"
        align="center">
      </el-table-column>
      <el-table-column label="机构类型"
        :show-overflow-tooltip="true"
        prop="orgTypeStr"
        align="center">
      </el-table-column>
      <el-table-column label="机构性质"
        :show-overflow-tooltip="true"
        prop="orgNatureStr"
        align="center">
      </el-table-column>
      <el-table-column label="证书编号"
        :show-overflow-tooltip="true"
        prop="certificateNum"
        align="center">
      </el-table-column>
      <el-table-column label="负责人姓名"
        :show-overflow-tooltip="true"
        prop="orgCharge"
        align="center">
      </el-table-column>
      <el-table-column label="联系方式"
        :show-overflow-tooltip="true"
        prop="contactsMode"
        align="center">
      </el-table-column>
      <el-table-column label="详细地址"
        :show-overflow-tooltip="true"
        prop="datAddress"
        align="center"
        width="200">
      </el-table-column>
      <el-table-column label="床位数"
        :show-overflow-tooltip="true"
        prop="bedcount"
        align="center">
      </el-table-column>
      <el-table-column label="入住老人数"
        :show-overflow-tooltip="true"
        prop="bumkStatus"
        align="center">
      </el-table-column>
      <el-table-column label="服务人员数"
        :show-overflow-tooltip="true"
        prop="personnelCount"
        align="center">
      </el-table-column>
      <el-table-column label="操作"
        align="center"
        width="120">
        <template slot-scope="scope">
          <el-button type="primary"
            size="mini"
            @click="handleDetail(scope.row)">详情</el-button>
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
      :close-on-click-modal="false"
      width="1180px">
      <el-form :inline="true"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="115px">
        <div style="padding: 0 20px;">
          <el-tabs type="border-card">
            <el-tab-pane label="必填信息">
              <el-form-item label="所属区划"
                prop="region">
                <el-cascader filterable
                  v-model="listRegions"
                  :options="bunkOptions"
                  @change="handleRegions"
                  style="width: 220px"></el-cascader>
              </el-form-item>
              <el-form-item label="登录帐号"
                prop="loginAccounts">
                <el-input v-model="form.loginAccounts"
                  placeholder="请输入登录帐号"
                  style="width: 220px;"
                  :readonly="isReadonly"></el-input>
              </el-form-item>
              <el-form-item label="机构类型"
                prop="orgType">
                <el-select class="filter-item"
                  clearable
                  v-model="form.orgType"
                  placeholder="请选择"
                  style="width: 220px"
                  :disabled="isReadonly">
                  <el-option v-for="item in options.organType"
                    :key="item.val"
                    :label="item.dataKey"
                    :value="item.val"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="机构名称"
                prop="orgName">
                <el-input v-model="form.orgName"
                  placeholder="请输入机构名称"
                  style="width: 220px;"
                  :readonly="isReadonly"></el-input>
              </el-form-item>
              <el-form-item label="机构性质"
                prop="orgNature">
                <el-select class="filter-item"
                  clearable
                  v-model="form.orgNature"
                  placeholder="请选择"
                  style="width: 220px"
                  :disabled="isReadonly">
                  <el-option v-for="item in options.orgNature"
                    :key="item.val"
                    :label="item.dataKey"
                    :value="item.val"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="联系人"
                prop="contacts">
                <el-input v-model="form.contacts"
                  placeholder="请输入联系人"
                  style="width: 220px;"
                  :readonly="isReadonly"></el-input>
              </el-form-item>
              <el-form-item label="联系人电话"
                prop="contactsMode">
                <el-input v-model="form.contactsMode"
                  placeholder="请输入联系人电话"
                  style="width: 220px;"
                  :readonly="isReadonly"></el-input>
              </el-form-item>
              <el-form-item label="法人登记号码"
                prop="legalNumber">
                <el-input v-model="form.legalNumber"
                  placeholder="请输入法人登记号码"
                  style="width: 220px;"
                  :readonly="isReadonly"></el-input>
              </el-form-item>
              <el-form-item label="法定代表人"
                prop="legalPerson">
                <el-input v-model="form.legalPerson"
                  placeholder="请输入法定代表人"
                  style="width: 220px;"
                  :readonly="isReadonly"></el-input>
              </el-form-item>
              <el-form-item label="法人登记机关"
                prop="legalOffice">
                <el-input v-model="form.legalOffice"
                  placeholder="请输入法人登记机关"
                  style="width: 220px;"
                  :readonly="isReadonly"></el-input>
              </el-form-item>
              <el-form-item label="法人身份证号"
                prop="legalIdcard">
                <el-input v-model="form.legalIdcard"
                  placeholder="请输入法定代表人身份证号"
                  style="width: 220px;"
                  :readonly="isReadonly"></el-input>
              </el-form-item>
              <el-form-item label="卫生许可证号"
                prop="hygieneLicense">
                <el-input v-model="form.hygieneLicense"
                  placeholder="请输入卫生许可证号"
                  style="width: 220px;"
                  :readonly="isReadonly"></el-input>
              </el-form-item>
              <el-form-item label="房屋性质"
                prop="housingProperty">
                <el-radio-group v-model="form.housingProperty"
                  :style="{minWidth: '220px',maxWidth: '570px'}"
                  :disabled="isReadonly">
                  <el-radio v-for="(item, index) in options.houseList"
                    :key="index"
                    :label="item.val">{{ item.dataKey }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="投资类型"
                prop="investmentType">
                <el-radio-group v-model="form.investmentType"
                  :style="{minWidth: '220px',maxWidth: '570px'}"
                  :disabled="isReadonly">
                  <el-radio v-for="(item, index) in options.investList"
                    :key="index"
                    :label="item.val">{{ item.dataKey }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="居家养老服务"
                prop="provideServices">
                <el-select class="filter-item"
                  clearable
                  v-model="form.provideServices"
                  placeholder="请选择"
                  style="width: 220px"
                  :disabled="isReadonly">
                  <el-option v-for="item in options.serveList"
                    :key="item.dicKey"
                    :label="item.dicValue"
                    :value="item.dicKey"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="详细地址"
                prop="datAddress">
                <el-input v-model="form.datAddress"
                  placeholder="请输入详细地址"
                  style="width: 660px;"
                  :readonly="isReadonly"></el-input>
                <span v-if="!isReadonly"
                  class="seat-map"
                  @click="handleAddress()">
                  <svg-icon icon-class="seat"></svg-icon>
                  <span>选择地址</span>
                </span>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="基本信息">
              <el-form-item label="社会信用代码"
                prop="greditCode">
                <el-input v-model="form.greditCode"
                  placeholder="请输入统一社会信用代码"
                  style="width: 220px;"
                  :readonly="isReadonly"></el-input>
              </el-form-item>
              <el-form-item label="机构负责人"
                prop="orgCharge">
                <el-input v-model="form.orgCharge"
                  placeholder="请输入机构负责人"
                  style="width: 220px;"
                  :readonly="isReadonly"></el-input>
              </el-form-item>
              <span class="avatar-box avatar-user">
                <el-form-item label="营业执照">
                  <el-upload v-if="!isReadonly"
                    class="avatar-uploader"
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
              <el-form-item label="机构级别"
                prop="pensionLevel">
                <el-select class="filter-item"
                  clearable
                  v-model="form.pensionLevel"
                  placeholder="请选择"
                  style="width: 220px"
                  :disabled="isReadonly">
                  <el-option v-for="item in options.orgLevel"
                    :key="item.val"
                    :label="item.dataKey"
                    :value="item.val"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="电子邮件"
                prop="email">
                <el-input v-model="form.email"
                  placeholder="请输入电子邮件"
                  style="width: 220px;"
                  :readonly="isReadonly"></el-input>
              </el-form-item>
              <el-form-item label="邮政编码"
                prop="postalCode">
                <el-input v-model="form.postalCode"
                  placeholder="请输入邮政编码"
                  style="width: 220px;"
                  :readonly="isReadonly"></el-input>
              </el-form-item>
              <el-form-item label="建筑面积"
                prop="areaCovered">
                <el-input v-model="form.areaCovered"
                  placeholder="请输入建筑面积"
                  style="width: 220px;"
                  :readonly="isReadonly"></el-input>
              </el-form-item>
              <el-form-item label="投资（万元）"
                prop="investmentMoney">
                <el-input type="number"
                  v-model="form.investmentMoney"
                  style="width: 220px;"
                  :readonly="isReadonly"></el-input>
              </el-form-item>
              <el-form-item label="银行账号"
                prop="bankAccount">
                <el-input v-model="form.bankAccount"
                  placeholder="请输入银行账号"
                  style="width: 220px;"
                  :readonly="isReadonly"></el-input>
              </el-form-item>
              <el-form-item label="经营方式"
                prop="management">
                <el-select class="filter-item"
                  clearable
                  v-model="form.management"
                  placeholder="请选择"
                  style="width: 220px"
                  :disabled="isReadonly">
                  <el-option v-for="item in options.managList"
                    :key="item.val"
                    :label="item.dataKey"
                    :value="item.val"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="运营状态"
                prop="operate">
                <el-input v-model="form.operate"
                  placeholder="请输入运营状态"
                  style="width: 220px;"
                  :readonly="isReadonly"></el-input>
              </el-form-item>
              <el-form-item label="消防证明类型"
                prop="fireProof">
                <el-input v-model="form.fireProof"
                  placeholder="请输入消防证明"
                  style="width: 220px;"
                  :readonly="isReadonly"></el-input>
              </el-form-item>
              <el-form-item label="机构网址"
                prop="website">
                <el-input v-model="form.website"
                  placeholder="请输入机构网址"
                  style="width: 570px;"
                  :readonly="isReadonly"></el-input>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </div>
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
      title="添加老人"
      :visible.sync="dialogOldShow"
      @close="dialogOldClose()"
      :close-on-click-modal="false">
      <older-options multiple
        v-if="dialogOldShow"
        :data="form"
        @setGoback="handleOldback"></older-options>
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
import { updateByCommunity } from '@/api/older'
import { allApi } from '@/api/config'
import gouldMap from '@/components/GouldMap'
import olderOptions from './older'
import { mapGetters } from 'vuex'

const bunk = {
  id: null,
  olderList: '',
  orgType: '',
  orgName: '',
  orgCharge: '',
  pensionLevel: '',
  orgNature: '',
  areaCovered: '',
  bankAccount: '',
  contacts: '',
  contactsMode: '',
  datAddress: '',
  longitudeLatitude: '',
  fireProof: '',
  fixedPhone: '',
  greditCode: '',
  housingProperty: '',
  hygieneLicense: '',
  investmentMoney: '',
  investmentType: '',
  legalIdcard: '',
  legalNumber: '',
  legalOffice: '',
  legalPerson: '',
  license: '',
  provideServices: '',
  loginAccounts: '',
  management: '',
  operate: '',
  website: '',
  region: '',
  zoning: '',
  create_user: ''
}

const options = {
  organType: [],
  orgNature: [],
  orgLevel: [],
  houseList: [],
  investList: [],
  managList: [],
  serveList: [
    {
      dicKey: 1,
      dicValue: '提供'
    },
    {
      dicKey: 0,
      dicValue: '未提供'
    }
  ]
}

export default {
  name: 'HelloWorld',
  components: {
    gouldMap,
    olderOptions
  },
  data() {
    return {
      list: [],
      options,
      btnPowers: null,
      updateImgUrl: allApi.updateImg,
      bunkOptions: [],
      listRegions: null,
      listQuarters: null,
      listQuery: {
        quarters: '',
        orgName: '',
        greditCode: '',
        orgNature: '',
        orgType: ''
      },
      mulSelection: [],
      hhhImg: './static/images/picdd.jpg',
      currentPage: 1,
      pageSize: 10,
      totalOlders: 80,
      checkQuery: {
        attrBits: []
      },
      isReadonly: false,
      dialogOldShow: false,
      dialogMapShow: false,
      form: { ...bunk },
      rules: {
        orgName: [],
        orgType: [],
        orgNature: [],
        contacts: [],
        contactsMode: [],
        datAddress: [],
        housingProperty: [],
        hygieneLicense: [],
        investmentType: [],
        legalIdcard: [],
        legalNumber: [],
        legalOffice: [],
        legalPerson: [],
        provideServices: [],
        loginAccounts: [],
        longitudeLatitude: [],
        region: []
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
    const apiUrl = allApi.addresstable.getList
    getRecordList(apiUrl, {}).then(response => {
      this.bunkOptions = this.handleHigher(response.data.dataList)
    })
  },
  methods: {
    handleHigher(data, level) {
      let rlist = JSON.parse(JSON.stringify(data))
      return rlist.reduce((res, item) => {
        if (!level && item.children && item.children.length > 0) {
          return res.concat({
            value: item.id,
            label: item.addressName,
            children: this.handleHigher(item.children, 2)
          })
        }

        return res.concat({
          value: item.id,
          label: item.addressName
        })
      }, [])
    },
    handleAvatar(res, file) {
      console.log(file)
      this.form.license = res.imgUrl
    },
    handleCascader() {
      this.listQuery.quarters = this.listQuarters[1]
    },
    findDicList() {
      findByDicCode('orgType').then(response => {
        this.options.organType = response.data.dataList
        console.log(this.options.organType)
      })

      findByDicCode('orgNature').then(response => {
        this.options.orgNature = response.data.dataList
      })

      findByDicCode('pensionLevel').then(response => {
        this.options.orgLevel = response.data.dataList
      })

      findByDicCode('housingProperty').then(response => {
        this.options.houseList = response.data.dataList
      })

      findByDicCode('investmentType').then(response => {
        this.options.investList = response.data.dataList
      })

      findByDicCode('manageMode').then(response => {
        this.options.managList = response.data.dataList
      })
    },
    handleQuery(currentPage, pageSize) {
      this.currentPage = 1
      if (currentPage) this.currentPage = currentPage
      const apiUrl = allApi.organization.getList
      getRecordList(apiUrl, {
        page: this.currentPage,
        pageSize: this.pageSize,
        id: this.sysUser.institutionsId,
        create_user: this.sysUser.id,
        roleId: this.sysUser.roleId,
        orgName: this.listQuery.orgName,
        zoning: this.listQuery.quarters,
        greditCode: this.listQuery.greditCode,
        orgNature: this.listQuery.orgNature,
        orgType: this.listQuery.orgType
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
    handleRegions() {
      this.form.region = this.listRegions[1]
      this.form.zoning = this.listRegions[1]
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.isReadonly = false
      this.listRegions = []
      this.form = { ...bunk }
      this.form.create_user = this.sysUser.id
    },
    create(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          const apiUrl = allApi.organization.addData
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
        this.listRegions = [2, this.mulSelection[0].zoning]
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
          const apiUrl = allApi.organization.updateData
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
          const apiUrl = allApi.organization.delData
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
      this.listRegions = [2, row.zoning]
      for (const key in this.form) {
        this.form[key] = row[key]
      }
    },
    handleOlder() {
      if (this.mulSelection.length === 1) {
        this.dialogOldShow = true
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
    handleOldback(data) {
      console.log(this.form.id, data)
      this.dialogOldShow = false
      if (data === null) return
      updateByCommunity(this.form.id, data).then(res => {
        this.handleQuery(this.currentPage, this.pageSize)
        this.$notify({
          title: '成功',
          message: '跟新老人成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    dialogOldClose() {
      this.dialogOldShow = false
    },
    handleAddress() {
      this.dialogMapShow = true
    },
    handleMapback(data) {
      this.dialogMapShow = false
      this.form.datAddress = data.address
      this.form.longitudeLatitude = data.lnglat
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
.custom-tree-node {
  .svg-icon {
    color: #2095ed;
  }
}

.el-tab-pane {
  min-height: 300px;
  .el-radio-group {
    .el-radio {
      line-height: 36px;
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

.avatar-user {
  float: right;
  width: 372px;
}
</style>
