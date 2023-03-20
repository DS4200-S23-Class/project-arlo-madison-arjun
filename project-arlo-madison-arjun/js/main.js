
const launch_data = d3.csv("Data/launch.csv").then((data) => {
  console.log(data); 
});

const recorded_data = d3.csv("Data/recorded.csv").then((data) => {
  console.log(data); 
});

const proposed_data = d3.csv("Data/proposed.csv").then((data) => {
  console.log(data); 
});
