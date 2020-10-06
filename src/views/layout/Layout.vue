<template>
  <div class="app-container">
    <div class="leftnav">
      <sidebar class="sidebar-container"></sidebar>
    </div>
    <div class="content-container">
      <tags-view></tags-view>
      <transition name="fade"
        mode="out-in">
        <keep-alive :include="cachedViews">
          <router-view></router-view>
        </keep-alive>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Sidebar from './components/Sidebar'
import TagsView from './components/TagsView'

export default {
  name: 'HelloWorld',
  data() {
    return {
      leftMenus: []
    }
  },
  components: {
    Sidebar,
    TagsView
  },
  computed: {
    ...mapGetters(['name', 'menus']),
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  display: flex;
  background-color: #f5f3f0;
  .leftnav {
    text-align: left;
    display: inline-block;
  }

  .content-container {
    background-color: #fff;
    flex: 1;
  }
}
</style>
