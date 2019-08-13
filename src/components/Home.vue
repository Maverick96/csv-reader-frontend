<template>
  <div class="container">
    <div class="list-files">
      <v-flex xs12 sm6 d-flex>
        <v-select
          :items="fileList"
          :item-value="val"
          :item-text="val"
          label="Select File"
          @change="selectFile($event)"
        ></v-select>
      </v-flex>
    </div>
    <div>
      <LineChart :chartData="fileData"></LineChart>
    </div>
  </div>
</template>

<script>
// components
import LineChart from "./Chart.vue";

// libraries
import Chart from "chart.js";

// services
import { fetchData } from "../shared/services/fetch-data";
import { listFiles } from "../shared/services/fetch-list";
import displayAlert from "../shared/services/alert";

export default {
  name: "Home",
  components: {
    LineChart
  },

  data: () => {
    return {
      selectedFileName: "",
      fileList: [],
      loading: false,
      val: "name",
      fileData: []
    };
  },
  methods: {
    // event handler for selecting a file from the list
    selectFile: function(e) {
      console.log(e, "change");
      this.selectedFileName = e;
      this.fetchData();
    },

    // fetches list of files uploaded to the server
    fetchFileNames: function() {
      listFiles()
        .then(resp => {
          console.log(resp, "RESULT");
          this.fileList = resp.data.data;
        })
        .catch(err => {
          console.error(err);
          displayAlert("red", "Couldn't fetch file list", 5000);
        });
    },

    fetchData: function() {
      this.loading = true;
      let propValMap = {};
      const payload = {
        fileName: this.selectedFileName
      };

      console.log("Payload ", payload);
      fetchData(payload)
        .then(res => {
          this.fileData = res.data.data;
          console.log(this.fileData, "RESULT");
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
          displayAlert("red", "Couldn't fetch file data", 5000);
        });
    }
  },
  mounted() {
    this.fetchFileNames();
  }
};
</script>


<style>
.container {
  margin: 0;
}

canvas {
  width: 100vw;
}
</style>
