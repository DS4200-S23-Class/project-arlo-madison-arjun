// define constant frame dimensions
const FRAME_HEIGHT = 600;
const FRAME_WIDTH = 500;
const MARGINS = {left: 50, right: 25, top: 25, bottom: 150};
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

// store data in variables
const launch_data = d3.csv('Data/launch.csv');
const recorded_data = d3.csv('Data/recorded.csv');
const proposed_data = d3.csv('Data/proposed.csv');

// start second graph
recorded_data.then((data) => {

  // print data to the console
  console.log(data)

  // create first frame
const FRAME1 = d3.select('.vis1')
                .append('svg')
                .attr('height', FRAME_HEIGHT)
                .attr('width', FRAME_HEIGHT)
                .attr('class', 'frame')
                .attr('id', 'FRAME1')
                .attr('viewBox', [MARGINS.left, MARGINS.bottom, VIS_WIDTH, VIS_HEIGHT]);

  // set max values for scaling
  let MAX_Y = 0
  for (let i = 0; i < data.length; i++) {
    let cost = parseFloat(data[i].Cost)
    if ( isNaN(cost) == false ) { 
      MAX_Y += cost 
  }};

  // create scaling functions
  let xscale = d3.scaleBand()
    .domain(data.map((d) =>
      {return d.Group;}))
		.range([0, VIS_WIDTH])
		.padding(0.4);
        
  let yscale = d3.scaleLinear()
    .domain([0, (MAX_Y + 300)])
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
  let groups = FRAME1.selectAll('g.bars')
      .data(subgroup_totals)
      .enter().append('g')
      .attr('class', 'bars')
      .style('fill', function(d, i) { return colors[i]; });
    
  let rect = groups.selectAll('rect')
      .data(function(d) { return d; })
      .enter()
      .append('rect')
      .attr('x', function(d) { return xscale(d.x); })
      .attr('y', function(d) { return yscale(d.y0 + d.y); })
      .attr('height', function(d) { return yscale(d.y0) - yscale(d.y0 + d.y); })
      .attr('width', xscale.bandwidth());

  FRAME1.append('text')
  .attr('transform', 'translate(' + MARGINS.left + ')')
  .attr('x', VIS_WIDTH/2)
  .attr('y', MARGINS.top / 2)
  .attr('text-anchor', 'middle')
  .attr('class', 'header')
  .text('Overview of Spending');

});

// create launch vis

// only show launch data when filtered down to rockets
function CheckRedshiftFilter() {
  if(document.getElementById('RedshiftFilter').checked) {
    document.getElementById('launchVis').classList.remove('hidden');
  }else if(document.getElementById('RedshiftFilter').checked == false) {
    document.getElementById('launchVis').classList.add('hidden');
}};

let buttons = document.querySelectorAll('input[name="group"]');
for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('change', CheckRedshiftFilter);
};

