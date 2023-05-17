// Get the file input element
var fileInput = document.getElementById("file-input");

// Get the buttons
var prevButton = document.getElementById("prev-button");
var nextButton = document.getElementById("next-button");
var saveButton = document.getElementById("save-button");

// initialize data variables.
var data_from_excel = [[1,2,3,4,5,6,7,8,9,10],[1,2,3,4,5,100,7,8,9,10]]
var current_data_index = 0;
var read_excel= false

// set up trace and plotly layout and config.
var x = [1,2,3,4,5,6,7,8,9,10]
var y = [1,2,3,4,5,100,7,8,9,10]
var init_data = [{x: x, y: y, line:{color: 'rgb(233,30,99)'}, fill: 'tozeroy'}];

/* var trace = {
  x: [1,2,3,4,5,6,7,8,9,10],
  y: [1,2,3,4,5,6,7,8,9,10],
  type: 'scatter',
  line: {
    color: 'rgb(233, 30, 99)' ,
    width: 3
  } */
var layout={
  title:"Test title",
  font: {size:18},
  autosize: true ,
 paper_bgcolor:"rgba(0,0,0,0)",
  plot_bgcolor:"rgba(0,0,0,0)",
  margin: { 
    l: 50,
    r: 30,
    b: 70,
    t: 80,
    pad: 0},
  xaxis: {showline: true, showgrid: false, rangemode: "tozero"},
  yaxis: {showline: true, showgrid: false, rangemode: "tozero"}
  /* yaxis: {rangemode: 'tozero', showgrid: false, color: "blue"} */
  }

var config = {
  responsive: true,
  displayModeBar: false
}

// Plot the plot.
Plotly.newPlot('chart', init_data, layout, config);

function updatePlot(){
x= data_from_excel[current_data_index][0];
y= data_from_excel[current_data_index][1];

var xnostring = x.filter(el => typeof el === "number");
var ynostring = x.filter(el => typeof el === "number");
// console.log(current_data_index)
// console.log("Updating plot...")
// console.log(data_from_excel)
console.log(x)
console.log(y) 
console.log("min X:", Math.min(...x))
// console.log("max X:", Math.max(...x))
// console.log("min Y:", Math.min(...y))
// console.log("max Y:", Math.max(...y))


// Create a frame object with new x and y values
var frame1 = {
  data: [{x: x, y: y}]
};
// Create a frame object with new axis range
var frame2 = {
  /*  layout: {
    xaxis: {autorange: true},
    yaxis: {autorange: true}
  }  */
 layout: {
    xaxis: {range: [Math.min(...x)*.9, Math.max(...x)*1.1]},
    yaxis: {range: [Math.min(...y)*.9, Math.max(...y)*1.1]}
  } 
 
};
// Animate the plot with the first frame to update the data
Plotly.animate(chart, frame1, {
  transition: {duration: 200, easing: 'cubic-in'},
  frame: {duration: 200}
},{
    traces: [0],
    mode: 'immediate'
});
// Animate the plot with the second frame to update the layout
Plotly.animate(chart, frame2, {
  transition: {duration: 400, easing: 'cubic-out'},
  frame: {duration: 400}
},{
  traces: [0],
  mode: 'afterall'
});
/* plotly.update('chart', {x: [x], y: [y]}); */
console.log(" Plot updated!")
}

/* 
// Define a function to parse excel files
const parseExcel = async (file) => {
  // Read the file as an array buffer
  const buffer = await file.arrayBuffer();
  // Parse the buffer as a workbook
  const workbook = XLSX.read(buffer, { type: 'array' });
  // Get the first worksheet
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  // Convert the sheet to an array of arrays
  const data = XLSX.utils.sheet_to_row_object_array(sheet, { header: 1 });
  // Return the data
  return data;
};

fileInput.addEventListener('change', async () => {
  const files = fileInput.files;
  current_data_index = 0;
  var data = [];
  for (let i = 0; i < files.length; i++) {
    // Parse the file and get the data
    const sheet_data = await parseExcel(files[i]);
    console.log(sheet_data);
    // Get the x and y values
    var x = sheet_data.map(row => row[0]);
    var y = sheet_data.map(row => row[1]);
    console.log(x, y);
    // Push to data array
    data.push([x, y]);
    console.log("data", data);
    console.log(data_from_excel);
    console.log("x from parser",x)
  }
  data_from_excel = data;
  read_excel = true;
  updatePlot();
});
 */

