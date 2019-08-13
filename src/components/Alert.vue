<template>
  <v-alert
    class="alert"
    :value="showAlert"
    v-bind:color="color"
    transition="scale-transition"
    type="success"
  >{{alertMsg}}</v-alert>
</template>

<script>
import eventBus from "../shared/services/event-bus";
import { ALERT_EVENT } from "../shared/constants/app.constants.js";
import { setTimeout } from "timers";
export default {
  name: "AlertBar",
  data: () => {
    return {
      showAlert: false,
      alertMsg: "",
      color: "green"
    };
  },

  mounted() {
    eventBus.$on(ALERT_EVENT, data => {
      this.alertMsg = data.msg;
      let timeout = data.timeout;
      this.showAlert = true;
      this.color = data.color;
      // remove alert msg in the given timeout
      setTimeout(
        function() {
          this.showAlert = false;
          this.color = "green";
          this.alertMsg = "";
        }.bind(this),
        timeout
      );
    });
  },
  destroyed() {
    // unregister event as the component is destroyed
    eventBus.$off(ALERT_EVENT);
  }
};
</script>

<style scoped>
.alert {
  text-align: center;
}
</style>