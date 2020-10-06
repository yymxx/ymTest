<template>
  <div class="main-container">
    <older-detail v-if="isDetail"
      :own-path="ownPath"
      @setGoback="handleGoback"></older-detail>
    <div v-else
      class="dept-container">
      <div style="padding-right: 15px;">
        <el-card>
          <div slot="header">
            <span>蔡甸区</span>
          </div>
          <div class="dept-tree">
            <el-tree ref="tree"
              node-key="id"
              :data="deptList"
              :props="defaultProps"
              highlight-current
              auto-expand-parent
              :default-expanded-keys="[2]"
              @node-click="handleNodeClick"
              :expand-on-click-node="false">
              <span class="custom-tree-node"
                slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
              </span>
            </el-tree>
          </div>
        </el-card>
      </div>
      <div class="dept-wrapper">
        <div class="filter-container"
          style="width: 990px;">
          <el-input class="filter-input"
            placeholder="请输入老人姓名"
            style="width: 280px;margin-right: 20px;"
            v-model="listQuery.oldName">
            <template slot="prepend">老人姓名</template>
          </el-input>
          <el-input class="filter-input"
            placeholder="请输入证件号码"
            style="width: 280px;margin-right: 20px;"
            v-model="listQuery.idNumber">
            <template slot="prepend">证件号码</template>
          </el-input>
          <div class="select">
            <div class="type">性别</div>
            <el-select placeholder="请选择"
              v-model="listQuery.sex">
              <el-option v-for="item in options.gender"
                :key="item.val"
                :label="item.dataKey"
                :value="item.val"></el-option>
            </el-select>
          </div>
          <el-input class="filter-input"
            style="width: 175px;margin-right: 6px;"
            v-model="listQuery.strAge">
            <template slot="prepend">年龄范围</template>
          </el-input>
          <div style="display: inline-block;height: 40px;line-height: 40px;">至</div>
          <el-input v-model="listQuery.endAge"
            style="width: 75px;margin: 0 20px 0 6px;"></el-input>
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
              @click="handleIntoExcel()">批量导入</el-button>
          </span>
          <span class="excel-wrapper">
            <el-button type="warning"
              icon="el-icon-edit"
              @click="handleOutExcel()">导出</el-button>
          </span>
        </div>
        <el-table border
          :data="list"
          style="width: 100%;"
          ref="checkTable"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection"
            header-align="center"
            align="center"
            width="70">
          </el-table-column>
          <el-table-column label="姓名"
            :show-overflow-tooltip="true"
            prop="oldName"
            align="center">
          </el-table-column>
          <el-table-column label="证件号码"
            :show-overflow-tooltip="true"
            prop="idNumber"
            align="center">
          </el-table-column>
          <el-table-column label="出生日期"
            :show-overflow-tooltip="true"
            prop="birthday"
            align="center">
          </el-table-column>
          <el-table-column label="年龄"
            :show-overflow-tooltip="true"
            prop="age"
            align="center">
          </el-table-column>
          <el-table-column label="性别"
            :show-overflow-tooltip="true"
            prop="sexStr"
            align="center">
          </el-table-column>
          <el-table-column label="联系电话"
            :show-overflow-tooltip="true"
            prop="telephone"
            align="center">
          </el-table-column>
          <el-table-column label="机构"
            :show-overflow-tooltip="true"
            prop="reserve2"
            align="center">
          </el-table-column>
          <el-table-column label="老年卡号"
            :show-overflow-tooltip="true"
            prop="oldcard"
            align="center">
          </el-table-column>
          <el-table-column label="居住地址"
            :show-overflow-tooltip="true"
            prop="currentAddress"
            align="center"
            width="240">
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
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="pageSize"
            layout="total, prev, pager, next, sizes"
            :total="totalOlders"></el-pagination>
        </div>
      </div>
    </div>

    <el-dialog :title="textMap[dialogStatus]"
      @close="clearFormValidate('form')"
      :visible.sync="dialogFormVisible"
      width="1180px">
      <el-form :inline="true"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="115px">
        <el-form-item label="姓名"
          prop="oldName">
          <el-input v-model="form.oldName"
            maxlength="10"
            placeholder="请输入姓名"
            style="width: 240px;"></el-input>
        </el-form-item>
        <el-form-item label="人员类型"
          prop="personnelType">
          <el-select class="filter-item"
            clearable
            v-model="form.personnelType"
            placeholder="请选择"
            style="width: 240px">
            <el-option v-for="item in options.personType"
              :key="item.val"
              :label="item.dataKey"
              :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <span class="avatar-box avatar-user">
          <el-form-item label="照片">
            <el-upload class="avatar-uploader"
              :action="updateImgUrl"
              accept="image/*"
              :show-file-list="false"
              :on-success="handleAvatar">
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div v-if="form.photo"
              class="avatar-uploader">
              <img :src="form.photo"
                class="avatar">
            </div>
          </el-form-item>
        </span>
        <el-form-item label="联系电话">
          <el-input v-model="form.telephone"
            maxlength="11"
            placeholder="请输入联系电话"
            style="width: 240px;"></el-input>
        </el-form-item>
        <el-form-item label="亲属电话">
          <el-input v-model="form.reservephone"
            placeholder="请输入预留电话"
            style="width: 240px;"></el-input>
        </el-form-item>
        <el-form-item label="证件类型"
          prop="idType">
          <el-select class="filter-item"
            clearable
            v-model="form.idType"
            placeholder="请选择"
            style="width: 240px">
            <el-option v-for="item in options.idType"
              :key="item.val"
              :label="item.dataKey"
              :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证件号码"
          prop="idNumber">
          <el-input v-model="form.idNumber"
            minlength="18"
            placeholder="请输入证件号码"
            @blur="getInfoFromCard()"
            style="width: 240px;"></el-input>
        </el-form-item>
        <el-form-item label="出生日期"
          prop="birthday">
          <el-date-picker type="date"
            :picker-options="pickerOptions"
            v-model="form.birthday"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            style="width: 240px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="性别"
          prop="sex">
          <el-select class="filter-item"
            clearable
            v-model="form.sex"
            placeholder="请选择"
            style="width: 240px">
            <el-option v-for="item in options.gender"
              :key="item.val"
              :label="item.dataKey"
              :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="婚姻状况"
          prop="maritalStatus">
          <el-select class="filter-item"
            clearable
            v-model="form.maritalStatus"
            placeholder="请选择"
            style="width: 240px">
            <el-option v-for="item in options.maritalStatus"
              :key="item.val"
              :label="item.dataKey"
              :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文化程度"
          prop="education">
          <el-select class="filter-item"
            clearable
            v-model="form.education"
            placeholder="请选择"
            style="width: 240px">
            <el-option v-for="item in options.education"
              :key="item.val"
              :label="item.dataKey"
              :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名族"
          prop="cusNational">
          <el-select class="filter-item"
            clearable
            v-model="form.cusNational"
            placeholder="请选择"
            style="width: 240px">
            <el-option v-for="item in options.cusNational"
              :key="item.val"
              :label="item.dataKey"
              :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否本地户籍"
          prop="isLocal">
          <el-select class="filter-item"
            clearable
            v-model="form.isLocal"
            placeholder="请选择"
            style="width: 240px">
            <el-option v-for="item in options.yesNo"
              :key="item.val"
              :label="item.dataKey"
              :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="户口性质"
          prop="householdRegister">
          <el-select class="filter-item"
            clearable
            v-model="form.householdRegister"
            placeholder="请选择"
            style="width: 240px">
            <el-option v-for="item in options.householdRegister"
              :key="item.val"
              :label="item.dataKey"
              :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="户籍社区">
          <el-cascader filterable
            v-model="rustic.censusRegister"
            :options="rustic.options"
            @change="handleCommunity('censusRegister')"
            style="width: 240px"></el-cascader>
        </el-form-item>
        <el-form-item label="户籍地址">
          <el-input v-model="form.address"
            placeholder="请输入户籍地址"
            style="width: 500px;"></el-input>
          <span class="seat-map"
            @click="handleAddress('address')">
            <svg-icon icon-class="seat"></svg-icon>
            <span>选择地址</span>
          </span>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='update'"
          label="居住社区">
          <el-cascader filterable
            v-model="rustic.community"
            :options="rustic.options"
            @change="handleCommunity('community')"
            style="width: 240px"></el-cascader>
        </el-form-item>
        <el-form-item label="居住地址">
          <el-input v-model="form.currentAddress"
            placeholder="请输入居住地址"
            style="width: 500px;"></el-input>
          <span class="seat-map"
            @click="handleAddress('currentAddress')">
            <svg-icon icon-class="seat"></svg-icon>
            <span>选择地址</span>
          </span>
        </el-form-item>
        <el-form-item label="老年卡号"
          prop="oldcard">
          <el-input v-model="form.oldcard"
            placeholder="请输入老年卡号"
            style="width: 170px;"></el-input>
          <div class="card-reader">
            <card-reader incident="older"
              @setGoback="handleCardback"></card-reader>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'"
          type="primary"
          @click="create('form')">确 定</el-button>
        <el-button v-else
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

    <el-dialog width="600px"
      title="批量导入老人"
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
import olderDetail from './detail'
import gouldMap from '@/components/GouldMap'
import cardReader from '@/components/CardReader'
import {
  getOlderList,
  addOlder,
  updateOlder,
  delOlder,
  importExcelData
} from '@/api/older'
import { getRecordList, findByDicCode } from '@/api/page'
import { allApi } from '@/api/config'
import { getBirthdayFromCard, getSexFromCard } from '@/utils/idcard'
import { mapGetters } from 'vuex'

