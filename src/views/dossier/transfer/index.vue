<template>
  <div class="main-container">
    <div class="filter-container">
      <el-input class="filter-input"
        placeholder="请输入姓名"
        style="width: 280px;margin-right: 20px;"
        v-model="yyQuery.reserve1">
        <template slot="prepend">姓名</template>
      </el-input>
      <el-input class="filter-input"
        placeholder="请输入身份证号"
        style="width: 280px;margin-right: 20px;"
        v-model="yyQuery.reserve2">
        <template slot="prepend">身份证号</template>
      </el-input>
      <el-button type="primary"
        icon="el-icon-search"
        @click="handleQuery()">查询</el-button>
    </div>
    <el-tabs v-model="tabsValue"
      type="card">
      <el-tab-pane name="out"
        label="迁出老人">
        <removal-out v-if="tabsValue=='out'"
          :listQuery="yyQuery"></removal-out>
      </el-tab-pane>
      <el-tab-pane name="die"
        label="去世老人">
        <removal-die v-if="tabsValue=='die'"
          :listQuery="yyQuery"></removal-die>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import removalOut from './components/out'
import removalDie from './components/die'

export default {
  name: 'HelloWorld',
  components: {
    removalOut,
    removalDie
  },
  data() {
    return {
      timeQuerys: [],
      tabsValue: 'out',
      yyQuery: {
        reserve1: '',
        reserve2: '',
        reserve3: '',
        community: []
      }
    }
  },
  created() {
    this.btnPowers = this.$route.meta.btnList
    console.log('btnPowers', this.btnPowers)
  },
  methods: {
    handleQuery(currentPage, pageSize) {
      const hhh = this.tabsValue
      this.tabsValue = ''
      setTimeout(() => {
        this.tabsValue = hhh
      }, 20)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tabs /deep/ {
  .el-tabs__item {
    width: 200px;
    text-align: center;
  }

  .is-active {
    color: #fff;
    background-color: #00a1ea;
  }
}
</style>
