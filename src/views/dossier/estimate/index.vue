<template>
  <div class="main-container">
    <div class="filter-container">
      <el-input class="filter-input"
        placeholder="请输入姓名"
        style="width: 280px;margin-right: 20px;"
        v-model="listQuery.reserve1">
        <template slot="prepend">姓名</template>
      </el-input>
      <el-input class="filter-input"
        placeholder="请输入身份证号"
        style="width: 280px;margin-right: 20px;"
        v-model="listQuery.reserve2">
        <template slot="prepend">身份证号</template>
      </el-input>
      <div class="select">
        <div class="type">
          居住社区
        </div>
        <el-cascader clearable
          v-model="listQuarters"
          :options="bunkOptions"
          :show-all-levels="false"
          @change="handleCascader"
          filterable>
        </el-cascader>
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
      <el-table-column label="老人姓名"
        :show-overflow-tooltip="true"
        prop="customer.oldName"
        align="center">
      </el-table-column>
      <el-table-column label="证件号码"
        :show-overflow-tooltip="true"
        prop="customer.idNumber"
        align="center">
      </el-table-column>
      <el-table-column label="评估原因"
        :show-overflow-tooltip="true"
        prop="reserve1"
        align="center">
      </el-table-column>
      <el-table-column label="所属街道"
        :show-overflow-tooltip="true"
        prop="reserve3"
        align="center">
      </el-table-column>
      <el-table-column label="居住社区"
        :show-overflow-tooltip="true"
        prop="reserve2"
        align="center">
      </el-table-column>
      <el-table-column label="居住地址"
        :show-overflow-tooltip="true"
        prop="customer.address"
        align="center"
        width="240">
      </el-table-column>
      <el-table-column label="联系电话"
        :show-overflow-tooltip="true"
        prop="customer.telephone"
        align="center">
      </el-table-column>
      <el-table-column label="评估提交时间"
        :show-overflow-tooltip="true"
        prop="create_time"
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
      width="1200px">
      <el-form :inline="true"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="110px">
        <el-form-item label="老人"
          prop="cId"
          style="margin-bottom: 20px;">
          <el-input v-if="dialogStatus=='create'"
            v-model="clientName"
            placeholder="请输入老人"
            @focus="handleOlder"
            style="width: 240px;"></el-input>
          <el-input v-else
            readonly
            v-model="clientName"
            placeholder="请输入老人"
            style="width: 240px;"></el-input>
        </el-form-item>
        <el-form-item label="评估原因"
          prop="evaluationState">
          <el-select class="filter-item"
            clearable
            v-model="form.evaluationState"
            placeholder="请选择"
            style="width: 240px"
            :disabled="isReadonly">
            <el-option v-for="item in options.evaluationState"
              :key="item.val"
              :label="item.dataKey"
              :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="慢性病"
          prop="tihhtle">
          <el-checkbox-group v-model="checkList.evaluationA"
            style="width: 1010px"
            :disabled="isReadonly">
            <div v-for="(item, index) in options.evaluationA"
              :key="index"
              class="groupbox">
              <el-checkbox :label="item.val">
                {{ item.dataKey }}
              </el-checkbox>
            </div>
            <div style="clear: both;"></div>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="重大疾病"
          prop="tihhtle">
          <el-checkbox-group v-model="checkList.evaluationApply"
            style="width: 1010px"
            :disabled="isReadonly">
            <div v-for="(item, index) in options.evaluationApply"
              :key="index"
              class="groupbox">
              <el-checkbox :label="item.val">
                {{ item.dataKey }}
              </el-checkbox>
            </div>
            <div style="clear: both;"></div>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="精神疾病"
          prop="tihhtle">
          <el-checkbox-group v-model="checkList.evaluationComplete"
            style="width: 1010px"
            :disabled="isReadonly">
            <div v-for="(item, index) in options.evaluationComplete"
              :key="index"
              class="groupbox">
              <el-checkbox :label="item.val">
                {{ item.dataKey }}
              </el-checkbox>
            </div>
            <div style="clear: both;"></div>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="痴呆"
          prop="tihhtle">
          <el-radio-group v-model="form.evaluationGarde"
            style="width: 425px"
            :disabled="isReadonly">
            <div v-for="(item, index) in options.evaluationGarde"
              :key="index"
              class="groupbox">
              <el-radio :label="item.val">
                {{ item.dataKey }}
              </el-radio>
            </div>
            <div style="clear: both;"></div>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="康复状况"
          prop="tihhtle">
          <el-radio-group v-model="form.evaluationOrg"
            style="width: 425px"
            :disabled="isReadonly">
            <div v-for="(item, index) in options.evaluationOrg"
              :key="index"
              class="groupbox">
              <el-radio :label="item.val">
                {{ item.dataKey }}
              </el-radio>
            </div>
            <div style="clear: both;"></div>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="支付方式"
          prop="tihhtle">
          <el-radio-group v-model="form.evaluationFee"
            style="width: 1010px"
            :disabled="isReadonly">
            <div v-for="(item, index) in options.evaluationFee"
              :key="index"
              class="groupbox">
              <el-radio :label="item.val">
                {{ item.dataKey }}
              </el-radio>
            </div>
            <div style="clear: both;"></div>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="申请对象"
          prop="tihhtle">
          <el-checkbox-group v-model="checkList.evaluationB"
            style="width: 1010px"
            :disabled="isReadonly">
            <div v-for="(item, index) in options.evaluationB"
              :key="index"
              class="groupbox">
              <el-checkbox :label="item.val">
                {{ item.dataKey }}
              </el-checkbox>
            </div>
            <div style="clear: both;"></div>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="居家养老"
          prop="tihhtle">
          <el-checkbox-group v-model="checkList.evaluationTotalA"
            style="width: 1010px"
            :disabled="isReadonly">
            <div v-for="(item, index) in options.serviceType"
              :key="index"
              class="groupbox">
              <el-checkbox :label="item.val">
                {{ item.dataKey }}
              </el-checkbox>
            </div>
            <div style="clear: both;"></div>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="机构养老"
          prop="tihhtle">
          <el-checkbox-group v-model="checkList.evaluationTotalB"
            style="width: 425px"
            :disabled="isReadonly">
            <div v-for="(item, index) in options.organType"
              :key="index"
              class="groupbox">
              <el-checkbox :label="item.val">
                {{ item.dataKey }}
              </el-checkbox>
            </div>
            <div style="clear: both;"></div>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="是否申请补贴"
          prop="tihhtle">
          <el-radio-group v-model="form.sqylfwbt"
            style="width: 425px"
            :disabled="isReadonly">
            <div v-for="(item, index) in options.basicYesNo"
              :key="index"
              class="groupbox">
              <el-radio :label="item.val">
                {{ item.dataKey }}
              </el-radio>
            </div>
            <div style="clear: both;"></div>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="居住环境"
          prop="tihhtle">
          <el-radio-group v-model="form.juzhuhj"
            style="width: 425px"
            :disabled="isReadonly">
            <div v-for="(item, index) in options.evaluationZhuKA"
              :key="index"
              class="groupbox">
              <el-radio :label="item.val">
                {{ item.dataKey }}
              </el-radio>
            </div>
            <div style="clear: both;"></div>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="居住条件"
          prop="tihhtle">
          <el-radio-group v-model="form.juzhutj"
            style="width: 425px"
            :disabled="isReadonly">
            <div v-for="(item, index) in options.evaluationZhuKB"
              :key="index"
              class="groupbox">
              <el-radio :label="item.val">
                {{ item.dataKey }}
              </el-radio>
            </div>
            <div style="clear: both;"></div>
          </el-radio-group>
        </el-form-item>
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
  delLotRecord,
  findByDicCode
} from '@/api/page'
import { allApi } from '@/api/config'
import gouldMap from '@/components/GouldMap'
import olderOptions from './older'
import { mapGetters } from 'vuex'

