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
        <div class="census-box">
          <gould-map height="720px"
            :click-modal="false"></gould-map>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gouldMap from '@/components/GouldMap/map'
import { getRecordList } from '@/api/page'
import { allApi } from '@/api/config'

export default {
  name: 'totalMonit',
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
      currDept: null,
      deptList: [],
      defaultProps: {
        children: 'children',
        label: 'addressName'
      }
    }
  },
  mounted() {
    this.btnPowers = this.$route.meta.btnList
    console.log('btnPowers', this.btnPowers)

    getRecordList(allApi.addresstable.getList, {}).then(response => {
      console.log(222, response)
      this.deptList = response.data.dataList
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
.census-box {
  border: 1px solid #ebeef5;
}
</style>
