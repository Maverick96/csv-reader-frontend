<template>
  <div id="app">
    <AlertBar />
    <NavBar />
    <router-view></router-view>
  </div>
</template>

<script>
import AlertBar from "./components/Alert";
import NavBar from "./components/NavBar";
export default {
  name: "app",
  components: {
    AlertBar,
    NavBar
  }
};
</script>

<style>
/* @import "~vuetify/src/stylus/main"; */

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100vw !important;
  height: 100vh !important;
  background-color: beige;
}

.none {
  display: none;
}

.button {
  color: white;
  background-color: burlywood;
}
</style>