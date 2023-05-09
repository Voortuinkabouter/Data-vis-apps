// Get the file input element
var fileInput = document.getElementById("file-input");

// Get the plot container element
var plotContainer = document.getElementById("plot-container");

// Get the previous and next buttons
var prevButton = document.getElementById("prev-button");
var nextButton = document.getElementById("next-button");

// An array to store the excel files data
var filesData = [];

// An index to keep track of the current file
var currentFileIndex = -1;

// A function to read an excel file and return its data as an array of objects
function readExcelFile(file) {
  return new Promise(function (resolve, reject) {
    // Create a file reader
    var reader = new FileReader();

    // Set the on load event
    reader.onload = function (e) {
      // Get the binary string from the file content
      var data = e.target.result;

      // Parse the binary string to a workbook object
      var workbook = XLSX.read(data, { type: "binary" });

      // Get the first worksheet name
      var sheetName = workbook.SheetNames[0];

      // Get the worksheet object
      var worksheet = workbook.Sheets[sheetName];

      // Convert the worksheet to an array of objects
      var sheetData = XLSX.utils.sheet_to_json(worksheet);

      // Resolve the promise with the sheet data
      resolve(sheetData);
    };

    // Set the on error event
    reader.onerror = function (ex) {
      // Reject the promise with the error
      reject(ex);
    };

    // Read the file as a binary string
    reader.readAsBinaryString(file);
  });
}

// A function to plot a graph from an array of objects with x and y properties
function plotGraph(data) {
  // Create an array of x values
  var xValues = data.map(function (item) {
    return item.x;
  });

  // Create an array of y values
  var yValues = data.map(function (item) {
    return item.y;
  });

  // Create a trace object
  var trace = {
    x: xValues,
    y: yValues,
    type: "scatter",
    mode: "lines+markers",
    marker: { color: "blue" },
  };

  // Create a layout object
  var layout = {
    title: "X-Y Plot",
    xaxis: { title: "X" },
    yaxis: { title: "Y" },
  };

  // Plot the graph using plotly.js
  Plotly.newPlot(plotContainer, [trace], layout);
}

function showPrevGraph() {
    currentFileIndex--;
    plotGraph(filesData[currentFileIndex]);
    if (currentFileIndex === 0) {
      prevButton.disabled = true;
    }
    if (currentFileIndex < filesData.length - 1) {
      nextButton.disabled = false;
    }
  }
  function showNextGraph() {
    currentFileIndex++;
    plotGraph(filesData[currentFileIndex]);
    if (currentFileIndex > 0) {
      prevButton.disabled = false;
    }
    if (currentFileIndex === filesData.length - 1) {
      nextButton.disabled = true;
    }
  }
  fileInput.addEventListener("change", function () {
    filesData = [];
    currentFileIndex = -1;
    prevButton.disabled = true;
    nextButton.disabled = true;
    var files = fileInput.files;
    for (var i = 0; i < files.length; i++) {
      readExcelFile(files[i])
        .then(function (data) {
          filesData.push(data);
          if (filesData.length === files.length) {
            showNextGraph();
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  });


/* 

    Plotly.newPlot(plotContainer,[trace],layout)}function showPrevGraph(){currentFileIndex--;plotGraph(filesData[currentFileIndex]);if(currentFileIndex===0){prevButton.disabled=true}if(currentFileIndex<filesData.length-1){nextButton.disabled=false}}
    function showNextGraph(){currentFileIndex++;plotGraph(filesData[currentFileIndex]);
    if(currentFileIndex>0){prevButton.disabled=false}if(currentFileIndex===filesData.length-1)
    {nextButton.disabled=true}}fileInput.addEventListener("change",function(){filesData=[];currentFileIndex=-1;prevButton.disabled=true;nextButton.disabled=true;var files=fileInput.files;for(var i=0;i<files.length;i++){readExcelFile(files[i]).then(function(data){filesData.push(data);if(filesData.length===files.length)
    {showNextGraph()}}).catch(function(error){console.error(error)})}}) */