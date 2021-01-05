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
}
</style>