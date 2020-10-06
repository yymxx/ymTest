<template>
  <div class="main-container">
    <iframe :src="iframeSrc"
      ref="iframe"
      width="100%"
      height="720"
      frameborder="0"
      scrolling="no"></iframe>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      btnPowers: null,
      iframeSrc: 'http://120.202.177.101:8090/plugin/demo.html'
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
