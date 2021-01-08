<template>
  <div class="au-header">
    <h1 class="title">极光数据库</h1>
    <au-nav></au-nav>
  </div>
</template>

<script>
import AuNav from './Nav';

export default {
  name: "AuHeader",
  components: {
    AuNav
  }
}
</script>

<style scoped>
.title {
  margin: 0;
  padding: 30px 20px;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  font-weight: normal;
  border-bottom: 1px solid #efefef;
}
</style>