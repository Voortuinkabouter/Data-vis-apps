
//*** On page load ***//
// Get the buttons
const fileInput = document.getElementById("file-input");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const saveButton = document.getElementById("save-button");
const exportButton = document.getElementById("export-button");

const radioButtons = document.querySelectorAll('input[type="radio"]');


const fileText = document.getElementById("file-text");

//get the chart
const chart = document.getElementById('chart');

// Set the displayed button text to "Choose Files, regardless of browser"
// Detect the browser and set the paragraph text accordingly
const isFirefox = typeof InstallTrigger !== 'undefined'; // Check if the browser is Firefox
if (isFirefox) {
  fileText.textContent = 'Browse';
} else {
  fileText.textContent = '"Choose Files"';
}


// Initialize data extraction variables.
let data_extracted= [];
let current_data_index = 0;

//update button state (for css styling  [class]:disabled{etc)
updateButtonState();

// Math functions to calculate x and y data if neccesary
function calcCumulative(array) {
  const cumulativeSum = [];
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    sum += array[i];
    cumulativeSum.push(sum);
  }
  return cumulativeSum;
}
function calcPercent(array) {
  const totalSum = array[array.length - 1];
  return array.map(value => (value / totalSum) * 100);
}
// Create shapes that are used as gridlines for logscale plots
function createGridShapes(){
  const minorGridlineX = [
    0.1,0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9,
     // Between 0.1 and 1
    1, 2, 3, 4, 5, 6, 7, 8, 9, // Between 1 and 10
    10, 20, 30, 40, 50, 60, 70, 80, 90, // Between 10 and 100
    20, 200, 300, 400, 500, 600, 700, 800, 900, 
    1000, 2000,3000,4000,5000,6000,7000,8000,9000,10000 // Between 100 and 1000
  ];
  
  let shapes = [];
  minorGridlineX.forEach(function(value) {
    var shape = {
      type: 'line',
      x0: value,
      x1: value,
      layer: 'below',
      yref: 'paper',
      y0: 0,
      y1: 1,
      line: {
        color: 'rgb(192, 192, 192)',
        width: 1
      }
    };
    // Push the shape to the array
    shapes.push(shape);
  });
  return   {
    On: shapes,
    Off: [],
  }
  
}

let GridShapes = createGridShapes(); 

// Initialize the dummy x, y data, and all Plotly setup: Trace1, Trace2, Layout, Config and create an object.
function initializePlot() {
  // Initialize dummy data
  let x_initial = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  let y_initial = x_initial.map(x_initial => x_initial ** 2);

  const y_cumulative = calcCumulative(y_initial);

const tickValues= [0.1,1,10,100,1000,10000]

console.log(GridShapes)







  // Initialize the plot traces (each trace can contain separate data to plot)
  let trace1 = {
    x: x_initial,
    y: calcPercent(y_initial),
    type: 'scatter',
    fill: 'tozeroy',
    fillcolor: 'rgba(153, 180, 255, 1)',
    line: { color: 'rgb(51, 105, 255)' ,shape: "spline"},
    name: 'Fraction (%)',
    layer: "above"
  };

  let trace2 = {
    x: x_initial,
    y: calcPercent(y_cumulative),
    type: "scatter",
    mode: "lines",
    line: { color: 'rgb(0, 3, 10)', shape: "spline", dash:"dash"},
    yaxis: 'y2',
    name: 'Cumulative (%)',
    layer: "above"  
  };



  // Initialize the plot layout
  var layout = {
    font: { size: 16 },
    title: {text: "Your plot here", font:{size:20}},
    autosize: true,
    paper_bgcolor: "rgba(0,0,0,0)",
    showline: true,
        plot_bgcolor: "rgba(0,0,0,0)",
    margin: {
      l: 80,
      r: 80,
      b: 80,
      t: 80,
      pad: 0
    },
    legend: {
      x: 0.75,
      y: 1
    },
    xaxis: {
      type: 'log',
      title: 'Diameter (µm)',
      range: [Math.log10(0.1), Math.log10(10000)],
      autorange: false,
      showline: true,
      showgrid: false,  
      mirror:true,  
      tickmode: 'array',
      ticklen: 7,
      tickwidth: .7,
      dtick: 1,
      tickvals: tickValues,
      
    }
    ,
    yaxis: {
      title: 'Fraction (%)',
      range: [0, 100],
      autorange: false,
      showline: true,
      showgrid: false,
      ticklen: 7,
      tickwidth: .7,
    },
    yaxis2: {
      overlaying: 'y',
      side: 'right',
      range: [0, 100],
      autorange: false,
      showline: true,
      showgrid: false,
      zeroline: false,
      tickmode: 'linear',
      tick0: 0,
      dtick: 20,
      ticklen: 7,
      tickwidth: 1,
    },
    
    shapes: GridShapes.On
  };

  var config = {
    responsive: true,
    displayModeBar: false
  };

 

  return {
    config: config,
    trace1: trace1,
    trace2: trace2,
    layout: layout,
  };
}


