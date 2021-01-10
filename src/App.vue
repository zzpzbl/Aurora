<template>
  <div id="app">
    <au-header></au-header>
    <main>
      <au-nav></au-nav>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>

import AuHeader from './components/Header'
import AuNav from './components/Nav'

export default {
  name: 'App',
  components: {
    AuHeader,
    AuNav
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  /* width: 1200px; */
  min-height: 100vh;
  margin: 0 auto;
  background: #fff;
  position: relative;
}

main {
  display: flex;
  /* justify-content:  */
}
</style>
