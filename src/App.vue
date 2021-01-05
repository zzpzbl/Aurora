<template>
  <div id="app">
    <au-header></au-header>
    <router-view></router-view>
  </div>
</template>

<script>
// import Home from './views/Home.vue'
import AuHeader from './components/Header'

export default {
  name: 'app',
  components: {
    AuHeader
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 1200px;
  min-height: 100vh;
  margin: 0 auto;
  background: #fff;
  position: relative;
}
</style>
