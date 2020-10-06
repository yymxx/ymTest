<template>
  <div>
    <router-link v-for="child in routes"
      :to="child.path"
      :key="child.id"
      class="app-link">
      <el-menu-item :index="child.id">
        <div style="position: relative;">
          <i class="icon-circle"></i>
          <span v-if="child.title"
            slot="title">{{child.title}}</span>
        </div>
      </el-menu-item>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Submenu',
  data() {
    return {
      msg: 'Welcome role'
    }
  },
  props: {
    routes: {
      type: Array
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
