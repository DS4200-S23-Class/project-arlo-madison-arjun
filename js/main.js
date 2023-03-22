// define constant frame dimensions
const FRAME_HEIGHT = 400;
const FRAME_WIDTH = 400;
const MARGINS = {left: 40, right: 25, top: 25, bottom: 25};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

// store data in variables
const launch_data = d3.csv("Data/launch.csv");

const recorded_data = d3.csv("Data/recorded.csv");

const proposed_data = d3.csv("Data/proposed.csv");

// print data to the console
launch_data.then((data) => {
  console.log(data)
});

// create first frame
const FRAME1 = d3.select('.vis1')
				.append('svg')
					.attr('height', FRAME_HEIGHT)
					.attr('width', FRAME_HEIGHT)
					.attr('class', 'frame')
					.attr('id', 'FRAME1');

recorded_data.then((data) => {

  // set max values for scaling
  let MAX_Y = 0
  data.forEach((d) => {
    print(d)
    MAX_Y = parseInt(MAX_Y, d.Cost)
  });
  console.log(MAX_Y)

  // create scaling functions
  let xscale = d3.scaleBand()
		.domain(data.map((d) =>
      {return d.Group;}))
		.range([0, VIS_WIDTH])
		.padding(0.4);
  let yscale = d3.scaleLinear()
    .domain([(MAX_Y + 50), 0])
    .range([0, VIS_HEIGHT]);

  // create x and y axes
	FRAME1.append('g')
    .attr('transform', 'translate(' + MARGINS.left + ',' + (MARGINS.top + VIS_HEIGHT) +')')
    .call(d3.axisBottom(xscale))
    .attr('font-size', '10px');

  FRAME1.append('g')
    .attr('transform', 'translate(' + MARGINS.left + ',' + MARGINS.top +')')
    .call(d3.axisLeft(yscale))
    .attr('font-size', '10px');

  // get subgroup heights
  let subgroups = ['Airframe', 'Avionics', 'Internal Mech', 'Propulsion', 'Starship']
  let subgroup_totals = {'Airframe': 0, 'Avionics': 0, 'Internal Mech': 0, 'Propulsion': 0, 'Starship': 0}

  for (var i = 0; i < subgroups.length; i++) {
    let curr_subgroup = subgroup_totals[i];
    Object.keys(subgroup_totals).forEach((item) => {
      if(item == curr_subgroup) {
          subgroup_totals[item] += (d) => d.Cost
      }})
  };
  console.log(subgroup_totals)


  
  // append all bars to chart 
	FRAME1.selectAll("bar")
    .data(data)
    .enter().append("rect")
    .attr("class", color)
    .attr("x", (d) => {return xscale(d.Group) + MARGINS.left;})
    .attr("y", (d) => {return yscale(d.Cost)})
    .attr("width", xscale.bandwidth())
    .attr("height", (d) => {return VIS_HEIGHT});

  FRAME1.append('text')
  .attr('transform', 'translate(' + MARGINS.left + ')')
  .attr('x', VIS_WIDTH/2)
  .attr('y', MARGINS.top / 2)
  .attr('text-anchor', 'middle')
  .attr('class', 'header')
  .text('Overview of Spending');
});
