<template>
  <div class="main-container">
    <el-tabs type="card"
      v-model="tabsValue"
      @tab-click="handleTabsClick">
      <el-tab-pane v-for="(row, num) in tabsList"
        :key="num"
        :name="row.path"
        :label="row.title"></el-tab-pane>
    </el-tabs>
    <div v-if="tabsValue=='review'">
      <total-review></total-review>
    </div>
    <div v-if="tabsValue=='aged'">
      <total-older></total-older>
    </div>
    <div v-if="tabsValue=='phone'">
      <total-phone></total-phone>
    </div>
    <div v-if="tabsValue=='sites'">
      <total-sites></total-sites>
    </div>
    <div v-if="tabsValue=='monit'">
      <total-monit></total-monit>
    </div>
  </div>
</template>

<script>
import { findByDicCode } from '@/api/page'
import { mapGetters } from 'vuex'
import totalReview from './review'
import totalOlder from './aged'
import totalPhone from './phone'
import totalSites from './sites'
import totalMonit from './monit'

export default {
  name: 'HelloWorld',
  components: {
    totalReview,
    totalOlder,
    totalPhone,
    totalSites,
    totalMonit
  },
  data() {
    return {
      btnPowers: null,
      options: {
        gender: []
      },
      tabsValue: '3',
      tabsList: []
    }
  },
  computed: {
    ...mapGetters(['menus'])
  },
  watch: {
    $route(newVal, oldVal) {
      this.btnPowers = newVal.meta.btnList
      const list = newVal.path.split('/')
      this.tabsValue = list[2]
    }
  },
  created() {
    this.tabsList = this.findTabsList('/count', 'tolOperate')
    console.log('tabsList', this.tabsList)
  },
  mounted() {
    this.btnPowers = this.$route.meta.btnList
    console.log('btnPowers', this.btnPowers)
    const list = this.$route.path.split('/')
    this.tabsValue = list[2]
    this.findDicList()
  },
  methods: {
    findTabsList(path, icon) {
      let rlist = this.menus.find(item => item.path === path)
      rlist = rlist.children.find(item => item.icon === icon)
      return rlist.children
    },
    findDicList() {
      findByDicCode('sex').then(response => {
        this.options.gender = response.data.dataList
      })
    },
    handleTabsClick(tab, event) {
      this.$router.push({ path: '/count/' + tab.name })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tabs /deep/ {
  .el-tabs__header {
    .el-tabs__nav {
      left: 50%;
      margin-left: -300px;
      .el-tabs__item {
        width: 120px;
        text-align: center;
      }
    }
  }
}
</style>
