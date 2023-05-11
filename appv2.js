// Get the file input element
var fileInput = document.getElementById("file-input");

// Get the plot container element
/* var plotContainer = document.getElementById("plot-container"); */

// Get the previous and next buttons
var runButton = document.getElementById("run-button");
var nextButton = document.getElementById("next-button");

var data_from_excel = [[10],[10]]

fileInput.addEventListener('change', () => {
  console.log("File Selected")
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {

    console.log("Reading File")
    var result = event.target.result;
    var workbook = XLSX.read(result, { type: 'binary' });
    var sheet_name_list = workbook.SheetNames;
    console.log(sheet_name_list)
    var data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    console.log(data)

    /* var keys = Object.keys(data)
    console.log(" keys:", keys) */

    var columns = Object.keys(data[0])
    console.log(" columns", columns)

    var x= data.map(row => row[columns[0]]);
    var y= data.map(row => row[columns[1]]); 
    console.log(x, y)
    data_from_excel = [x, y];
  };
  reader.readAsBinaryString(file);
 });

 var ctx = document.getElementById('myChart').getContext('2d');
 var myChart = new Chart(ctx, {
     type: 'line',
     data: {
       labels: data_from_excel[0],
       datasets: [{
         label: 'Column 2',
         data: data_from_excel[1],
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



runButton.addEventListener('click', () => {
  console.log(data_from_excel)
  myChart.data.labels = data_from_excel[0]
  myChart.data.datasets[0].data = data_from_excel[1]
  myChart.update()
 }); 