launch_data.then((data) => {

  // create frame
  const FRAME4 = d3.select('.launchVis')
    .append('svg')
        .attr('height', FRAME_HEIGHT)
        .attr('width', FRAME_HEIGHT)
        .attr('id', 'FRAME4')
        .attr('viewBox', [0, 0, FRAME_WIDTH, FRAME_HEIGHT]);

  // set max values for scaling
  let MAX_Y = d3.max(data, (d) => {
    return d.Cost
  });

  // scaling functions
  let xscale = d3.scaleBand()
    .domain(data.map((d) =>
      {return d.Launch_Date;}))
	.range([0, VIS_WIDTH])
	.padding(0.4);

  let yscale = d3.scaleLinear()
    .domain([(MAX_Y + 100), 0])
    .range([0, VIS_HEIGHT]);

  let g = FRAME4.append('g')
    .attr('transform', 'translate(' + MARGINS.left + ',' + MARGINS.top + ')');

  // create x and y axes
	g.append('g')
    .attr('transform', 'translate(' + MARGINS.left + ',' + (MARGINS.top + VIS_HEIGHT) +')')
    .call(d3.axisBottom(xscale))
    .attr('font-size', '10px');

  g.append('g')
    .attr('transform', 'translate(' + MARGINS.left + ',' + MARGINS.top +')')
    .call(d3.axisLeft(yscale))
    .attr('font-size', '10px');

  // add title and axis labels
  FRAME4.append('text')
    .attr('transform', 'translate(' + MARGINS.left + ')')
    .attr('x', MARGINS.left + VIS_WIDTH/2)
    .attr('y', MARGINS.top / 2)
    .attr('text-anchor', 'middle')
    .attr('class', 'header')
    .text('Damages During Launch');

    FRAME4.append('text')
    .attr('transform', 'translate(' + MARGINS.left + ')')
    .attr('x', MARGINS.left + VIS_WIDTH/2)
    .attr('y', MARGINS.top + VIS_HEIGHT + 60)
    .attr('text-anchor', 'middle')
    .attr('class', 'header')
    .attr('font-size', '13px')
    .text('Launch Date');

    FRAME4.append('text')
    .attr('transform', 'translate(' + MARGINS.left + ')')
    .attr('x', 0)
    .attr('y', MARGINS.top + VIS_HEIGHT/2)
    .attr('text-anchor', 'middle')
    .attr('class', 'header')
    .attr('font-size', '13px')
    .text('Repair Cost');

  // plotting points onto frame with size and positional attributes
  g.selectAll('points')
    .data(data)
    .enter()
      .append('text')
      .attr('x', (d) => {
        return (xscale(d.Launch_Date) + MARGINS.left + 10)
      })
      .attr('y', (d) => {
        return (yscale(d.Cost) + MARGINS.top)
      })
      .attr('fill', 'red')
      .attr('opacity', '65%')
      .text('X')
      .attr('font-weight', 'bold')
      .attr('class', 'damage');

  // initialize tooltip
  const TOOLTIP = d3.select('.launchVis')
  .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  // create barchart event handler functions
  function handleMouseover(event, d) {
    TOOLTIP.style('opacity', 1);
    d3.select(this)
      .style('fill', 'black');
    }

  function handleMousemove(event, d) {  
    TOOLTIP.html('Item: ' + d.Item + '<br>Launch Date: ' + d.Launch_Date + '<br>Amount Broken: ' + d.Number_Broken + '<br>Total Cost: ' + d.Cost)
      .style('left', (event.pageX + 50) + 'px')
      .style('top', (event.pageY + 50) + 'px'); 
  }

  function handleMouseleave(event, d) {  
    TOOLTIP.style('opacity', 0);
    d3.select(this)
    .style('fill', 'red');       
  }

  // add event listeners to points
  g.selectAll('.damage')
    .on('mouseover', handleMouseover)
    .on('mousemove', handleMousemove)
    .on('mouseleave', handleMouseleave); 
  });starshipVis

// only show approtpriately filtered subgroup data
function CheckSubgroupFilter() {
  if(document.getElementById('Airframe').checked) {
    document.getElementById('airframeVis').classList.remove('hidden');
  }else if(document.getElementById('Airframe').checked == false) {
    document.getElementById('airframeVis').classList.add('hidden');
  }else if(document.getElementById('Avionics').checked) {
      document.getElementById('avionicsVis').classList.remove('hidden');
  }else if(document.getElementById('Avionics').checked == false) {
    document.getElementById('avionicsVis').classList.add('hidden');
  }else if(document.getElementById('Internal').checked) {
    document.getElementById('internalVis').classList.remove('hidden');
  }else if(document.getElementById('Internal').checked == false) {
    document.getElementById('internalVis').classList.add('hidden');
  }else if(document.getElementById('Propulsion').checked) {
    document.getElementById('propulsionVis').classList.remove('hidden');
  }else if(document.getElementById('Propulsion').checked == false) {
    document.getElementById('propulsionVis').classList.add('hidden');  
  }else if(document.getElementById('Starship').checked) {
    document.getElementById('starshipVis').classList.remove('hidden');
  }else if(document.getElementById('Starship').checked == false) {
    document.getElementById('starshipVis').classList.add('hidden');
}};

let subgroupButtons = document.querySelectorAll('input[name="sub"]');
for (let i = 0; i < subgroupButtons.length; i++) {
  subgroupButtons[i].addEventListener('change', CheckSubgroupFilter);
};


