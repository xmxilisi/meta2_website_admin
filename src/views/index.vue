<template>
  <div class="dashboard-editor-container">
    <div class="logo">
      <img src="../assets/logo/logo.png">
      <div>Meta+ 官网后台管理系统</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  components: {
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  box-sizing: border-box;
  background-color: rgb(240, 242, 245);
  position: relative;
  min-height: calc(100vh - 84px);

  .logo {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    font-size: 2rem;
    font-weight: bold;
    color: #ccc;
    font-family: 'word' !important;
    img {
      margin-bottom: 12px;
    }
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
