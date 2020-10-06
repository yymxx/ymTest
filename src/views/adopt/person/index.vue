<template>
  <div class="main-container">
    <span>正在创建中...</span>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      btnPowers: null
    }
  },
  created() {
    this.btnPowers = this.$route.meta.btnList
    console.log('btnPowers', this.btnPowers)
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
</style>
