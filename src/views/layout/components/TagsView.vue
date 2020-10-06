<template>
  <div class="tags-view-container">
    <scroll-pane class='tags-view-wrapper'
      ref='scrollPane'>
      <hamburger class="tags-view-tool"
        :toggleClick="toggleSideBar"
        :isActive="sidebar.opened"></hamburger>
      <span v-show="tagsShow">
        <router-link ref='tag'
          class="tags-view-item"
          :class="isActive(tag)?'active':''"
          v-for="tag in Array.from(visitedViews)"
          :to="tag.path"
          :key="tag.path">
          {{tag.title}}
          <span class='el-icon-close'
            @click.prevent.stop='closeSelectedTag(tag)'></span>
        </router-link>
      </span>
      <span v-if="!tagsShow"
        class="breadcrumb-box">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">
            <svg-icon icon-class="home" />
            <span class="home-text">首页</span>
          </el-breadcrumb-item>
          <el-breadcrumb-item v-for="(item, index) in itemList"
            :key="index">{{ item }}</el-breadcrumb-item>
        </el-breadcrumb>
      </span>
    </scroll-pane>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
import ScrollPane from '@/components/ScrollPane'

export default {
  name: 'TagsView',
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      tagsShow: false,
      itemList: []
    }
  },
  components: { Hamburger, ScrollPane },
  computed: {
    ...mapGetters(['sidebar', 'menus']),
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    }
  },
  watch: {
    $route(val) {
      if (this.tagsShow) {
        this.addViewTags()
      } else {
        this.addBreadcrumb(val)
      }
    }
  },
  mounted() {
    this.addViewTags()
    this.addBreadcrumb(this.$route)
  },
  methods: {
    addBreadcrumb(obj) {
      this.itemList = []
      const list = obj.path.split('/')
      const getBreadList = (data, name) => {
        var list = []
        for (var child of data) {
          if (child.children && child.children.length > 0) {
            const children = getBreadList(child.children, name)
            list = list.concat(children)
            if (children.length > 0) {
              list.push(child.title)
            }
          } else {
            if (child.path === name) {
              list.push(child.title)
            }
          }
        }
        return list
      }

      for (var item of this.menus) {
        if (item.children && item.children.length > 0) {
          if (item.path.substring(1) === list[1]) {
            if (list[1] !== 'call') this.itemList.push(item.title)
            let mylist = []
            if (list[2] === 'editelder') {
              mylist = getBreadList(item.children, 'elder')
              if (obj.params.editStatus && obj.params.editStatus === 'update') {
                mylist.unshift('修改')
              } else {
                mylist.unshift('添加')
              }
            } else {
              mylist = getBreadList(item.children, list[2])
            }
            this.itemList = this.itemList.concat(mylist.reverse())
          }
        }
      }
    },
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    addViewTags() {
      if (this.$route.name) {
        const route = this.$route
        this.$store.dispatch('addVisitedViews', route)
      }
    },
    isActive(route) {
      return route.path === this.$route.path || route.name === this.$route.name
    },
    closeSelectedTag(view) {
      this.$store.dispatch('delVisitedViews', view).then(views => {
        if (this.isActive(view)) {
          const latestView = views.slice(-1)[0]
          if (latestView) {
            this.$router.push(latestView.path)
          } else {
            this.$router.push(this.menus[this.menus.length - 1].path)
            this.$store.dispatch('addVisitedViews', this.$route)
          }
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.tags-view-container {
  .tags-view-wrapper {
    background: #fff;
    height: 42px;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    .tags-view-tool,
    .tags-view-item {
      display: inline-block;
      vertical-align: middle;
      margin-top: 10px;
      margin-left: 5px;
      padding: 0 8px;
    }
    .tags-view-item {
      height: 24px;
      line-height: 24px;
      margin-top: 7px;
      color: #495060;
      font-size: 12px;
      &:first-of-type {
        margin-left: 15px;
      }
      &.active {
        color: #fff;
        background-color: #409eff;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
}

.breadcrumb-box {
  height: 33px;
  display: inline-block;
  vertical-align: middle;
  margin-left: 10px;
  margin-top: 0;
  .el-breadcrumb {
    line-height: 42px;
    font-size: 12px;
    .home-text {
      margin-left: 5px;
    }
  }
}
</style>
