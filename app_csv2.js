// Get the file input element
const fileInput = document.getElementById("file-input");

// Get the buttons
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const saveButton = document.getElementById("save-button");

// Initialize data variables.
let data_extracted= [];
let current_data_index = 0;
let read_file = false;

const chart = document.getElementById('chart');



let x_initial=  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let y_initial= x_initial.map(x => x**2);
const cumulativeSum = (sum => value => sum += value)(0);

var trace1 = {
  x: x_initial,
  y: y_initial,
  type: 'scatter',
  fill: 'tozeroy',
  line:{color: 'rgb(233,30,99)'}
};
var trace1 = {
  x: x_initial,
  y: y_initial,
  type: 'scatter',
  fill: 'tozeroy',
  line: { color: 'rgb(233,30,99)' },
  name: 'Fraction (%)' // Updated trace name
};

var trace2 = {
  x: x_initial,
  y: y_initial.map(cumulativeSum),
  type: "scatter",
  mode: "lines",
  line: { color: 'rgb(33, 150, 243)', shape: "hvh" },
  yaxis: 'y2',
  name: 'Cumulative (%)' // Updated trace name
};

var layout = {
  title: "Test title",
  font: { size: 18 },
  autosize: true,
  paper_bgcolor: "rgba(0,0,0,0)",
  plot_bgcolor: "rgba(0,0,0,0)",
  margin: {
    l: 50,
    r: 30,
    b: 70,
    t: 80,
    pad: 0
  },
  xaxis: {
    type: 'log',
    title: 'Diameter (µm)',
    range: [Math.log10(0.01), Math.log10(10000)],
    autorange: false,
    showline: true,
    showgrid: false
  },
  yaxis: {
    title: 'Fraction (%)', // Updated y-axis title
    range: [0, 20],
    autorange: false,
    showline: true,
    showgrid: false
  },
  yaxis2: {
    title: '', // Empty y-axis title
    overlaying: 'y',
    side: 'right',
    range: [0, 100],
    autorange: false,
    showline: true,
    showgrid: true,
    zeroline: false,
    showticklabels: true,
    tickmode: 'linear',
    tick0: 0,
    dtick: 20
  }
};

var config = {
  responsive: true,
  displayModeBar: false
}

// Plot the initial empty chart

var initial_data = [trace1, trace2];

Plotly.newPlot('chart', initial_data, layout, config);
function updatePlot() {
  const [xData, y1, y2] = data_extracted[current_data_index];

  var frame = {
    data: [
      { x: xData, y: y1 },
      { x: xData, y: y2 }
    ]
  };

  Plotly.animate(chart, frame, {
    transition: { duration: 200, easing: 'cubic-in' },
    frame: { duration: 200 }
  }, {
    traces: [0, 1],
    mode: 'immediate'
  });

  console.log("Plot updated!");
}
  
fileInput.addEventListener('change', () => {
  const files = fileInput.files;
  current_data_index = 0;
  const data = [];

  for (let i = 0; i < files.length; i++) {
    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target.result;
      const lines = result.split('\n');
      const startIndex = lines.findIndex(line => line.includes('Diameter (µm)\tq (%)\tUndersize (%)'));

      const rows = lines.slice(startIndex + 1).map(line => line.trim().split(/\t|\s+/));

      const x = rows.map(row => parseFloat(row[0]));
      const y1 = rows.map(row => parseFloat(row[1]));
      const y2 = rows.map(row => parseFloat(row[2]));

      data.push([x, y1, y2]);

      if (i == 0) {
        data_extracted = data; // Assign as array of arrays
        read_file = true;
        console.log("File(s) read")
        updatePlot();
      }
    };

    reader.readAsText(files[i]);
  }
});

nextButton.addEventListener('click', plotGraph);
prevButton.addEventListener('click', plotGraph);

function plotGraph(event) {
  console.log("Files selected:", read_file);

  if (read_file == true) {
    console.log("Plotting next graph");
    current_data_index += (event.target == nextButton) ? 1 : -1;

    if (current_data_index >= data_extracted.length) {
      current_data_index = 0;
    }
    if (current_data_index < 0) {
      current_data_index = data_extracted.length - 1;
    }

    updatePlot();
  }
}

saveButton.addEventListener('click', () => {
  Plotly.toImage(chart, { format: 'svg' })
    .then(function (dataUrl) {
      var link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'plot.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch(function (error) {
      console.error(error);
    });
});
