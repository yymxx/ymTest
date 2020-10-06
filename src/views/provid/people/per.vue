<template>
  <div class="main-container">
    <div class="filter-container">
      <el-input class="filter-input"
        placeholder="请输入身份证号"
        style="width: 280px;margin-right: 20px;"
        v-model="listQuery.olderName">
        <template slot="prepend">身份证号</template>
      </el-input>
      <el-button type="primary"
        icon="el-icon-search"
        @click="handleQuery()">查询</el-button>
    </div>
    <el-card>
      <div slot="header">
        <span>基本信息</span>
      </div>
      <div class="user-detail"
        :style="{width: basicWidth}">
        <el-form :inline="true"
          :model="form"
          label-width="135px">
          <el-form-item label="姓名：">
            <label class="detail">{{ form.olderName }}</label>
          </el-form-item>
          <el-form-item label="性别：">
            <label class="detail">{{ form.olderName }}</label>
          </el-form-item>
          <span class="avatar-user">
            <el-form-item label="照片：">
              <div v-if="form.idCardImg">
                <img :src="form.idCardImg"
                  class="avatar">
              </div>
            </el-form-item>
          </span>
          <el-form-item label="证件类型：">
            <label class="detail">{{ form.olderName }}</label>
          </el-form-item>
          <el-form-item label="证件号码：">
            <label class="detail">{{ form.olderName }}</label>
          </el-form-item>
          <el-form-item label="出生日期：">
            <label class="detail">{{ form.olderName }}</label>
          </el-form-item>
          <el-form-item label="名族：">
            <label class="detail">{{ form.olderName }}</label>
          </el-form-item>
          <el-form-item label="文化程度：">
            <label class="detail">{{ form.olderName }}</label>
          </el-form-item>
          <el-form-item label="户籍类别：">
            <label class="detail">{{ form.olderName }}</label>
          </el-form-item>
          <el-form-item label="联系电话：">
            <label class="detail">{{ form.olderName }}</label>
          </el-form-item>
          <el-form-item label="网咯区域编号：">
            <label class="detail">{{ form.olderName }}</label>
          </el-form-item>
          <el-form-item label="居住环境：">
            <label class="detail">{{ form.olderName }}</label>
          </el-form-item>
          <el-form-item label="婚姻状况：">
            <label class="detail">{{ form.olderName }}</label>
          </el-form-item>
          <el-form-item label="户籍地址：">
            <label class="detail"
              style="width: 630px">{{ form.olderName }}</label>
          </el-form-item>
          <el-form-item label="居住地址：">
            <label class="detail"
              style="width: 630px">{{ form.olderName }}</label>
          </el-form-item>
        </el-form>
      </div>
      <el-tabs type="border-card">
        <el-tab-pane label="评估记录">
          <el-table border
            :data="list"
            style="width: 100%;">
            <el-table-column label="姓名"
              prop="drugName"
              align="center">
            </el-table-column>
            <el-table-column label="性别"
              prop="gender"
              align="center">
            </el-table-column>
            <el-table-column label="年龄"
              prop="age"
              align="center">
            </el-table-column>
            <el-table-column label="证件类型"
              prop="idCard"
              align="center">
            </el-table-column>
            <el-table-column label="证件号码"
              prop="idCard"
              align="center">
            </el-table-column>
            <el-table-column label="户籍社区"
              prop="carrytime"
              align="center">
            </el-table-column>
            <el-table-column label="户籍地址"
              prop="carryName"
              align="center">
            </el-table-column>
            <el-table-column label="居住社区"
              prop="carrytime"
              align="center">
            </el-table-column>
            <el-table-column label="居住地址"
              prop="carryName"
              align="center">
            </el-table-column>
            <el-table-column label="新增时间"
              prop="workerName"
              align="center">
            </el-table-column>
          </el-table>
          <div style="text-align: center;padding-top: 20px;">
            <el-pagination background
              hide-on-single-page
              @current-change="handleOneChange"
              :current-page.sync="currOnePage"
              :page-size="pageSize"
              layout="total, prev, pager, next"
              :total="totalOneNotes"></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="补贴发放记录">
          <el-table border
            :data="list"
            style="width: 100%;">
            <el-table-column label="姓名"
              prop="drugName"
              align="center">
            </el-table-column>
            <el-table-column label="性别"
              prop="gender"
              align="center">
            </el-table-column>
            <el-table-column label="年龄"
              prop="age"
              align="center">
            </el-table-column>
            <el-table-column label="证件类型"
              prop="idCard"
              align="center">
            </el-table-column>
            <el-table-column label="证件号码"
              prop="idCard"
              align="center">
            </el-table-column>
            <el-table-column label="迁移状态"
              prop="workerName"
              align="center">
            </el-table-column>
            <el-table-column label="户籍社区"
              prop="carrytime"
              align="center">
            </el-table-column>
            <el-table-column label="户籍地址"
              prop="carryName"
              align="center">
            </el-table-column>
            <el-table-column label="居住社区"
              prop="carrytime"
              align="center">
            </el-table-column>
            <el-table-column label="居住地址"
              prop="carryName"
              align="center">
            </el-table-column>
          </el-table>
          <div style="text-align: center;padding-top: 20px;">
            <el-pagination background
              hide-on-single-page
              @current-change="handleTwoChange"
              :current-page.sync="currTwoPage"
              :page-size="pageSize"
              layout="total, prev, pager, next"
              :total="totalTwoNotes"></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="余额清零记录">
          <el-table border
            :data="list"
            style="width: 100%;">
            <el-table-column label="姓名"
              prop="drugName"
              align="center">
            </el-table-column>
            <el-table-column label="性别"
              prop="gender"
              align="center">
            </el-table-column>
            <el-table-column label="年龄"
              prop="age"
              align="center">
            </el-table-column>
            <el-table-column label="证件类型"
              prop="idCard"
              align="center">
            </el-table-column>
            <el-table-column label="证件号码"
              prop="idCard"
              align="center">
            </el-table-column>
            <el-table-column label="迁移状态"
              prop="workerName"
              align="center">
            </el-table-column>
            <el-table-column label="户籍社区"
              prop="carrytime"
              align="center">
            </el-table-column>
            <el-table-column label="迁出户籍社区"
              prop="carrytime"
              align="center">
            </el-table-column>
            <el-table-column label="户籍地址"
              prop="carryName"
              align="center">
            </el-table-column>
            <el-table-column label="居住社区"
              prop="carrytime"
              align="center">
            </el-table-column>
            <el-table-column label="居住地址"
              prop="carryName"
              align="center">
            </el-table-column>
          </el-table>
          <div style="text-align: center;padding-top: 20px;">
            <el-pagination background
              hide-on-single-page
              @current-change="handleThreeChange"
              :current-page.sync="currThreePage"
              :page-size="pageSize"
              layout="total, prev, pager, next"
              :total="totalThreeNotes"></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="订单记录">
          <el-table border
            :data="list"
            style="width: 100%;">
            <el-table-column label="姓名"
              prop="drugName"
              align="center">
            </el-table-column>
            <el-table-column label="性别"
              prop="gender"
              align="center">
            </el-table-column>
            <el-table-column label="年龄"
              prop="age"
              align="center">
            </el-table-column>
            <el-table-column label="证件类型"
              prop="idCard"
              align="center">
            </el-table-column>
            <el-table-column label="证件号码"
              prop="idCard"
              align="center">
            </el-table-column>
            <el-table-column label="户籍社区"
              prop="carrytime"
              align="center">
            </el-table-column>
            <el-table-column label="户籍地址"
              prop="carryName"
              align="center">
            </el-table-column>
            <el-table-column label="居住社区"
              prop="carrytime"
              align="center">
            </el-table-column>
            <el-table-column label="居住地址"
              prop="carryName"
              align="center">
            </el-table-column>
            <el-table-column label="去世日期"
              prop="workerName"
              align="center">
            </el-table-column>
          </el-table>
          <div style="text-align: center;padding-top: 20px;">
            <el-pagination background
              hide-on-single-page
              @current-change="handleFourChange"
              :current-page.sync="currFourPage"
              :page-size="pageSize"
              layout="total, prev, pager, next"
              :total="totalFourNotes"></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