// create subgroup visualizations
proposed_data.then((data) => {

  // create airframe frame
  const AIRFRAME = d3.select('.airframeVis')
    .append('svg')
        .attr('height', FRAME_HEIGHT)
        .attr('width', FRAME_HEIGHT)
        .attr('id', 'airframeVis')
        .attr('viewBox', [0, 0, FRAME_WIDTH, FRAME_HEIGHT]);

  // get airframe specific data
  let airframeData = []
  for (let i = 0; i < data.length; i++) {
    let subgroup = data[i].Subgroup
    if ( subgroup == 'Airframe' ) { 
      airframeData.push(data[i]) 
  }};

  // set max values for scaling
  let AIRFRAME_MAX_Y = d3.max(airframeData, (d) => {
    return d.Price
  });

  // scaling functions
  let xscale = d3.scaleBand()
    .domain(airframeData.map((d) =>
    {return d.Item;}))
	.range([0, VIS_WIDTH]);
  let yscale = d3.scaleLinear()
    .domain([(AIRFRAME_MAX_Y), 0])
    .range([0, VIS_HEIGHT]);

  // create x and y axes
  let g = AIRFRAME.append('g')
    .attr('transform', 'translate(' + MARGINS.left + ',' + MARGINS.top + ')');
	g.append('g')
    .attr('transform', 'translate(' + MARGINS.left + ',' + (MARGINS.top + VIS_HEIGHT) +')')
    .call(d3.axisBottom(xscale))
    .attr('font-size', '10px')
    .selectAll('text')	
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em')
            .attr('transform', function(d) {
                return 'rotate(-35)' 
                });
  g.append('g')
    .attr('transform', 'translate(' + MARGINS.left + ',' + MARGINS.top +')')
    .call(d3.axisLeft(yscale))
    .attr('font-size', '10px');

  // add title and axis labels
  AIRFRAME.append('text')
    .attr('transform', 'translate(' + MARGINS.left + ')')
    .attr('x', MARGINS.left + VIS_WIDTH/2)
    .attr('y', MARGINS.top / 2)
    .attr('text-anchor', 'middle')
    .attr('class', 'header')
    .text('Proposed Purchases: Airframe Team');
  AIRFRAME.append('text')
    .attr('transform', 'translate(' + MARGINS.left + ')')
    .attr('x', MARGINS.left + VIS_WIDTH/2)
    .attr('y', MARGINS.top + VIS_HEIGHT + 120)
    .attr('text-anchor', 'middle')
    .attr('class', 'header')
    .attr('font-size', '13px')
    .text('Item');
  AIRFRAME.append('text')
    .attr('transform', 'translate(' + MARGINS.left + ')')
    .attr('x', 0)
    .attr('y', MARGINS.top + VIS_HEIGHT/2)
    .attr('text-anchor', 'middle')
    .attr('class', 'header')
    .attr('font-size', '13px')
    .text('Item Cost');

  // adding bar heights
  g.selectAll('bars')
    .data(airframeData)
    .enter()
      .append('rect')
      .attr('x', (d) => {
        return (xscale(d.Item) + MARGINS.left + 10)
      })
      .attr('y', (d) => {
        return (MARGINS.top + (VIS_HEIGHT - yscale(d.Price)))
      })
      .attr('height', (d) => {
        return (yscale(d.Price))
      })
      .attr('width', '10px')
      .attr('fill', 'blue')
      .attr('class', 'airframeBar');

  // initialize tooltip
  const TOOLTIP = d3.select('.airframeVis')
  .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  // create barchart event handler functions
  function handleMouseover(event, d) {
    TOOLTIP.style('opacity', 1);
    d3.select(this)
      .style('fill', 'yellow');
  };
  function handleMousemove(event, d) {  
    TOOLTIP.html('Item: ' + d.Item + '<br>Semester: ' + d.Semester + '<br>Price: ' + d.Price + '<br>Quantity: ' + d.Quantity + '<br>Total Cost: ' + d.Cost + '<br>Importance: ' + d.Importance + '<br>Vendor: ' + d.Vendor + '<br>Description: ' + d.Description)
      .style('left', (event.pageX + 50) + 'px')
      .style('top', (event.pageY + 50) + 'px'); 
  };
  function handleMouseleave(event, d) {  
    TOOLTIP.style('opacity', 0);
    d3.select(this)
    .style('fill', 'blue');       
  };

  // add event listeners to bars
  g.selectAll('.airframeBar')
    .on('mouseover', handleMouseover)
    .on('mousemove', handleMousemove)
    .on('mouseleave', handleMouseleave); 
  });
