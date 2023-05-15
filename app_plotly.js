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
var trace = {
  x: [1,2,3,4,5,6,7,8,9,10],
  y: [1,2,3,4,5,6,7,8,9,10],
  type: 'scatter',
  line: {
    color: 'rgb(233, 30, 99)' ,
    width: 3
  }
};


var layout={
  title:"Test title",
  font: {size:18},
  autosize: true ,
 paper_bgcolor:"rgba(0,0,0,0)",
  plot_bgcolor:"rgba(0,0,0,0)",
  margin: { 
    l: 40,
    r: 30,
    b: 70,
    t: 70,
    pad: 0},
  xaxis: {rangemode: 'tozero', showgrid: false},
  yaxis: {rangemode: 'tozero', showgrid: false}
  }
  
var config = {
  responsive: true,
  displayModeBar: false
}

// Plot the plot.
Plotly.newPlot('chart', [trace],layout,config);

function updatePlot(){ 
var x= data_from_excel[current_data_index][0];
var y= data_from_excel[current_data_index][1];
console.log("Updating plot...")
console.log(data_from_excel)
console.log(x)
console.log(y)
Plotly.update('chart', {x: [x], y: [y]});
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
     console.log(sheet_name_list)
     var sheet_data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
     console.log(sheet_data)

     /* var keys = Object.keys(data)
     console.log(" keys:", keys) */

     var columns = Object.keys(sheet_data[0])
     console.log(" columns", columns)

     var x= sheet_data.map(row => row[columns[0]]);
     var y= sheet_data.map(row => row[columns[1]]); 
     console.log(x, y)
     data.push([x, y]);
     console.log(" data", data)
     console.log(data_from_excel)
     updatePlot();
   };
   console.log("readAsBinaryString")
   reader.readAsBinaryString(files[i]);
 }
 data_from_excel = data;
 read_excel=true
 console.log("data_from_excel=data")
 console.log(data_from_excel)
});

/* // Bugfix logs.
console.log(data_from_excel)
console.log(read_excel)
console.log("x", data_from_excel[current_data_index][0])
console.log("x", data_from_excel[current_data_index][1]) */


// Grabs the x,y values from the next index (x,y data sheet) in data_from_excel and updates the plotly plot.
// Does not run when xlsx files are selected. 
nextButton.addEventListener('click', () => {
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
  });




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



 
/* 
runButton.addEventListener('click', () => {
 console.log(data_from_excel)
 myChart.data.labels = data_from_excel[current_data_index][0]
 myChart.data.datasets[0].data = data_from_excel[current_data_index][1]
 myChart.update()
});

nextButton.addEventListener('click', () => {
 current_data_index++;
 if (current_data_index >= data_from_excel.length) {
   current_data_index = 0;
 }
 myChart.data.labels = data_from_excel[current_data_index][0]
 myChart.data.datasets[0].data = data_from_excel[current_data_index][1]
 myChart.update()
}); */