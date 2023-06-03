// (C) JAVASCRIPT
document.getElementById('demo').onclick = () => {
   // (C1) DUMMY DATA
   var data = [
    ["x", "y"], // Column headers
    [1, 2], // Row 1
    [2, 4], // Row 2
    [3, 20], // Row 3
    [4, 34] // Row 4
  ];
  
  var workbook = XLSX.utils.book_new(),
  worksheet = XLSX.utils.aoa_to_sheet(data);
workbook.SheetNames.push("First");
workbook.Sheets["First"] = worksheet;
// (C3) ADD CHART TO WORKSHEET




// (C4) DOWNLOAD
XLSX.writeFile(workbook, "data.xlsx");
}