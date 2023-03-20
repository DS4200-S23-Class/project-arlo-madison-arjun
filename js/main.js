// // Import the SheetJS library
// import * as JS from 'xlsx'

// // Load the Excel file
// const data_file = JS.readFile('data.xlsx');

// // Get the sheet names
// const sheets = data_file.SheetNames;

// // Loop through each sheet and get the data
// sheetNames.forEach(name => {
//   const worksheet = data_file.Sheets[name];
//   const data = XLSX.utils.sheet_to_json(worksheet);
  
//   // Do something with the data, such as rendering a D3 visualization
// console.log(data);});


// First, we need a frame  
const FRAME_HEIGHT = 200;
const FRAME_WIDTH = 500; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

const FRAME1 = d3.select("#vis1") 
                  .append("svg") 
                    .attr("height", FRAME_HEIGHT)   
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 

// Next, open file 
d3.csv("data2.csv").then((data) => { 

  // d3.csv parses a csv file 
  // .then() passes the data parsed from the file to a function
  // in the body of this function is where you will build your 
  // vis 

  // let's check our data
  console.log(data); });