const older = {
  olderName: 'hhh',
  idCardImg: './static/images/piccc.jpg'
}

const list = [
  {
    id: '',
    orgContent: '蔡甸养老院',
    olderId: '',
    olderName: 'hhh',
    drugName: '感冒灵',
    dosage: 2,
    carryName: '未执行',
    result: '未执行'
  },
  {
    id: '',
    orgContent: '蔡甸养老院',
    olderId: '',
    olderName: 'hhh',
    drugName: '感冒灵',
    dosage: 2,
    carryName: '未执行',
    result: '未执行'
  },
  {
    id: '',
    drugName: '感冒灵'
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
  name: 'HelloWorld',
  data() {
    return {
      list,
      innerVisible: false,
      deptList,
      defaultProps: {
        children: 'children',
        label: 'deptName'
      },
      timeQuerys: null,
      listQuery: {
        orgName: '',
        olderName: '',
        drugName: '',
        worker: '',
        quarters: ''
      },
      pageSize: 10,
      currOnePage: 1,
      totalOneNotes: 23,
      currTwoPage: 1,
      totalTwoNotes: 9,
      currThreePage: 1,
      totalThreeNotes: 13,
      currFourPage: 1,
      totalFourNotes: 18,
      basicWidth: '1600px',
      form: { ...older }
    }
  },
  mounted() {
    const that = this
    window.screenWidth = document.body.clientWidth
    that.basicWidth = window.screenWidth < 1800 ? 1168 + 'px' : 1555 + 'px'
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        that.basicWidth = window.screenWidth < 1800 ? 1168 + 'px' : 1555 + 'px'
      })()
    }
  },
  methods: {
    clickPopover() {
      this.innerVisible = !this.innerVisible
    },
    handleNodeClick(data) {
      this.innerVisible = false
      this.listQuery.quarters = data.deptName
      console.log(data)
    },
    handleQuery(currentPage, pageSize) {
      console.log(this.listQuery)
    },
    handleOneChange(val) {
      this.handleQuery(val, this.pageSize)
    },
    handleTwoChange(val) {
      this.handleQuery(val, this.pageSize)
    },
    handleThreeChange(val) {
      this.handleQuery(val, this.pageSize)
    },
    handleFourChange(val) {
      this.handleQuery(val, this.pageSize)
    }
  }
}
</script>

<style lang="scss" scoped>
.user-detail {
  margin-bottom: 20px;
  .el-form-item {
    margin-bottom: 0px;
    .detail {
      width: 240px;
      display: inline-block;
    }
  }
}

.avatar-user {
  width: 389px;
  height: 150px;
  float: right;
  .avatar {
    height: 150px;
    vertical-align: top;
  }
}

.custom-tree-node {
  .svg-icon {
    color: #2095ed;
  }
}
</style>
