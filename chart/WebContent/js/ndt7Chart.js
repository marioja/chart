/**
 * This will chart the ndt7 client data in the csv file
 */
var timeFormat = 'MM/DD/YYYY HH:mm';
var dragOptions = {
  animationDuration: 1000
};
d3.csv('ndt7-client.csv').then(makeChart);
function makeChart(ndt7Client) {
  ndt7Download=ndt7Client.map(function(d) {return {x: moment(d.Date).format(timeFormat), y: d.Download}})
  ndt7Upload=ndt7Client.map(function(d) {return {x: moment(d.Date).format(timeFormat), y: d.Upload}})
  window.myLine = new Chart('canvas', {
    type: 'line',
    data: {

      datasets: [{
          label: "Downloads (Mbps)",
          fill: true,
          borderColor: "blue",
          borderWidth: 1,
          data: ndt7Download
        },
        {
          label: "Uploads (Mbps)",
          fill: true,
          borderColor: "red",
          borderWidth: 1,
          data: ndt7Upload
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
          xAxes: [{
            type: 'time',
            scaleLabel: {
              display: true,
              labelString: 'Date'
            },
            ticks: {
              maxRotation: 0
            }              
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Mbps'
            }
          }]
      },
      plugins: {
        zoom: {
          zoom: {
            enabled: true,
            drag: dragOptions,
            mode: 'x',
            speed: 0.05
          }
        }
      }
    }

  });
}
    window.resetZoom = function() {
      window.myLine.resetZoom();
      console.log('done reset zoom')
    };

    window.toggleDragMode = function() {
      var chart = window.myLine;
      var zoomOptions = chart.options.plugins.zoom.zoom;
      zoomOptions.drag = zoomOptions.drag ? false : dragOptions;

      chart.update();
      document.getElementById('drag-switch').innerText = zoomOptions.drag ? 'Disable drag mode' : 'Enable drag mode';
    };