// Loops trough user selected xlsx files and stores first sheet first and second column as x,y data.
fileInput.addEventListener('change', () => {
 const files = fileInput.files;
 current_data_index = 0;
 var data = [];
 for (let i = 0; i < files.length; i++) {
   const reader = new FileReader();
   reader.onload = (event) => {
     var result = event.target.result;
     var workbook = XLSX.read(result, { type: 'binary' });
     var sheet_name_list = workbook.SheetNames;
          var sheet_data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

     var columns = Object.keys(sheet_data[0])
     console.log(" columns", columns)
     var x= sheet_data.map(row => row[columns[0]]);
     var y= sheet_data.map(row => row[columns[1]]); 
     data.push([x, y]);

     if (i == 0){
     updatePlot();
     }/* Plotly.update('chart', {x: [x], y: [y]}); */
   };
    reader.readAsBinaryString(files[i]);
 }
 data_from_excel = data;
 read_excel=true
});



  // Add an event listener for both buttons
nextButton.addEventListener('click', plotGraph);
prevButton.addEventListener('click', plotGraph);

// Define a function to plot the graph
function plotGraph(event) {
  console.log("Files selected:", read_excel);
  if (read_excel == true) {
    console.log("Plotting next graph");
    // Check which button was clicked and update the index
    current_data_index += (event.target == nextButton) ? 1 : -1;
    // Wrap around the index if it goes out of bounds
    if (current_data_index >= data_from_excel.length) {
      current_data_index = 0;
    }
    if (current_data_index < 0) {
      current_data_index = data_from_excel.length - 1;
    }
    // Call the updatePlot function
    updatePlot();
  }
}

// Exports the graph as SVG:
saveButton.addEventListener('click', () => {
  //AI CODE HERE
  // Get the plot element
  var plot = document.getElementById('chart');
  // Call Plotly.toImage to convert the plot to a data URL
  Plotly.toImage(plot, {format: 'svg'})
    .then(function(dataUrl) {
      // Create a link element
      var link = document.createElement('a');
      // Set the href attribute to the data URL
      link.href = dataUrl;
      // Set the download attribute to the file name
      link.download = 'plot.svg';
      // Append the link to the document body
      document.body.appendChild(link);
      // Simulate a click on the link
      link.click();
      // Remove the link from the document body
      document.body.removeChild(link);
    })
    .catch(function(error) {
      // Handle any errors
      console.error(error);
    });
});


// OLD FUNCTIONS FOR 2 BUTTONS SEPARATLY, NOW COMBINED

// Grabs the x,y values from the next index (x,y data sheet) in data_from_excel and updates the plotly plot.
// Does not run when xlsx files are selected. 
/* nextButton.addEventListener('click', () => {
 console.log("Files selected:", read_excel)
 if (read_excel==true){
  console.log("Plotting next graph")
 
  current_data_index += 1;
 if (current_data_index >= data_from_excel.length) {
 current_data_index = 0;
 }
 updatePlot();
 }
 });

// Same, but with previous button.
 prevButton.addEventListener('click', () => {
  console.log("Files selected:", read_excel)
  if (read_excel==true){
   console.log("Plotting next graph")
  
   current_data_index -= 1;
  if (current_data_index < 0) {
  current_data_index = data_from_excel.length-1;
  }
  updatePlot();
  }
  }); */
