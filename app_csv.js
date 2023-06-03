// Get the file input element
const fileInput = document.getElementById("file-input");

// Get the buttons
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const saveButton = document.getElementById("save-button");


// initialize data variables.
const cumulativeSum = (sum => value => sum += value)(0);
let data_from_excel = []
let current_data_index = 0;
let read_excel= false

let x=  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let y= x.map(x => x**2);

console.log(x)
console.log(y)


var trace1 = {
  x: x,
  y: y,
  type: 'scatter',
  fill: 'tozeroy',
  line:{color: 'rgb(233,30,99)'}
  
};

var trace2 = {
  x: x,
  y: y.map(cumulativeSum),
  type:"scatter",
  mode:"lines",
  line:{color: 'rgb(33, 150, 243)', shape:"hvh"}
  // line:{color: 'rgb(222, 188, 22)'}
};


var data = [trace1, trace2];

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
Plotly.newPlot('chart', data, layout, config);

function updatePlot(){
x= data_from_excel[current_data_index][0];
y= data_from_excel[current_data_index][1];

var xnostring = x.filter(el => typeof el === "number");
var ynostring = x.filter(el => typeof el === "number");

console.log(y) 
console.log("min X:", Math.min(...x))

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
