<template>

  <el-menu default-active="2" mode="vertical" @select="handleSelect">
    <el-menu-item index="search">数据搜索</el-menu-item>
    <el-menu-item index="import">数据导入</el-menu-item>
    <el-menu-item index="mark">人工标注</el-menu-item>
  </el-menu>
      
</template>

<script>
export default {
  name: "AuHeader",
  methods: {
    handleSelect(index) {
      if(window.location.hash !== `#/${index}`) {
        this.$router.push(index);
      }
    }
  }
}
</script>
