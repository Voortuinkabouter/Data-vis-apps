// Get the file input element
var fileInput = document.getElementById("file-input");

// Get the plot container element
/* var plotContainer = document.getElementById("plot-container"); */

// Get the previous and next buttons
var runButton = document.getElementById("run-button");
var nextButton = document.getElementById("next-button");
var data_from_excel = [[1,2,3,4,5,6,7,8,9,10],[1,2,3,4,5,6,7,8,9,10]]
var current_data_index = 0;

fileInput.addEventListener('change', () => {
 console.log("File Selected")
 const files = fileInput.files;
 var data = [];
 for (let i = 0; i < files.length; i++) {
   const reader = new FileReader();
   reader.onload = (event) => {
     console.log("Reading File")
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
   };
   reader.readAsBinaryString(files[i]);
 }
 data_from_excel = data;
});

var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
 type: 'line',
 data: {
 labels: [0],
 datasets: [{
 label: 'Label',
 data: [0],
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
});