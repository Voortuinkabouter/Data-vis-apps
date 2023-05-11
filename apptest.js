// Get the file input element
var fileInput = document.getElementById("file-input");

// Get the plot container element
/* var plotContainer = document.getElementById("plot-container"); */

// Get the previous and next buttons
var runButton = document.getElementById("run-button");
var nextButton = document.getElementById("next-button");

var stored_data;

fileInput.addEventListener('change', () => {
  console.log("File Selected")
  var file = fileInput.files[0];
  var reader = new FileReader();
  reader.onload = (event) => {
    console.log("Reading File")
    var result = event.target.result;
    var workbook = XLSX.read(result, { type: 'binary' });
    var sheet_name_list = workbook.SheetNames;
    console.log(sheet_name_list)
    var data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    console.log(data)

    var keys = Object.keys(data)
    console.log(" keys:", keys)
    var columns = Object.keys(data[0])
    console.log(" columns", columns)

    var column1 = data.map(row => row[columns[0]]);
    var column2 = data.map(row => row[columns[1]]); 

    console.log(column1, column2)
    stored_data = [column1, column2]
    console.log("Stored data", stored_data)
  };
  reader.readAsBinaryString(file);
 });


 // Create a new chart
function createChart(){

  var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
     type: 'line',
     data: {
       labels: stored_data[0],
       datasets: [{
         label: 'Column 2',
         data: stored_data[1],
         backgroundColor: 'rgba(255, 99, 132, 0.2)',
         borderColor: 'rgba(255, 99, 132, 1)',
         borderWidth: 1
       }]
     },
     options: {
       scales: {
         yAxes: [{
           ticks: {
             beginAtZero: true
           }
         }]
       }
     , responsive: true, maintainAspectRatio: false}
   });

}


runButton.addEventListener('click', () => {
  console.log(" run, stored data", stored_data)
  createChart();
/*   myChart.update() */
 }); 
