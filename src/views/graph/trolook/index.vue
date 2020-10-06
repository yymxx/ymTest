<template>
  <div class="main-container">
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
        <el-row :gutter="12"
          class="pluginBox">
          <el-col :span="8"
            v-for="(iframeSrc, num) in pluginList"
            :key="num">
            <!-- <web-plugin div-id='row'></web-plugin> -->
            <iframe :src="iframeSrc"
              ref="iframe"
              width="100%"
              height="360"
              frameborder="0"
              scrolling="no"></iframe>
          </el-col>
        </el-row>
        <div v-if="isLarge"
          class="sp-wrapper">
          <div class="spImg"
            @click="handleLarge(index)">
            <img :src="larImg" />
          </div>
          <el-button type="primary"
            @click="handleCancel">返 回</el-button>
        </div>
        <el-row v-if="isLarge"
          :gutter="10"
          class="sp-wrapper">
          <el-col :span="12"
            v-for="(item, index) in spList"
            :key="index">
            <div class="spImg"
              @click="handleLarge(index)">
              <img :src="item" />
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { getRecordList } from '@/api/page'
import { allApi } from '@/api/config'
import webPlugin from './plugin'

export default {
  name: 'HelloWorld',
  components: {
    webPlugin
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
      pluginList: [
        'http://120.202.177.101:8090/plugin/index.html?num=1',
        'http://120.202.177.101:8090/plugin/index.html?num=2',
        'http://120.202.177.101:8090/plugin/index.html?num=1',
        'http://120.202.177.101:8090/plugin/index.html?num=2',
        'http://120.202.177.101:8090/plugin/index.html?num=1',
        'http://120.202.177.101:8090/plugin/index.html?num=2'
      ],
      isLarge: false,
      larImg: '',
      spList: [
        './static/images/sp.jpg',
        './static/images/sp2.jpg',
        './static/images/sp2.jpg',
        './static/images/sp.jpg'
      ],
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
    },
    handleLarge(num) {
      console.log(num)
      this.isLarge = true
      this.larImg = this.spList[num]
    },
    handleCancel() {
      this.isLarge = false
    }
  }
}
</script>

<style lang="scss" scoped>
.pluginBox {
  .el-col {
    margin-bottom: 12px;
  }
}

.sp-wrapper {
  text-align: center;
  .spImg {
    border: 1px solid #ccc;
    margin-bottom: 20px;
    img {
      width: 100%;
      height: 720px;
      vertical-align: middle;
    }
  }

  .el-col {
    text-align: left;
    .spImg {
      margin: 5px 0;
      img {
        height: 375px;
      }
    }
  }
}
</style>
