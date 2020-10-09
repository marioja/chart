/**
 * This will chart the ndt7 client data in the csv file
 */
var timeFormat = 'MM/DD/YYYY HH:mm';
var dragOptions = {
  animationDuration: 1000,
  backgroundColor: "rgba(0, 0, 0, 0.4)"
};
var colorSchemeSize = 20
var colorScheme = palette('mpn65', colorSchemeSize);
d3.csv('ndt7-client.csv').then(function(ndt7) {
  d3.csv('ookla-client.csv').then(function(ookla){
    addData(ndt7, ookla)
  })
})
function addData(ndt7Client, ooklaClient) {
  window.ndt7ClientCache=ndt7Client;
  window.ooklaClientCache=ooklaClient;
  addDataNoCache(ndt7Client, ooklaClient);
}
function addDataNoCache(ndt7Client, ooklaClient) {
  var lastDays = document.getElementById('last-days').value;
  var lastDays = moment().subtract(lastDays, 'days');
  ndt7Download=ndt7Client.reduce(function(filtered, d) {
    x=moment(d.Date);
    if (x>lastDays) {
      filtered.push({"x": x.format(timeFormat), "y": d.Download, "e": d.Error, "s": d.Server, "r": d.Retrans})
    }
    return filtered;
  }, [])
  ndt7Upload=ndt7Client.reduce(function(filtered, d) {
    x=moment(d.Date);
    if (x>lastDays) {
      filtered.push({"x": x.format(timeFormat), "y": d.Upload, "s": d.Server})
    }
    return filtered;
  }, [])
  ooklaDownload=ooklaClient.reduce(function(filtered, d) {
    x=moment(d.Date);
    if (x>lastDays) {
      filtered.push({"x": x.format(timeFormat), "y": d.Download*8/1000000, "s": d.ServerName, "r": d.PacketLoss})
    }
    return filtered;
  }, [])
  ooklaUpload=ooklaClient.reduce(function(filtered, d) {
    x=moment(d.Date);
    if (x>lastDays) {
      filtered.push({"x": x.format(timeFormat), "y": d.Upload*8/1000000, "s": d.ServerName})
    }
    return filtered;
  }, [])
  makeChart(ndt7Download, ndt7Upload, ooklaDownload, ooklaUpload);
}
function schemeColor(context) {
	var servers=context.dataset.servers;
	var i=context.dataIndex;
	var d=context.datasetIndex;
	var serverName=context.dataset.data[i].s;
	var l=Object.keys(servers).length;
	var color="#"+colorScheme[colorSchemeSize-1];
	if (serverName || l>(colorSchemeSize-2)) {
		if (!servers[serverName]) {
			if (l<(colorSchemeSize-2)) {// room for one more
				color="#"+colorScheme[l];
				servers[serverName]=color;
			}
		} else {
			color=servers[serverName];
		}
	};
	//console.log("["+d+","+i+"]="+color);
	return color;
}
function makeChart(ndt7Download, ndt7Upload, ooklaDownload, ooklaUpload) {
  window.myLine = new Chart('canvas', {
    type: 'line',
    data: {

      datasets: [{
          label: "M-Lab Downloads (Mbps)",
          fill: 'origin',
          backgroundColor: "rgba(0, 0, 255, 0.1)",
          borderColor: "rgba(0, 0, 255, 1)",
          borderWidth: 1,
          pointBorderColor: schemeColor,
          pointBackgroundColor: schemeColor,
          data: ndt7Download,
          servers: []
        },
        {
          label: "M-Lab Uploads (Mbps)",
          fill: 'origin',
          backgroundColor: "rgba(255, 0, 0, 0.1)",
          borderColor: "rgba(255, 0, 0, 1)",
          borderWidth: 1,
          pointBorderColor: schemeColor,
          pointBackgroundColor: schemeColor,
          data: ndt7Upload,
          servers: []
        },
        {
            label: "Ookla Downloads (Mbps)",
            fill: 'origin',
            backgroundColor: "rgba(0, 0, 255, 0.1)",
            borderColor: "rgba(0, 0, 255, 1)",
            borderWidth: 1,
            pointBorderColor: schemeColor,
            borderDash: [2, 5],
            pointStyle: 'star',
            data: ooklaDownload,
            servers: []
        },
        {
            label: "Ookla Uploads (Mbps)",
            fill: 'origin',
            backgroundColor: "rgba(255, 0, 0, 0.1)",
            borderColor: "rgba(255, 0, 0, 1)",
            borderWidth: 1,
            pointBorderColor: schemeColor,
            borderDash: [2, 5],
            pointStyle: 'star',
            data: ooklaUpload,
            servers: []
          }
      ]
    },
    options: {
    title: {
    display: true,
    text: 'MFJ Associates Internet Bandwidth'
    },
      responsive: true,
      scales: {
          xAxes: [{
            type: 'time',
            time: {
            	displayFormats: {
            		hour: 'hA'
            	},
          		unit: 'hour'
            },
            ticks: {
              maxRotation: 0
            }              
          },{
              type: 'time',
              time: {
            		unit: 'day'
              },
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
      },
      tooltips: {
          callbacks: {
              label: function(tooltipItem, data) {
                  var label = data.datasets[tooltipItem.datasetIndex].label || '';

                  if (label) {
                      label += ': ';
                  }
                  label += Math.round(tooltipItem.yLabel * 100) / 100;
                  //console.log(tooltipItem.datasetIndex+" - "+tooltipItem.index+" - "+tooltipItem.yLabel) 
                  return label;
              },
              afterLabel: function(tooltipItem, data) {
               var estr=data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].e;
               var server=data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].s;
               var res;
               res=estr ? 'Error: '+estr+' ' : '';
               res=res+(server ? 'Server: '+server : '');
                 return res;
              }
          }
      }      
    }

  });
}
window.resetZoom = function() {
  window.myLine.resetZoom();
  //console.log('done reset zoom')
};

window.toggleDragMode = function() {
  var chart = window.myLine;
  var zoomOptions = chart.options.plugins.zoom.zoom;
  zoomOptions.drag = zoomOptions.drag ? false : dragOptions;

  chart.update();
  document.getElementById('drag-switch').innerText = zoomOptions.drag ? 'Disable drag mode' : 'Enable drag mode';
};
window.resetData = function() {
  addDataNoCache(window.ndt7ClientCache, window.ooklaClientCache);
}
