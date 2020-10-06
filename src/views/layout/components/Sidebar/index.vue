<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <el-menu mode="vertical"
      unique-opened
      :show-timeout="200"
      :default-active="metaKey"
      :default-openeds="openKeys"
      :collapse="isCollapse"
      background-color="#f5f3f0"
      text-color="#585858"
      active-text-color="#fff"
      :style="{minHeight: `${minHeight}`}">
      <div v-for="(item, index) in leftMenus"
        :key="index">
        <el-submenu v-if="item.children&&item.children.length>0"
          :index="item.id">
          <template slot="title">
            <svg-icon v-if="item.icon"
              :icon-class="item.icon"></svg-icon>
            <span v-if="item.title&&sidebar.opened"
              slot="title">{{item.title}}</span>
          </template>
          <submenu :routes="item.children"></submenu>
        </el-submenu>
        <router-link v-else
          :to="item.path"
          class="app-link">
          <el-menu-item :index="item.id">
            <svg-icon v-if="item.icon"
              :icon-class="item.icon"></svg-icon>
            <span v-if="item.title"
              slot="title">{{item.title}}</span>
          </el-menu-item>
        </router-link>
      </div>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import Submenu from './Submenu'
import { markRoutes } from '@/router'

export default {
  name: 'Sidebar',
  data() {
    return {
      minHeight: '',
      firstPath: '',
      metaKey: this.$route.meta.key,
      leftMenus: []
    }
  },
  components: { Submenu },
  computed: {
    ...mapGetters(['menus', 'sidebar']),
    isCollapse() {
      return !this.sidebar.opened
    },
    openKeys() {
      return [this.$store.state.app.openkey]
    }
  },
  watch: {
    $route(val) {
      this.metaKey = val.meta.key
      this.changeLeftMenus(val)
    }
  },
  mounted() {
    const that = this
    that.changeLeftMenus(this.$route)
    window.screenHeight = document.body.clientHeight
    that.minHeight = window.screenHeight - 75 + 'px'
    window.onresize = () => {
      return (() => {
        window.screenHeight = document.body.clientHeight
        that.minHeight = window.screenHeight - 75 + 'px'
      })()
    }
  },
  methods: {
    changeLeftMenus(obj) {
      const list = obj.path.split('/')
      if (this.firstPath !== '/' + list[1]) {
        this.metaKey = obj.meta.key
        this.firstPath = '/' + list[1]
        if (markRoutes(list[1])) return
        for (let i = 0; i < this.menus.length; i++) {
          const menu = this.menus[i]
          if (menu.path === this.firstPath) {
            this.leftMenus = menu.children
            this.$store.dispatch('SetOpenkey', menu.children[0].id)
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.scrollbar-title {
  height: 50px;
  line-height: 45px;
  text-align: center;
  color: #fff;
  background-color: #337fd5;
  border-top: 2px solid #f2f2f2;
}

.el-menu {
  &:not(.el-menu--collapse) {
    width: 180px;
    .svg-icon {
      margin-right: 8px;
      vertical-align: middle;
    }
  }

  .app-link {
    display: block;
  }
}
</style>
