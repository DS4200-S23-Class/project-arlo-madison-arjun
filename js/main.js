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
					.attr('id', 'FRAME1')
          .attr("viewBox", [MARGINS.left, MARGINS.bottom, VIS_WIDTH, VIS_HEIGHT]);

recorded_data.then((data) => {
  // set max values for scaling
  let MAX_Y = 0
  for (let i = 0; i < data.length; i++) {
    let cost = parseFloat(data[i].Cost)
    if ( isNaN(cost) == false ) { 
      MAX_Y += cost 
  }}

  // create scaling functions
  let xscale = d3.scaleBand()
		.domain(data.map((d) =>
      {return d.Group;}))
		.range([0, VIS_WIDTH])
		.padding(0.4);
  let yscale = d3.scaleLinear()
    .domain([(MAX_Y + 300), 0])
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
  let colors = ['gold', 'green', 'slate blue', 'orange', 'blue'];
  let subgroup_totals = {'Airframe': 0, 'Avionics': 0, 'Internal Mech': 0, 'Propulsion': 0, 'Starship': 0};
  
  for (let i = 0; i < data.length; i++) {
    let cost = parseFloat(data[i].Cost)
    let subgroup = data[i].Subgroup
    if ( isNaN(cost) == false ) { 
      subgroup_totals[subgroup] += cost 
  }};

  // does not work here down

  let groups = FRAME1.selectAll("g.bars")
      .data(subgroup_totals)
      .enter().append("g")
      .attr("class", "bars")
      .style("fill", function(d, i) { return colors[i]; });
    
  let rect = groups.selectAll("rect")
      .data(function(d) { return d; })
      .enter()
      .append("rect")
      .attr("x", function(d) { return xscale(d.x); })
      .attr("y", function(d) { return yscale(d.y0 + d.y); })
      .attr("height", function(d) { return yscale(d.y0) - yscale(d.y0 + d.y); })
      .attr("width", xscale.rangeBand());

  FRAME1.append('text')
  .attr('transform', 'translate(' + MARGINS.left + ')')
  .attr('x', VIS_WIDTH/2)
  .attr('y', MARGINS.top / 2)
  .attr('text-anchor', 'middle')
  .attr('class', 'header')
  .text('Overview of Spending');

 
  
  FRAME1.call(d3.zoom()
        .extent([[0, 0], [width, height]])
        .scaleExtent([1, 8])
        .on("zoom", zoomed));
  
  function zoomed({transform}) {
      g.attr("transform", transform);
  }
});
