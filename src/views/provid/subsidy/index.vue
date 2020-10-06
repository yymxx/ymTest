<template>
  <div class="main-container">
    <div class="filter-container">
      <div class="select">
        <div class="type">
          有效标志
        </div>
        <el-select placeholder="请选择"
          v-model="listQuery.activeSign">
          <el-option v-for="item in signOptions"
            :key="item.val"
            :label="item.dataKey"
            :value="item.val"></el-option>
        </el-select>
      </div>
      <el-button type="primary"
        icon="el-icon-search"
        @click="handleQuery()">查询</el-button>
    </div>
    <el-table border
      :data="list"
      style="width: 100%;"
      ref="checkTable"
      @selection-change="handleSelectionChange">
      <el-table-column width="60"
        header-align="center"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="适用老人"
        prop="applicableElderly"
        align="center"
        width="390">
      </el-table-column>
      <el-table-column label="评估分"
        prop="assessmentScore"
        align="center">
      </el-table-column>
      <el-table-column label="市级"
        align="center">
        <el-table-column label="城镇补贴标准(元/月)"
          prop="citySubsidyStandard"
          align="center">
        </el-table-column>
        <el-table-column label="农村补贴标准(元/月)"
          prop="citycSubsidyStandard"
          align="center">
        </el-table-column>
        <el-table-column label="生效年月"
          prop="cEffectiveYears"
          align="center">
        </el-table-column>
        <el-table-column label="市财政分期比"
          prop="sharingRatio"
          align="center">
        </el-table-column>
      </el-table-column>
      <el-table-column label="区级"
        align="center">
        <el-table-column label="城镇补贴标准(元/月)"
          prop="areaSubsidyStandard"
          align="center">
        </el-table-column>
        <el-table-column label="农村补贴标准(元/月)"
          prop="areacSubsidyStandard"
          align="center">
        </el-table-column>
        <el-table-column label="生效年月"
          prop="effectiveYears"
          align="center">
        </el-table-column>
      </el-table-column>
      <el-table-column label="有效标注"
        prop="effectiveSignStr"
        align="center">
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
      width="950px">
      <el-form :inline="true"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="160px">
        <el-form-item label="适用老人"
          prop="applicableElderly">
          <el-select class="filter-item"
            clearable
            v-model="form.applicableElderly"
            placeholder="请选择"
            style="width: 240px">
            <el-option v-for="item in olderOptions"
              :key="item.val"
              :label="item.dataKey"
              :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="评估分"
          prop="assessmentScore">
          <el-input v-model="form.assessmentScore"
            placeholder="请输入收费级别"
            style="width: 240px;"></el-input>
        </el-form-item>
        <el-form-item label="市级城镇补贴标准"
          prop="citySubsidyStandard">
          <el-input type="number"
            v-model="form.citySubsidyStandard"
            style="width: 240px;"></el-input>
        </el-form-item>
        <el-form-item label="市级农村补贴标准"
          prop="citycSubsidyStandard">
          <el-input type="number"
            v-model="form.citycSubsidyStandard"
            style="width: 240px;"></el-input>
        </el-form-item>
        <el-form-item label="市财政分担比"
          prop="sharingRatio">
          <el-input v-model="form.sharingRatio"
            placeholder="请输入收费级别"
            style="width: 240px;"></el-input>
        </el-form-item>
        <el-form-item label="市级生效年月"
          prop="cEffectiveYears">
          <el-date-picker type="date"
            v-model="form.cEffectiveYears"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            style="width: 240px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="区级城镇补贴标准"
          prop="areaSubsidyStandard">
          <el-input type="number"
            v-model="form.areaSubsidyStandard"
            style="width: 240px;"></el-input>
        </el-form-item>
        <el-form-item label="区级农村补贴标准"
          prop="areacSubsidyStandard">
          <el-input type="number"
            v-model="form.areacSubsidyStandard"
            style="width: 240px;"></el-input>
        </el-form-item>
        <el-form-item label="区级生效年月"
          prop="effectiveYears">
          <el-date-picker type="date"
            v-model="form.effectiveYears"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            style="width: 240px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="有效标志"
          prop="effectiveSign">
          <el-select class="filter-item"
            clearable
            v-model="form.effectiveSign"
            placeholder="请选择"
            style="width: 240px">
            <el-option v-for="item in signOptions"
              :key="item.val"
              :label="item.dataKey"
              :value="item.val"></el-option>
          </el-select>
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

    <el-dialog :title="detailTop.title"
      :width="detailTop.width"
      :visible.sync="dialogIsDetail"
      @close="dialogDetailClose()"
      :close-on-click-modal="false">
      <subsidy-detail v-if="dialogIsDetail"
        :row-data="listHandlerRow"
        @setGoback="handleGoback"></subsidy-detail>
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
import subsidyDetail from './areas'

const notes = {
  id: null,
  applicableElderly: '',
  assessmentScore: '',
  citySubsidyStandard: '',
  citycSubsidyStandard: '',
  areaSubsidyStandard: '',
  areacSubsidyStandard: '',
  cEffectiveYears: 0,
  effectiveYears: '',
  effectiveSign: ''
}

const list = [
  {
    id: '1'
  }
]

export default {
  name: 'HelloWorld',
  components: {
    subsidyDetail
  },
  data() {
    return {
      list,
      btnPowers: null,
      olderOptions: [],
      signOptions: [],
      listQuery: {
        activeSign: ''
      },
      mulSelection: [],
      currentPage: 1,
      pageSize: 10,
      totalOlders: 30,
      listHandlerRow: null,
      dialogIsDetail: false,
      detailTop: {
        width: '1200px',
        title: '区级补贴'
      },
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
        create: '创建'
      }
    }
  },
  created() {
    this.btnPowers = this.$route.meta.btnList
    console.log('btnPowers', this.btnPowers)

    this.findDicList()
    this.handleQuery(this.currentPage, this.pageSize)
  },
  methods: {
    findDicList() {
      findByDicCode('effectiveSign').then(response => {
        this.signOptions = response.data.dataList
      })

      findByDicCode('districtType').then(response => {
        this.olderOptions = response.data.dataList
      })
    },
    handleQuery(currentPage, pageSize) {
      this.currentPage = 1
      if (currentPage) this.currentPage = currentPage
      const apiUrl = allApi.subsidystandard.getList
      getRecordList(apiUrl, {
        page: this.currentPage,
        pageSize: this.pageSize,
        effectiveSign: this.listQuery.activeSign
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
      this.form = { ...notes }
    },
    create(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          const apiUrl = allApi.subsidystandard.addData
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
          const apiUrl = allApi.subsidystandard.updateData
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
          const apiUrl = allApi.subsidystandard.delData
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
      this.dialogIsDetail = true
      this.listHandlerRow = row
    },
    handleGoback(data) {
      this.detailTop.width = data[0]
      this.detailTop.title = data[1]
    },
    dialogDetailClose() {
      this.dialogIsDetail = false
      this.detailTop = {
        width: '1200px',
        title: '区级补贴'
      }
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
.el-table /deep/ {
  .is-group {
    th {
      background: #fff;
    }
  }
}
</style>
