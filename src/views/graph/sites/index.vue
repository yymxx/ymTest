<template>
  <div>
    <div class="dept-container">
      <div style="padding-right: 15px;">
        <el-card>
          <div slot="header">
            <span>街道</span>
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
        <el-row :gutter="16"
          class="statist">
          <el-col :span="5">
            <div class="box clearfix">
              <div class="msg"
                style="width: 50%;">
                <h3>{{ form.oldcount }}</h3>
                <p>老人数</p>
              </div>
              <div class="msg"
                style="width: 50%;">
                <h3>{{parseInt(form.oldcount / form.mantotal * 100)}}%</h3>
                <p>占比</p>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="box clearfix">
              <div class="msg">
                <h3>{{ form.org12count }}</h3>
                <p>养老机构</p>
              </div>
              <div class="msg">
                <h3>{{ form.bedtotal }}</h3>
                <p>床位数</p>
              </div>
              <div class="msg">
                <h3>99%</h3>
                <p>入住率</p>
              </div>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="box clearfix">
              <div class="msg"
                style="width: 100%;">
                <h3>{{ form.org34count }}</h3>
                <p>社区服务中心</p>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="box clearfix">
              <div class="msg">
                <h3>{{ form.stcount }}</h3>
                <p>服务站</p>
              </div>
              <div class="msg">
                <h3>88</h3>
                <p>助餐点个数</p>
              </div>
              <div class="msg">
                <h3>{{ form.helpercount }}</h3>
                <p>服务人员</p>
              </div>
            </div>
          </el-col>
        </el-row>
        <div class="census-box">
          <gould-map :data="lnglats"
            :click-modal="false"
            height="580px"></gould-map>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gouldMap from '@/components/GouldMap/map'
import { getRecordList } from '@/api/page'
import { allApi } from '@/api/config'
import { mapGetters } from 'vuex'

export default {
  name: 'totalSites',
  components: {
    gouldMap
  },
  data() {
    return {
      btnPowers: null,
      listQuery: {
        orgName: '',
        buidName: '',
        bumkStatus: '',
        olderName: ''
      },
      allResponse: [],
      form: {
        oldcount: 0,
        helpercount: 0,
        stcount: 0,
        org12count: 0,
        org34count: 0,
        communityCount: 0,
        bedtotal: 0,
        mantotal: 0
      },
      lnglats: [],
      currDept: null,
      deptList: [],
      defaultProps: {
        children: 'children',
        label: 'addressName'
      }
    }
  },
  computed: {
    ...mapGetters(['sysUser'])
  },
  mounted() {
    this.btnPowers = this.$route.meta.btnList
    console.log('btnPowers', this.btnPowers)

    getRecordList(allApi.addresstable.getList, {}).then(response => {
      console.log(222, response)
      this.deptList = response.data.dataList
    })

    getRecordList(allApi.large.getBigScreenData, {}).then(response => {
      this.allResponse = response.data

      for (var k of response.data.organizationList) {
        console.log(k.reserve1, k.id)
        if (k.reserve1 === 'oldcount') {
          this.form.oldcount = k.id
        } else if (k.reserve1 === 'mantotal') {
          this.form.mantotal = k.id
        } else if (k.reserve1 === 'org12count') {
          this.form.org12count = k.id
        } else if (k.reserve1 === 'bedtotal') {
          this.form.bedtotal = k.id
        } else if (k.reserve1 === 'helpercount') {
          this.form.helpercount = k.id
        } else if (k.reserve1 === 'stcount') {
          this.form.stcount = k.id
        } else if (k.reserve1 === 'org34count') {
          this.form.org34count = k.id
        } else if (k.reserve1 === 'communityCount') {
          this.form.communityCount = k.id
        } else if (k.reserve1 === 'communityCount') {
          this.form.communityCount = k.id
        }
      }
      console.log('allResponse', this.allResponse)
    })

    getRecordList(allApi.organization.getList, {
      page: 1,
      pageSize: 20,
      id: this.sysUser.institutionsId
    }).then(response => {
      this.lnglats = response.data.dataList
    })
  },
  methods: {
    handleQuery(currentPage, pageSize) {
      console.log(this.listQuery)
    },
    handleNodeClick(data) {
      this.currDept = data
      let dataId = ''
      if (data && !data.children) dataId = data.id
      console.log(dataId)
    }
  }
}
</script>

<style lang="scss" scoped>
.statist {
  margin-bottom: 20px;
  .box {
    padding: 0 15px 20px;
    border: 1px solid #c9c9c9;
    .msg {
      width: 33%;
      float: left;
      font-size: 14px;
      text-align: center;
      h3 {
        font-size: 32px;
        margin: 20px 0;
      }
    }
  }
}

.census-box {
  border: 1px solid #ebeef5;
}
</style>
