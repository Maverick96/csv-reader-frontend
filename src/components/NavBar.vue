<template>
  <nav>
    <div class="nav-bar">
      <div :class="{'selected-nav' : path === '/home'}">
        <router-link class="link" to="/home">Home</router-link>
      </div>
      <div :class="{'selected-nav' : path === '/upload'}">
        <router-link tag="a" class="link" to="/upload">Upload</router-link>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavBar",
  data: () => {
    return {
      path: "/home"
    };
  },
  watch: {
    $route(to, from) {
      // update path everytime the route is changed
      this.path = to.path;
    }
  },
  mounted() {
    this.path = this.$route.path;
    console.log("API : ", process.env.VUE_APP_ROOT_URL);
  }
};
</script>

<style scoped>
.nav-bar {
  background-color: beige;
  height: 75px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.nav-bar div {
  width: 50%;
  text-align: center;
  /* background-color: darkgray; */
  height: 100%;
  font-size: 25px;
  color: white !important;
}

.selected-nav {
  background-color: #948473 !important;
}

li,
li:visited,
li:active {
  color: burlywood;
}

.link {
  color: burlywood;
  display: inline-block;
  width: 100%;
  height: 100%;
  cursor: pointer;
  padding-top: 15px;
}
</style>