const older = {
  id: null,
  orgid: '1',
  oldName: '',
  sex: '',
  idType: '',
  idNumber: '',
  oldcard: '',
  birthday: '',
  isLocal: '',
  censusRegister: '',
  address: '',
  community: '',
  currentAddress: '',
  personnelType: '',
  telephone: '',
  photo: '',
  reservephone: '',
  create_user: '',
  cusCity: '武汉市',
  cusArea: '',
  cusStreet: '',
  education: '',
  householdRegister: '',
  maritalStatus: '',
  cusNational: ''
}

const outObj = {
  oldName: '老人名字',
  age: '年龄',
  sexStr: '性别',
  birthday: '出生日期',
  idTypeStr: '证件类型',
  idNumber: '证件号码',
  telephone: '联系电话',
  oldcard: '老人卡号',
  reserve2: '机构',
  address: '户籍地址',
  reserve1: '居住社区',
  currentAddress: '居住地址'
}

const options = {
  yesNo: [],
  gender: [],
  idType: [],
  personType: [],
  education: [],
  cusNational: [],
  householdRegister: [],
  maritalStatus: []
}

export default {
  name: 'HelloWorld',
  components: {
    olderDetail,
    gouldMap,
    cardReader
  },
  data() {
    const idCardValidate = (rule, value, callback) => {
      const temp = /\d{17}[\d|x]|\d{15}/
      if (value && !temp.test(value)) {
        callback(new Error('身份证号码不符合规范'))
      } else {
        callback()
      }
    }

    return {
      outObj,
      btnPowers: null,
      updateImgUrl: allApi.updateImg,
      addressKey: '',
      currDept: null,
      deptList: [],
      defaultProps: {
        children: 'children',
        label: 'addressName'
      },
      list: [],
      options,
      listQuery: {
        oldName: '',
        idNumber: '',
        sex: '',
        strAge: '',
        endAge: '',
        community: ''
      },
      excelList: [],
      mulSelection: [],
      rustic: {
        options: [],
        community: [],
        censusRegister: []
      },
      currentPage: 1,
      pageSize: 10,
      totalOlders: 80,
      isDetail: false,
      ownPath: this.$route.path,
      listHandlerRow: null,
      dialogMapShow: false,
      dialogLotShow: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      form: { ...older },
      rules: {
        oldName: [
          {
            required: true,
            message: '请输入老人姓名',
            trigger: 'blur'
          }
        ],
        sex: [
          {
            required: true,
            message: '请输入性别',
            trigger: 'blur'
          }
        ],
        birthday: [
          {
            required: true,
            message: '请输入日期',
            trigger: 'blur'
          }
        ],
        idNumber: [
          {
            required: true,
            trigger: 'blur',
            validator: idCardValidate
          }
        ]
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      }
    }
  },
  computed: {
    ...mapGetters(['sysUser'])
  },
  mounted() {
    this.btnPowers = this.$route.meta.btnList
    console.log('btnPowers', this.btnPowers)

    this.findDicList()
    this.handleQuery(this.currentPage, this.pageSize)
    if (this.$route.query.olderId) {
      this.isDetail = true
    }

    console.log(this.sysUser)

    // const apiUrl = allApi.addresstable.getUserList
    // getRecordList(apiUrl, {
    //   id: this.sysUser.institutionsId
    // }).then(response => {
    //   console.log(222, response)
    //   this.deptList = response.data
    // })

    getRecordList(allApi.addresstable.getList, {}).then(response => {
      console.log(222, response)
      this.deptList = response.data.dataList
      this.rustic.options = this.handleHigher(this.deptList)
    })
  },
  methods: {
    handleOwnClick(click, row) {
      this[click](row)
    },
    handleAvatar(res, file) {
      console.log(file)
      this.form.photo = res.imgUrl
    },
    findDicList() {
      findByDicCode('sex').then(response => {
        this.options.gender = response.data.dataList
      })

      findByDicCode('basicYesNo').then(response => {
        this.options.yesNo = response.data.dataList
      })

      findByDicCode('idcardType').then(response => {
        this.options.idType = response.data.dataList
      })

      findByDicCode('personnelType').then(response => {
        this.options.personType = response.data.dataList
      })

      findByDicCode('education').then(response => {
        this.options.education = response.data.dataList
      })

      findByDicCode('householdRegister').then(response => {
        this.options.householdRegister = response.data.dataList
      })

      findByDicCode('cusNational').then(response => {
        this.options.cusNational = response.data.dataList
      })

      findByDicCode('maritalStatus').then(response => {
        this.options.maritalStatus = response.data.dataList
      })
    },
    handleNodeClick(data) {
      this.currDept = data
      if (this.currDept && this.currDept.pid !== 0) {
        this.handleQuery()
      } else {
        this.currDept = null
        this.handleQuery()
      }
    },
    handleCommunity(val) {
      if (val === 'censusRegister') {
        this.form.censusRegister = this.rustic.censusRegister.join()
      }

      if (val === 'community') {
        this.form.community = this.rustic.community[2]
        this.form.cusArea = this.rustic.community[0]
        this.form.cusStreet = this.rustic.community[1]
      }
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
    getInfoFromCard() {
      this.form.birthday = getBirthdayFromCard(this.form.idNumber)
      this.form.sex = getSexFromCard(this.form.idNumber)
    },
    handleQuery(currentPage, pageSize) {
      this.currentPage = 1
      if (currentPage) this.currentPage = currentPage

      const cusStreet = this.currDept
        ? !this.currDept.children
          ? this.deptList[0].children.find(i => i.id === this.currDept.pid)
          : this.currDept
        : null

      getOlderList(this.currentPage, this.pageSize, this.sysUser, {
        oldName: this.listQuery.oldName,
        idNumber: this.listQuery.idNumber,
        sex: this.listQuery.sex,
        strAge: this.listQuery.strAge,
        endAge: this.listQuery.endAge,
        community:
          this.currDept && !this.currDept.children ? this.currDept.id : '',
        cusStreet: cusStreet ? cusStreet.id : ''
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
    handleCardback(data) {
      this.form.oldcard = data
    },
    handleCreate() {
      if (this.currDept && !this.currDept.children) {
        const cusStreet = this.deptList[0].children.find(i => {
          return i.id === this.currDept.pid
        })
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.form = { ...older }
        this.form.community = this.currDept.id
        this.form.cusArea = this.deptList[0].id
        this.form.cusStreet = cusStreet ? cusStreet.id : ''
        this.rustic.censusRegister = []
        this.rustic.community = []
      } else {
        this.$message({
          type: 'warning',
          message: '请选择居住社区'
        })
      }
    },
    create(formName) {
      this.form.create_user = this.sysUser.id
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          addOlder(this.form).then(res => {
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
        for (const key in this.form) {
          this.form[key] = this.mulSelection[0][key]
        }

        this.form.maritalStatus = parseInt(this.form.maritalStatus)
        this.form.education = parseInt(this.form.education)
        this.form.cusNational = parseInt(this.form.cusNational)
        this.form.householdRegister = parseInt(this.form.householdRegister)

        this.rustic.censusRegister = this.form.censusRegister
          .split(',')
          .map(i => parseInt(i))

        this.rustic.community = [
          this.form.cusArea,
          this.form.cusStreet,
          this.form.community
        ].map(i => parseInt(i))
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
          updateOlder(this.form).then(res => {
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
          const ids = this.mulSelection.reduce((res, item) => {
            return res.concat([item.id])
          }, [])
          delOlder(ids.join()).then(res => {
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
      this.isDetail = true
      this.$router.push({
        path: this.ownPath,
        query: { olderId: row.id }
      })
    },
    handleGoback(data) {
      this.isDetail = false
    },
    handleAddress(val) {
      this.dialogMapShow = true
      this.addressKey = val
    },
    handleMapback(data) {
      this.dialogMapShow = false
      this.form[this.addressKey] = data.address
    },
    dialogMapClose() {
      this.dialogMapShow = false
    },
    handleIntoExcel() {
      this.dialogLotShow = true
    },
    intoExcel(e) {
      const files = e.target.files
      const rawFile = files[0]
      if (rawFile) {
        if (files[0].size / 1024 > 1024) {
          console.log('----')
        } else {
          let formData = new FormData()
          formData.append('idep', rawFile)
          this.dialogLotShow = false
          importExcelData(formData).then(res => {
            console.log('上传返回值：' + res)
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

          getOlderList(1, 2000, this.sysUser, {
            oldName: this.listQuery.oldName,
            idNumber: this.listQuery.idNumber,
            sex: this.listQuery.sex,
            strAge: this.listQuery.strAge,
            endAge: this.listQuery.endAge
          }).then(response => {
            const kkk = response.data.dataList
            console.log(kkk)
            vendor.export_json_to_excel(
              tHeader,
              kkk.map(v => filterVal.map(j => v[j])),
              '老人信息列表'
            )
          })
        })
      })
    },
    dialogLotClose() {
      this.dialogLotShow = false
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
  min-width: 350px;
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
  width: 400px;
}

.card-reader {
  display: inline-block;
  margin-left: 5px;
}
</style>