// Call the function and store the returned object and create a new plotly plot object
let PlotData = initializePlot();
let initial_data = [PlotData.trace1, PlotData.trace2];
Plotly.newPlot('chart', initial_data, PlotData.layout, PlotData.config);

//********************//


//Updates only the data, x,y,y2 and some layout updates like title and fontsize
function updatePlot() { 
  console.log(data_extracted[current_data_index])
  const{x, y1, y2, info} = data_extracted[current_data_index];
  console.log("x", x)
  console.log("y1", y1)
  console.log("y2", y2)
  console.log("title", info.filename)
  console.log(info.distributionBase)
/*   const maxDataValue = Math.max(...y1, ...y2); // Find the maximum value from y1 and y2 */
  let yaxisTitle = ''
  if (info.distributionBase === "Number"){ yaxisTitle = 'Fraction (%)'}
  
    else if  (info.distributionBase === "Volume"){ yaxisTitle = 'Volume (%)'}  

  PlotData.trace1.name = yaxisTitle

  var frame = {
    data: [
      { x: x, y: y1 },
      { x: x, y: y2 }
    ],
    layout: {
      title: {text: info.filename, font:{size:16}},
          
      yaxis: {
        title: yaxisTitle,
        range: [0, 20]}/* , // Assign the title directly
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

  
/*   const shapes = []

  Plotly.relayout('chart', {'shapes': shapes});
   
  console.log("Shapes updated!"); */
}



//*** On file change, Browse button ***//

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
    const info = extractInfo(lines,filename);

    //find the first line with data headers Diameter (um) etc.
    const startIndex = findStartIndex(lines);

    //for each row beyond the starting index  get the values as floats
    const rows = extractRows(lines, startIndex + 1);
    const { x, y1, y2 } = extractValues(rows);

    const data = {
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
    updateButtonState();
  };
}

//*** Functions inside handleFileLoad ***//

function extractInfo(lines,filename) {
  const info = {};
  info['filename'] = filename;

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
    'COV of D(v,0.9)',
    'Distribution base'
    
  ];

  for (const line of lines) {
    for (const desiredLine of desiredLines) {
      if (line.startsWith(desiredLine)) {
        if (desiredLine === 'Distribution base') {
          console.log("line logged")
          info.distributionBase= line.split('\t')[1].trim();
        }
        else{

        const match = line.match(regex);
        if (match) {
          const [, label, value] = match;
          info[desiredLine] = parseFloat(value.trim());
        }
        break;
      }
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
//*************************************//


//*** ALl other button related functions ***//
nextButton.addEventListener('click', plotGraph);
prevButton.addEventListener('click', plotGraph);
saveButton.addEventListener('click', saveAllPlots);
exportButton.addEventListener('click', exportToExcel);


// Update the buttons' disabled state initially
updateButtonState();

function updateButtonState() {
  if (data_extracted.length <= 1) {
    prevButton.disabled = true;
    nextButton.disabled = true;
    console.log("Buttons disabled")
  } else {
    prevButton.disabled = false;
    nextButton.disabled = false;
    console.log("Buttons enabled")
  }
}

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

function exportToExcel() {
  const workbook = XLSX.utils.book_new(); // Create a new workbook
  const existingSheetNames = []; // Array to store existing sheet names
  
  data_extracted.forEach((data, index) => {
    const { x, y1, y2, info } = data;
    const { filename } = info;
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
    const keys = Object.keys(info); // Get the keys from the info dictionary
    const values = Object.values(info); // Get the values from the info dictionary
    
    const worksheet = XLSX.utils.aoa_to_sheet([
      ['Diameter (µm)', 'q (%)', 'Undersize (%)', 'info-keys','info-values'],
      ...x.map((value, i) => [value, y1[i], y2[i],keys[i],values[i]])
    ]); // Create worksheet with data
    
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName); // Add worksheet to workbook
  });
  
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
  const day = String(currentDate.getDate()).padStart(2, '0');
  
  const formattedDate = `${year}${month}${day}`;
  console.log(formattedDate);
  
  const filename = `SLS_export_${formattedDate}.xlsx`;
  XLSX.writeFile(workbook, filename); // Save the workbook as a file
}  

function saveAllPlots() {
  // Update the legend position in the layout for the saved file
console.log(PlotData.layout.legend.x)

  PlotData.layout.legend.x = 0.65;
  PlotData.layout.legend.y = 0.9;
  PlotData.layout.legend.font = { size: 16 };
  

  const promises = [];

  data_extracted.forEach((data, index) => {
    const { x, y1, y2, info } = data;
    const { filename } = info;

    // Create a new chart container for each plot
    const chartContainer = document.createElement('div');
    document.body.appendChild(chartContainer);

 
    // Clone the initial_data array to avoid modifying the original data
    const plotData = JSON.parse(JSON.stringify([PlotData.trace1, PlotData.trace2]));
    

        // Use the extracted data if any files were selected
    
    plotData[0].x = x;
    plotData[0].y = y1;
    plotData[1].x = x;
    plotData[1].y = y2;
      
      
    // Create a new promise for each plot
    const promise = new Promise((resolve, reject) => {
      Plotly.newPlot(chartContainer, plotData, PlotData.layout, PlotData.config).then(() => {
        Plotly.toImage(chartContainer, { format: 'svg' })
          .then(function (dataUrl) {
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `${filename}_${index}.svg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            document.body.removeChild(chartContainer); // Remove the chart container after saving
          
            resolve();
          })
          .catch(function (error) {
            reject(error);
          });
      });
    });

    promises.push(promise);
  });

  // Wait for all promises to resolve
  Promise.all(promises)
    .then(() => {
      // Restore the original legend position after saving
      PlotData.layout.legend.x = 0.75;
      PlotData.layout.legend.y = 1;
    })
    .catch(function (error) {
      console.error(error);
    });
}


/* 
radioButtons.forEach((radio) => {
  radio.addEventListener('change', (event) => {
    console.log("Radio button clicked")
    // Remove the 'active' class from all buttons
    document.querySelectorAll('.btn').forEach((btn) => {
      btn.classList.remove('active');
    });

    // Add the 'active' class to the selected button
    event.target.nextElementSibling.classList.add('active');


  });
}); */



function hoverLink(hover) {
  const elements = document.querySelectorAll('.border-color-primary');
  for (const element of elements) {
    element.classList.toggle('hovered', hover);
  }
}


const checkboxGrid = document.getElementById("checkbox-grid");
const scaleSwitch = document.getElementById("scale-switch");

checkboxGrid.addEventListener("change", () => {
  if (checkboxGrid.checked) {
    console.log("Grid is checked");
    // Update your JavaScript variable accordingly
    Plotly.relayout('chart', {'shapes': GridShapes.On});
    console.log(GridShapes.On)
  } else {
       console.log("Grid is unchecked");
      const shapes = []

      Plotly.relayout('chart', {'shapes': GridShapes.Off});
      console.log(GridShapes.On)
      
      console.log("Shapes updated!");
        // Update your JavaScript variable accordingly
  }
});

scaleSwitch.addEventListener("change", () => {
  if (scaleSwitch.checked) {
    console.log("Switch is toggled to Lin.");
    // Update your JavaScript variable accordingly
  } else {
    console.log("Switch is toggled to Log.");
    // Update your JavaScript variable accordingly
  }
});