const notes = {
  id: null,
  cId: '',
  evaluationNum: '',
  evaluationState: '',
  evaluationFee: '',
  evaluationApply: '',
  evaluationComplete: '',
  evaluationGarde: '',
  evaluationOrg: '',
  evaluationA: '',
  evaluationB: '',
  jujiayl: '',
  jigouyl: '',
  sqylfwbt: '',
  juzhuhj: '',
  juzhutj: ''
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
    olderOptions
  },
  data() {
    return {
      list,
      btnPowers: null,
      updateImgUrl: allApi.updateImg,
      checkList: {
        evaluationA: [],
        evaluationApply: [],
        evaluationComplete: [],
        evaluationB: [],
        evaluationTotalA: [],
        evaluationTotalB: []
      },
      listQuarters: [],
      bunkOptions: [],
      options: {
        evaluationState: [],
        evaluationA: [],
        evaluationApply: [],
        evaluationComplete: [],
        evaluationB: [],
        evaluationOrg: [],
        evaluationFee: [],
        evaluationGarde: [],
        serviceType: [],
        organType: [],
        basicYesNo: [],
        evaluationZhuKA: [],
        evaluationZhuKB: []
      },
      listQuery: {
        reserve1: '',
        reserve2: ''
      },
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
        cId: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          }
        ],
        evaluationState: [
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
      findByDicCode('evaluationState').then(response => {
        this.options.evaluationState = response.data.dataList
      })

      findByDicCode('evaluationAa').then(response => {
        this.options.evaluationA = response.data.dataList
      })

      findByDicCode('evaluationApply').then(response => {
        this.options.evaluationApply = response.data.dataList
      })

      findByDicCode('evaluationB').then(response => {
        this.options.evaluationB = response.data.dataList
      })

      findByDicCode('evaluationComplete').then(response => {
        this.options.evaluationComplete = response.data.dataList
      })

      findByDicCode('evaluationFee').then(response => {
        this.options.evaluationFee = response.data.dataList
      })

      findByDicCode('evaluationGarde').then(response => {
        this.options.evaluationGarde = response.data.dataList
      })

      findByDicCode('evaluationOrg').then(response => {
        this.options.evaluationOrg = response.data.dataList
      })

      findByDicCode('jujiayl').then(response => {
        this.options.serviceType = response.data.dataList
      })

      findByDicCode('jigouyl').then(response => {
        this.options.organType = response.data.dataList
      })

      findByDicCode('basicYesNo').then(response => {
        this.options.basicYesNo = response.data.dataList
      })

      findByDicCode('juzhuhj').then(response => {
        this.options.evaluationZhuKA = response.data.dataList
      })

      findByDicCode('juzhutj').then(response => {
        this.options.evaluationZhuKB = response.data.dataList
      })
    },
    handleAvatar(res, file) {
      console.log(file)
      this.form.olderImg = res.imgUrl
    },
    handleCascader() {
      console.log(this.listQuarters[1])
    },
    handleQuery(currentPage, pageSize) {
      this.currentPage = 1
      if (currentPage) this.currentPage = currentPage
      const apiUrl = allApi.evaluationrecord.getList
      getRecordList(apiUrl, {
        page: this.currentPage,
        pageSize: this.pageSize,
        create_user: this.sysUser.id,
        roleId: this.sysUser.roleId,
        reserve1: this.listQuery.reserve1,
        reserve2: this.listQuery.reserve2,
        reserve3: this.listQuarters[2]
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
      this.clientName = ''
      this.checkList.evaluationA = []
      this.checkList.evaluationApply = []
      this.checkList.evaluationComplete = []
      this.checkList.evaluationB = []
      this.checkList.evaluationTotalA = []
      this.checkList.evaluationTotalB = []
    },
    create(formName) {
      this.form.evaluationA = this.checkList.evaluationA.join()
      this.form.evaluationApply = this.checkList.evaluationApply.join()
      this.form.evaluationComplete = this.checkList.evaluationComplete.join()
      this.form.evaluationB = this.checkList.evaluationB.join()
      this.form.jujiayl = this.checkList.evaluationTotalA.join()
      this.form.jigouyl = this.checkList.evaluationTotalB.join()

      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          const apiUrl = allApi.evaluationrecord.addData
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

        const row = this.mulSelection[0]
        this.clientName = row.customer ? row.customer.oldName : ''
        this.form.evaluationGarde = parseInt(this.form.evaluationGarde)
        this.form.evaluationOrg = parseInt(this.form.evaluationOrg)
        this.form.sqylfwbt = parseInt(this.form.sqylfwbt)
        this.form.juzhuhj = parseInt(this.form.juzhuhj)
        this.form.juzhutj = parseInt(this.form.juzhutj)
        this.checkList.evaluationA = this.form.evaluationA
          ? this.form.evaluationA.split(',').map(i => parseInt(i))
          : []
        this.checkList.evaluationApply = this.form.evaluationApply
          ? [this.form.evaluationApply.substring(0, 3)]
          : []
        this.checkList.evaluationComplete = this.form.evaluationComplete
          ? this.form.evaluationComplete.split(',').map(i => parseInt(i))
          : []
        this.checkList.evaluationB = this.form.evaluationB
          ? this.form.evaluationB.split(',').map(i => parseInt(i))
          : []
        this.checkList.evaluationTotalA = this.form.jujiayl
          ? this.form.jujiayl.split(',').map(i => parseInt(i))
          : []
        this.checkList.evaluationTotalB = this.form.jigouyl
          ? this.form.jigouyl.split(',').map(i => parseInt(i))
          : []
      } else {
        this.$message({
          type: 'warning',
          message: '请选择一条记录'
        })
      }
    },
    update(formName) {
      this.form.evaluationA = this.checkList.evaluationA.join()
      this.form.evaluationApply = this.checkList.evaluationApply.join()
      this.form.evaluationComplete = this.checkList.evaluationComplete.join()
      this.form.evaluationB = this.checkList.evaluationB.join()
      this.form.jujiayl = this.checkList.evaluationTotalA.join()
      this.form.jigouyl = this.checkList.evaluationTotalB.join()

      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          const apiUrl = allApi.evaluationrecord.updateData
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
          const apiUrl = allApi.evaluationrecord.delData
          const ids = this.mulSelection.reduce((res, item) => {
            return res.concat([item.id])
          }, [])
          delLotRecord(apiUrl, ids.join()).then(res => {
            this.handleQuery(this.currentPage, this.pageSize)
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
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

      this.clientName = row.customer ? row.customer.oldName : ''
      this.form.evaluationGarde = parseInt(this.form.evaluationGarde)
      this.form.evaluationOrg = parseInt(this.form.evaluationOrg)
      this.form.sqylfwbt = parseInt(this.form.sqylfwbt)
      this.form.juzhuhj = parseInt(this.form.juzhuhj)
      this.form.juzhutj = parseInt(this.form.juzhutj)
      this.checkList.evaluationA = this.form.evaluationA
        ? this.form.evaluationA.split(',').map(i => parseInt(i))
        : []
      this.checkList.evaluationApply = this.form.evaluationApply
        ? [this.form.evaluationApply.substring(0, 3)]
        : []
      this.checkList.evaluationComplete = this.form.evaluationComplete
        ? this.form.evaluationComplete.split(',').map(i => parseInt(i))
        : []
      this.checkList.evaluationB = this.form.evaluationB
        ? this.form.evaluationB.split(',').map(i => parseInt(i))
        : []
      this.checkList.evaluationTotalA = this.form.jujiayl
        ? this.form.jujiayl.split(',').map(i => parseInt(i))
        : []
      this.checkList.evaluationTotalB = this.form.jigouyl
        ? this.form.jigouyl.split(',').map(i => parseInt(i))
        : []
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
    handleOlder() {
      this.dialogOldShow = true
    },
    handleOldback(data) {
      this.clientName = data.replace(/[\d-]/g, '')
      this.form.cId = parseInt(data)
      this.dialogOldShow = false
    },
    dialogOldClose() {
      this.dialogOldShow = false
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
.groupbox {
  float: left;
  height: 40px;
  margin-right: 10px;
  .el-radio {
    line-height: 36px !important;
  }
}

.el-form-item /deep/ {
  margin-bottom: 1px;
  .el-radio__input.is-disabled.is-checked {
    .el-radio__inner {
      background-color: #409eff;
      border-color: #409eff;
      &::after {
        background-color: #f5f7fa;
      }
    }
  }

  .el-checkbox__input.is-disabled.is-checked {
    .el-checkbox__inner {
      background-color: #409eff;
      border-color: #409eff;
    }
  }
}
</style>
