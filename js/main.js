// define constant frame dimensions
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 650;
const MARGINS = {left: 50, right: 25, top: 20, bottom: 100};
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
      .style('left', (event.pageX + 20) + 'px')
      .style('top', (event.pageY + 20) + 'px'); 
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
  }
  if(document.getElementById('Avionics').checked) {
      document.getElementById('avionicsVis').classList.remove('hidden');
  }else if(document.getElementById('Avionics').checked == false) {
    document.getElementById('avionicsVis').classList.add('hidden');
  }
  if(document.getElementById('Internal').checked) {
    document.getElementById('internalVis').classList.remove('hidden');
  }else if(document.getElementById('Internal').checked == false) {
    document.getElementById('internalVis').classList.add('hidden');
  }
  if(document.getElementById('Propulsion').checked) {
    document.getElementById('propulsionVis').classList.remove('hidden');
  }else if(document.getElementById('Propulsion').checked == false) {
    document.getElementById('propulsionVis').classList.add('hidden');  
  }
  if(document.getElementById('Starship').checked) {
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
  let AIRFRAME_MAX_Y = 600

  // scaling functions
  let xscale = d3.scaleBand()
    .domain(airframeData.map((d) =>
    {return d.Item;}))
	.range([0, VIS_WIDTH]);
  let yscale = d3.scaleLinear()
    .domain([(AIRFRAME_MAX_Y + 20), 0])
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
    .attr('transform', 'translate(' + (MARGINS.left - 8) + ')')
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
        return (MARGINS.top + (yscale(d.Price)))
      })
      .attr('height', (d) => {
        return (VIS_HEIGHT - yscale(d.Price))
      })
      .attr('width', '10px')
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
      .style('left', (event.pageX + 20) + 'px')
      .style('top', (event.pageY + 20) + 'px'); 
  };
  function handleMouseleave(event, d) {  
    TOOLTIP.style('opacity', 0);
    d3.select(this)
    .style('fill', 'rgb(43, 150, 244)');       
  };

  // add event listeners to bars
  g.selectAll('.airframeBar')
    .on('mouseover', handleMouseover)
    .on('mousemove', handleMousemove)
    .on('mouseleave', handleMouseleave); 

  // create avionics frame
  const AV = d3.select('.avionicsVis')
    .append('svg')
        .attr('height', FRAME_HEIGHT)
        .attr('width', FRAME_HEIGHT)
        .attr('id', 'avionicsVis')
        .attr('viewBox', [0, 0, FRAME_WIDTH, FRAME_HEIGHT]);

  // get airframe specific data
  let avData = []
  for (let i = 0; i < data.length; i++) {
    let subgroup = data[i].Subgroup
    if ( subgroup == 'Avionics' ) { 
      avData.push(data[i]) 
  }};

  // set max values for scaling
  let AV_MAX_Y = 200
  // scaling functions
  let xscaleAv = d3.scaleBand()
    .domain(avData.map((d) =>
    {return d.Item;}))
	.range([0, VIS_WIDTH]);
  let yscaleAv = d3.scaleLinear()
    .domain([(AV_MAX_Y + 20), 0])
    .range([0, VIS_HEIGHT]);

  // create x and y axes
  let gAv = AV.append('g')
    .attr('transform', 'translate(' + MARGINS.left + ',' + MARGINS.top + ')');
	gAv.append('g')
    .attr('transform', 'translate(' + MARGINS.left + ',' + (MARGINS.top + VIS_HEIGHT) +')')
    .call(d3.axisBottom(xscaleAv))
    .attr('font-size', '10px')
    .selectAll('text')	
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em')
            .attr('transform', function(d) {
                return 'rotate(-35)' 
                });
  gAv.append('g')
    .attr('transform', 'translate(' + MARGINS.left + ',' + MARGINS.top +')')
    .call(d3.axisLeft(yscaleAv))
    .attr('font-size', '10px');

  // add title and axis labels
  AV.append('text')
    .attr('transform', 'translate(' + MARGINS.left + ')')
    .attr('x', MARGINS.left + VIS_WIDTH/2)
    .attr('y', MARGINS.top / 2)
    .attr('text-anchor', 'middle')
    .attr('class', 'header')
    .text('Proposed Purchases: Avionics Team');
  AV.append('text')
    .attr('transform', 'translate(' + MARGINS.left + ')')
    .attr('x', 0)
    .attr('y', MARGINS.top + VIS_HEIGHT/2)
    .attr('text-anchor', 'middle')
    .attr('class', 'header')
    .attr('font-size', '13px')
    .text('Item Cost');

  // adding bar heights
  gAv.selectAll('bars')
    .data(avData)
    .enter()
      .append('rect')
      .attr('x', (d) => {
        return (xscaleAv(d.Item) + MARGINS.left + 7)
      })
      .attr('y', (d) => {
        return (MARGINS.top + (yscaleAv(d.Price)))
      })
      .attr('height', (d) => {
        return (VIS_HEIGHT - yscaleAv(d.Price))
      })
      .attr('width', '10px')
      .attr('class', 'avBar');

  // initialize tooltip
  const TOOLTIPAV = d3.select('.avionicsVis')
  .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  // create barchart event handler functions
  function handleMouseoverAv(event, d) {
    TOOLTIPAV.style('opacity', 1);
    d3.select(this)
      .style('fill', 'yellow');
  };
  function handleMousemoveAv(event, d) {  
    TOOLTIPAV.html('Item: ' + d.Item + '<br>Semester: ' + d.Semester + '<br>Price: ' + d.Price + '<br>Quantity: ' + d.Quantity + '<br>Total Cost: ' + d.Cost + '<br>Importance: ' + d.Importance + '<br>Vendor: ' + d.Vendor + '<br>Description: ' + d.Description)
      .style('left', (event.pageX + 20) + 'px')
      .style('top', (event.pageY + 20) + 'px'); 
  };
  function handleMouseleaveAv(event, d) {  
    TOOLTIPAV.style('opacity', 0);
    d3.select(this)
    .style('fill', 'rgb(111, 2, 144)');       
  };

  // add event listeners to bars
  gAv.selectAll('.avBar')
    .on('mouseover', handleMouseoverAv)
    .on('mousemove', handleMousemoveAv)
    .on('mouseleave', handleMouseleaveAv); 

  // create internal mech frame
  const IN = d3.select('.internalVis')
    .append('svg')
        .attr('height', FRAME_HEIGHT)
        .attr('width', FRAME_HEIGHT)
        .attr('id', 'internalVis')
        .attr('viewBox', [0, 0, FRAME_WIDTH, FRAME_HEIGHT]);

  // get airframe specific data
  let inData = []
  for (let i = 0; i < data.length; i++) {
    let subgroup = data[i].Subgroup
    if ( subgroup == 'Internal Mech' ) { 
      inData.push(data[i]) 
  }};

  // set max values for scaling
  let IN_MAX_Y = 715
  // scaling functions
  let xscaleIn = d3.scaleBand()
    .domain(inData.map((d) =>
    {return d.Item;}))
	.range([0, VIS_WIDTH]);
  let yscaleIn = d3.scaleLinear()
    .domain([(IN_MAX_Y + 20), 0])
    .range([0, VIS_HEIGHT]);

  // create x and y axes
  let gIn = IN.append('g')
    .attr('transform', 'translate(' + MARGINS.left + ',' + MARGINS.top + ')');
	gIn.append('g')
    .attr('transform', 'translate(' + MARGINS.left + ',' + (MARGINS.top + VIS_HEIGHT) +')')
    .call(d3.axisBottom(xscaleIn))
    .attr('font-size', '10px')
    .selectAll('text')	
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em')
            .attr('transform', function(d) {
                return 'rotate(-35)' 
                });
  gIn.append('g')
    .attr('transform', 'translate(' + MARGINS.left + ',' + MARGINS.top +')')
    .call(d3.axisLeft(yscaleIn))
    .attr('font-size', '10px');

  // add title and axis labels
  IN.append('text')
    .attr('transform', 'translate(' + MARGINS.left + ')')
    .attr('x', MARGINS.left + VIS_WIDTH/2)
    .attr('y', MARGINS.top / 2)
    .attr('text-anchor', 'middle')
    .attr('class', 'header')
    .text('Proposed Purchases: Internal Mech Team');
  IN.append('text')
    .attr('transform', 'translate(' + MARGINS.left + ')')
    .attr('x', 0)
    .attr('y', MARGINS.top + VIS_HEIGHT/2)
    .attr('text-anchor', 'middle')
    .attr('class', 'header')
    .attr('font-size', '13px')
    .text('Item Cost');

  // adding bar heights
  gIn.selectAll('bars')
    .data(inData)
    .enter()
      .append('rect')
      .attr('x', (d) => {
        return (xscaleIn(d.Item) + MARGINS.left + 4)
      })
      .attr('y', (d) => {
        return (MARGINS.top + (yscaleIn(d.Price)))
      })
      .attr('height', (d) => {
        return (VIS_HEIGHT - yscaleIn(d.Price))
      })
      .attr('width', '10px')
      .attr('class', 'InBar');

  // initialize tooltip
  const TOOLTIPIN = d3.select('.internalVis')
  .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  // create barchart event handler functions
  function handleMouseoverIN(event, d) {
    TOOLTIPIN.style('opacity', 1);
    d3.select(this)
      .style('fill', 'yellow');
  };
  function handleMousemoveIN(event, d) {  
    TOOLTIPIN.html('Item: ' + d.Item + '<br>Semester: ' + d.Semester + '<br>Price: ' + d.Price + '<br>Quantity: ' + d.Quantity + '<br>Total Cost: ' + d.Cost + '<br>Importance: ' + d.Importance + '<br>Vendor: ' + d.Vendor + '<br>Description: ' + d.Description)
      .style('left', (event.pageX + 20) + 'px')
      .style('top', (event.pageY + 20) + 'px'); 
  };
  function handleMouseleaveIN(event, d) {  
    TOOLTIPIN.style('opacity', 0);
    d3.select(this)
    .style('fill', 'rgb(219, 26, 94)');       
  };

  // add event listeners to bars
  gIn.selectAll('.InBar')
    .on('mouseover', handleMouseoverIN)
    .on('mousemove', handleMousemoveIN)
    .on('mouseleave', handleMouseleaveIN);

  // create propulsion frame
  const PROP = d3.select('.propulsionVis')
    .append('svg')
        .attr('height', FRAME_HEIGHT)
        .attr('width', FRAME_HEIGHT)
        .attr('id', 'propulsionVis')
        .attr('viewBox', [0, 0, FRAME_WIDTH, FRAME_HEIGHT]);

  // get airframe specific data
  let propData = []
  for (let i = 0; i < data.length; i++) {
    let subgroup = data[i].Subgroup
    if ( subgroup == 'Propulsion' ) { 
      propData.push(data[i]) 
  }};

  // set max values for scaling
  let PROP_MAX_Y = 475
  // scaling functions
  let xscaleProp = d3.scaleBand()
    .domain(propData.map((d) =>
    {return d.Item;}))
	.range([0, VIS_WIDTH]);
  let yscaleProp = d3.scaleLinear()
    .domain([(PROP_MAX_Y + 20), 0])
    .range([0, VIS_HEIGHT]);

  // create x and y axes
  let gProp =PROP.append('g')
    .attr('transform', 'translate(' + MARGINS.left + ',' + MARGINS.top + ')');
	gProp.append('g')
    .attr('transform', 'translate(' + MARGINS.left + ',' + (MARGINS.top + VIS_HEIGHT) +')')
    .call(d3.axisBottom(xscaleProp))
    .attr('font-size', '8px')
    .selectAll('text')	
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em')
            .attr('transform', function(d) {
                return 'rotate(-50)' 
                });
  gProp.append('g')
    .attr('transform', 'translate(' + MARGINS.left + ',' + MARGINS.top +')')
    .call(d3.axisLeft(yscaleProp))
    .attr('font-size', '10px');

  // add title and axis labels
  PROP.append('text')
    .attr('transform', 'translate(' + MARGINS.left + ')')
    .attr('x', MARGINS.left + VIS_WIDTH/2)
    .attr('y', MARGINS.top / 2)
    .attr('text-anchor', 'middle')
    .attr('class', 'header')
    .text('Proposed Purchases: Propulsion Team');
  PROP.append('text')
    .attr('transform', 'translate(' + MARGINS.left + ')')
    .attr('x', 0)
    .attr('y', MARGINS.top + VIS_HEIGHT/2)
    .attr('text-anchor', 'middle')
    .attr('class', 'header')
    .attr('font-size', '13px')
    .text('Item Cost');

  // adding bar heights
  gProp.selectAll('bars')
    .data(propData)
    .enter()
      .append('rect')
      .attr('x', (d) => {
        return (xscaleProp(d.Item) + MARGINS.left + 2)
      })
      .attr('y', (d) => {
        return (MARGINS.top + (yscaleProp(d.Price)))
      })
      .attr('height', (d) => {
        return (VIS_HEIGHT - yscaleProp(d.Price))
      })
      .attr('width', '7px')
      .attr('class', 'propBar');

  // initialize tooltip
  const TOOLTIPPROP = d3.select('.propulsionVis')
  .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  // create barchart event handler functions
  function handleMouseoverProp(event, d) {
    TOOLTIPPROP.style('opacity', 1);
    d3.select(this)
      .style('fill', 'yellow');
  };
  function handleMousemoveProp(event, d) {  
    TOOLTIPPROP.html('Item: ' + d.Item + '<br>Semester: ' + d.Semester + '<br>Price: ' + d.Price + '<br>Quantity: ' + d.Quantity + '<br>Total Cost: ' + d.Cost + '<br>Importance: ' + d.Importance + '<br>Vendor: ' + d.Vendor + '<br>Description: ' + d.Description)
      .style('left', (event.pageX + 20) + 'px')
      .style('top', (event.pageY + 20) + 'px'); 
  };
  function handleMouseleaveProp(event, d) {  
    TOOLTIPPROP.style('opacity', 0);
    d3.select(this)
    .style('fill', 'rgb(6, 132, 88)');       
  };

  // add event listeners to bars
  gProp.selectAll('.propBar')
    .on('mouseover', handleMouseoverProp)
    .on('mousemove', handleMousemoveProp)
    .on('mouseleave', handleMouseleaveProp);

  // create propulsion frame
  const STAR = d3.select('.starshipVis')
    .append('svg')
        .attr('height', FRAME_HEIGHT)
        .attr('width', FRAME_HEIGHT)
        .attr('id', 'starshipVis')
        .attr('viewBox', [0, 0, FRAME_WIDTH, FRAME_HEIGHT]);

  // get airframe specific data
  let starData = []
  for (let i = 0; i < data.length; i++) {
    let subgroup = data[i].Subgroup
    if ( subgroup == 'Starship' ) { 
      starData.push(data[i]) 
  }};

  // set max values for scaling
  let STAR_MAX_Y = 400
  // scaling functions
  let xscaleStar = d3.scaleBand()
    .domain(starData.map((d) =>
    {return d.Item;}))
	.range([0, VIS_WIDTH]);
  let yscaleStar = d3.scaleLinear()
    .domain([(STAR_MAX_Y + 20), 0])
    .range([0, VIS_HEIGHT]);

  // create x and y axes
  let gStar = STAR.append('g')
    .attr('transform', 'translate(' + MARGINS.left + ',' + MARGINS.top + ')');
	gStar.append('g')
    .attr('transform', 'translate(' + MARGINS.left + ',' + (MARGINS.top + VIS_HEIGHT) +')')
    .call(d3.axisBottom(xscaleStar))
    .attr('font-size', '10px')
    .selectAll('text')	
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em')
            .attr('transform', function(d) {
                return 'rotate(-35)' 
                });
  gStar.append('g')
    .attr('transform', 'translate(' + MARGINS.left + ',' + MARGINS.top +')')
    .call(d3.axisLeft(yscaleStar))
    .attr('font-size', '10px');

  // add title and axis labels
  STAR.append('text')
    .attr('transform', 'translate(' + MARGINS.left + ')')
    .attr('x', MARGINS.left + VIS_WIDTH/2)
    .attr('y', MARGINS.top / 2)
    .attr('text-anchor', 'middle')
    .attr('class', 'header')
    .text('Proposed Purchases: Starship Team');
  STAR.append('text')
    .attr('transform', 'translate(' + MARGINS.left + ')')
    .attr('x', 0)
    .attr('y', MARGINS.top + VIS_HEIGHT/2)
    .attr('text-anchor', 'middle')
    .attr('class', 'header')
    .attr('font-size', '13px')
    .text('Item Cost');

  // adding bar heights
  gStar.selectAll('bars')
    .data(starData)
    .enter()
      .append('rect')
      .attr('x', (d) => {
        return (xscaleStar(d.Item) + MARGINS.left + 30)
      })
      .attr('y', (d) => {
        return (MARGINS.top + (yscaleStar(d.Price)))
      })
      .attr('height', (d) => {
        return (VIS_HEIGHT - yscaleStar(d.Price))
      })
      .attr('width', '25px')
      .attr('class', 'starBar');

  // initialize tooltip
  const TOOLTIPSTAR = d3.select('.starshipVis')
  .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  // create barchart event handler functions
  function handleMouseoverStar(event, d) {
    TOOLTIPSTAR.style('opacity', 1);
    d3.select(this)
      .style('fill', 'yellow');
  };
  function handleMousemoveStar(event, d) {  
    TOOLTIPSTAR.html('Item: ' + d.Item + '<br>Semester: ' + d.Semester + '<br>Price: ' + d.Price + '<br>Quantity: ' + d.Quantity + '<br>Total Cost: ' + d.Cost + '<br>Importance: ' + d.Importance + '<br>Vendor: ' + d.Vendor + '<br>Description: ' + d.Description)
      .style('left', (event.pageX + 20) + 'px')
      .style('top', (event.pageY + 20) + 'px'); 
  };
  function handleMouseleaveStar(event, d) {  
    TOOLTIPSTAR.style('opacity', 0);
    d3.select(this)
    .style('fill', 'rgb(238, 157, 6)');       
  };

  // add event listeners to bars
  gStar.selectAll('.starBar')
    .on('mouseover', handleMouseoverStar)
    .on('mousemove', handleMousemoveStar)
    .on('mouseleave', handleMouseleaveStar);
  });
