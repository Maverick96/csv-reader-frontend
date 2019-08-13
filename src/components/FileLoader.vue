<template>
  <div class="loader">
    <v-progress-circular
      :rotate="-90"
      :size="200"
      :width="15"
      :value="progressVal"
      color="beige"
    >{{ loaderMessage }}</v-progress-circular>
  </div>
</template>

<script>
export default {
  name: "FileLoader",
  props: ["loaderMessage", "progressVal"]
};
</script>

<style>
.loader {
  width: 100vw;
  height: 100vh;
  background-color: #e4ddd6;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
