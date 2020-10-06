<template>
  <div class="main-container">
    <div class="stage-box">
      <el-row :gutter="20">
        <el-col :span="6"
          v-for="(item, index) in leftMenus"
          :key="index">
          <div class="stage"
            @click="handleStage(item)">
            <svg-icon v-if="item.icon"
              :icon-class="item.icon"></svg-icon>
            <div class="text">{{ item.title }}</div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'HelloWorld',
  data() {
    return {
      firstPath: '',
      leftMenus: []
    }
  },
  computed: {
    ...mapGetters(['menus'])
  },
  watch: {
    $route(val) {
      this.changeLeftMenus(val)
    }
  },
  created() {
    this.changeLeftMenus(this.$route)
    console.log(this.leftMenus)
  },
  methods: {
    changeLeftMenus(obj) {
      const list = obj.path.split('/')
      if (this.firstPath !== '/' + list[1]) {
        this.firstPath = '/' + list[1]
        for (let i = 0; i < this.menus.length; i++) {
          const menu = this.menus[i]
          if (menu.path === this.firstPath) {
            this.leftMenus = menu.children
          }
        }
      }
    },
    handleStage(row) {
      this.$store.dispatch('SetOpenkey', row.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.main-container {
  .stage-box {
    text-align: center;
    padding: 0 10px;
    .stage {
      background-color: #f2f2f2;
      // box-shadow: 0 0 5px #ccc;
      padding: 10px 0;
      margin-bottom: 15px;
      .svg-icon {
        font-size: 60px;
        color: #5db2ff;
      }

      .text {
        font-size: 18px;
        color: #333;
        margin-top: 10px;
      }
    }
  }
}
</style>
