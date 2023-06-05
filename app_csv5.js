// Get the file input element
const fileInput = document.getElementById("file-input");

// Get the buttons
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const saveButton = document.getElementById("save-button");
const exportButton = document.getElementById("export-button");

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
  name: 'Cumulative (%)', // Updated trace name
 
};

var layout = {
  title: "Your plot here",
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
    showgrid: false,
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
  console.log(data_extracted[current_data_index])
  const{x, y1, y2, filename} = data_extracted[current_data_index];
  console.log("x", x)
  console.log("y1", y1)
  console.log("y2", y2)
  console.log("title", filename)
  const maxDataValue = Math.max(...y1, ...y2); // Find the maximum value from y1 and y2
   
 
  var frame = {
    data: [
      { x: x, y: y1 },
      { x: x, y: y2 }
    ],
    layout: {
      title: filename/* , // Assign the title directly
      yaxis: {range :[0, Math.ceil(maxDataValue / 10) * 10]}// Round up to the nearest multiple of 10 */
    }
  // Update the y-axis range in the layout
  
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
  data_extracted = []; // Reset the data_extracted array
  console.log(files)

  for (let i = 0; i < files.length; i++) {
    const reader = new FileReader();
    reader.onload = handleFileLoad(files[i]);
    reader.readAsText(files[i]);
  }
});

function handleFileLoad(file) {
  return (event) => {
    const filename = file.name.replace(/\.[^/.]+$/, ""); // Extract filename without extension
    const result = event.target.result;
    const lines = result.split('\n');
    const info = extractInfo(lines);

    const startIndex = findStartIndex(lines);
    const rows = extractRows(lines, startIndex + 1);
   

    const { x, y1, y2 } = extractValues(rows);

    const data = {
      filename: filename,
      info: info,
      x: x,
      y1: y1,
      y2: y2
      
    };

    data_extracted.push(data); // Add data to the data_extracted array

    if (data_extracted.length === 1) {
      read_file = true;
      console.log("File(s) read");
      updatePlot();
    }
  };
}

function extractInfo(lines) {
  const info = {};

  const regex = /([A-Za-z\s]+)\s+([-\d.E]+)\s+\([^)]+\)/;

  const desiredLines = [
    'Median size',
    'Mean size',
    'Variance',
    'St. Dev.',
    'Mode size',
    'D10',
    'D90',
    'D(v,0.1)',
    'D(v,0.5)',
    'D(v,0.9)',
    'COV of D(v,0.1)',
    'COV of D(v,0.5)',
    'COV of D(v,0.9)'
  ];

  for (const line of lines) {
    for (const desiredLine of desiredLines) {
      if (line.startsWith(desiredLine)) {
        const match = line.match(regex);
        if (match) {
          const [, label, value] = match;
          info[desiredLine] = parseFloat(value.trim());
        }
        break;
      }
    }
  }

  return info;
}







function findStartIndex(lines) {
  return lines.findIndex(line => line.includes('Diameter (µm)\tq (%)\tUndersize (%)'));
}

function extractRows(lines, startIndex) {
  return lines.slice(startIndex).map(line => line.trim().split(/\s+/));
}

function extractValues(rows) {
  const x = [];
  const y1 = [];
  const y2 = [];
  const dataRegex = /^([\d.,-]+)\s+([\d.,-]+)\s+([\d.,-]+)$/;

  for (const row of rows) {
    const match = row.join(' ').match(dataRegex);
    if (match) {
      const [, xValue, y1Value, y2Value] = match;
      x.push(parseFloat(xValue));
      y1.push(parseFloat(y1Value));
      y2.push(parseFloat(y2Value));
    }
  }

  return { x, y1, y2 };
}

    

  

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

exportButton.addEventListener('click', exportToExcel);
function exportToExcel() {
  const workbook = XLSX.utils.book_new(); // Create a new workbook
  const existingSheetNames = []; // Array to store existing sheet names
  
  data_extracted.forEach((data, index) => {
    const { x, y1, y2, filename } = data;
    let sheetName = filename; // Set sheet name equal to the filename
    
    if (sheetName.length > 29) {
      sheetName = sheetName.substring(0, 29); // Truncate sheet name if it exceeds 30 characters
    }
    
    if (existingSheetNames.includes(sheetName)) {
      let suffix = 1;
      while (existingSheetNames.includes(`${sheetName}_${suffix}`)) {
        suffix++;
      }
      sheetName = `${sheetName}_${suffix}`; // Append suffix to make it unique
    }
    
    existingSheetNames.push(sheetName); // Add sheet name to the existing sheet names array
    
    const worksheet = XLSX.utils.aoa_to_sheet([
      ['x', 'y1', 'y2'],
      ...x.map((value, i) => [value, y1[i], y2[i]])
    ]); // Create worksheet with data
    
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName); // Add worksheet to workbook
  });
  
  const filename = 'data_export.xlsx';
  XLSX.writeFile(workbook, filename); // Save the workbook as a file
}
