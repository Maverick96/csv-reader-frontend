<template>
  <div>
    <canvas id="file-chart"></canvas>
  </div>
</template>

<script>
export default {
  name: "LineChart",
  data: () => {
    return {
      myChart: null
    };
  },
  props: ["chartData"],
  methods: {
    createChart: function(chartData) {
      // get reference to canvas element to draw the chart
      const ctx = document.getElementById("file-chart");
      const self = this;

      // set data options for chart
      const data = {
        labels: [],
        datasets: [
          {
            label: "Forecast Data",
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            data: []
          }
        ]
      };

      // set scale and type options of the chart
      const chartOptions = {
        type: "line",
        data,
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ],
            xAxes: [
              {
                barPercentage: 1.0,
                padding: 2
              }
            ]
          }
        }
      };

      // register 'beforeInit' hook to the chart to set the 'dataset' of the chart
      Chart.pluginService.register({
        beforeInit: function(chart) {
          let data = chart.config.data;
          let item = {};
          data.labels = [];
          data.datasets[0].data = [];
          for (let i in chartData) {
            item = chartData[i];
            data.labels.push(item["Dates"]);
            data.datasets[0].data.push(item["Forecast"]);
          }
          console.log("Data ", data);
        }
      });

      // remove reference of old chart before creating a new one
      if (this.myChart) {
        this.myChart.destroy();
      }
      this.myChart = new Chart(ctx, chartOptions);
      this.myChart.update();
    }
  },
  watch: {
    // redraw chart everytime there is change in data
    chartData: function(val) {
      console.log("CHANGE IN PROP");
      this.createChart(val);
    }
  },
  beforeDestroy() {
    // remove reference of the chart before the component is removed
    if (this.myChart) {
      this.myChart.destroy();
    }
  }
};
</script>


<style scoped>
canvas {
  width: 90vw !important;
  height: 80vh;
}
</style>