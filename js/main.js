// define constant frame dimensions
const FRAME_HEIGHT = 550;
const FRAME_WIDTH = 700;
const MARGINS = {left: 60, right: 45, top: 30, bottom: 85};
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

// store data in variables
const launch_data = d3.csv('Data/launch.csv');
const recorded_data = d3.csv('Data/recorded.csv');
const proposed_data = d3.csv('Data/proposed.csv');
const totals_data = d3.csv('Data/totals.csv');

// create spending overviews
totals_data.then((data) => {

  // create first frame
  const FRAME1 = d3.select('.vis1')
                .append('svg')
                .attr('height', FRAME_HEIGHT)
                .attr('width', FRAME_HEIGHT)
                .attr('class', 'frame')
                .attr('viewBox', [MARGINS.left, MARGINS.bottom, VIS_WIDTH, VIS_HEIGHT]);

  // set max values for scaling
  let MAX_Y = 4000

  // get subgroup specific data
  let recordedTotals = []
  for (let i = 0; i < data.length; i++) {
    if ( data[i].Area[0] == 'R' && data[i].Area.slice(-1) != 'I' && data[i].Area.slice(-1) != '3') { 
      recordedTotals.push(data[i]) 
  }};

  // create scaling functions
  let xscale = d3.scaleBand()
    .domain(recordedTotals.map((d) =>
      {return d.Area.split(' ')[1];}))
		.range([0, VIS_WIDTH - 19])
		.padding(0.4);
  let yscale = d3.scaleLinear()
    .domain([(MAX_Y + 300), 0])
    .range([0, VIS_HEIGHT]);

  // create x and y axes
  let g = FRAME1.append('g')
    .attr('transform', 'translate(' + MARGINS.left + ',' + MARGINS.top + ')');
	g.append('g')
    .attr('transform', 'translate(' + MARGINS.left + ',' + (MARGINS.top + VIS_HEIGHT) +')')
    .call(d3.axisBottom(xscale))
    .attr('font-size', '13px')
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
  FRAME1.append('text')
    .attr('transform', 'translate(' + MARGINS.left + ')')
    .attr('x', VIS_WIDTH/2)
    .attr('y', MARGINS.top)
    .attr('text-anchor', 'middle')
    .attr('class', 'header')
    .text('Overview of Total Recording Spending By Team');
  FRAME1.append('text')
    .attr('transform', 'translate(' + MARGINS.left + ')')
    .attr('x', MARGINS.left + (VIS_WIDTH/2))
    .attr('y', MARGINS.top + VIS_HEIGHT + MARGINS.bottom + 15)
    .attr('text-anchor', 'middle')
    .attr('class', 'header')
    .text('Redshift Subgroup');
  FRAME1.append('text')
    .attr('transform', 'translate(' + (MARGINS.left - 8) + ')')
    .attr('x', 5)
    .attr('y', MARGINS.top + VIS_HEIGHT/2 + 20)
    .attr('text-anchor', 'middle')
    .attr('class', 'header')
    .attr('font-size', '13px')
    .text('Total Cost');
 
  // add bars
  g.selectAll('bars')
    .data(recordedTotals)
    .enter()
      .append('rect')
      .attr('x', (d) => {
        return (xscale(d.Area.split(' ')[1]) + MARGINS.left + 10)
      })
      .attr('y', (d) => {
        return (MARGINS.top + (yscale(d.Total)))
      })
      .attr('height', (d) => {
        return (VIS_HEIGHT - yscale(d.Total))
      })
      .attr('width', '30px')
      .attr('class', (d) => {
        return ('vis1Bar ' + d.Area + ' ' + d.Area + 'Bar')
      });

  // initialize tooltip
  const TOOLTIP1 = d3.select('.vis1')
  .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  // create general barchart event handler functions
  function handleMouseover(event, d) {
    TOOLTIP1.style('opacity', 1);
    d3.select(this)
      .style('stroke', 'black')
      .style('stroke-width', '2px');
  };
  function handleMousemove(event, d) {  
    TOOLTIP1.html(d.Area + '<br>Total Recorded Purchases: $' + d.Total + '<br>Click for Itemized Breakdown!')
      .style('left', (event.pageX + 20) + 'px')
      .style('top', (event.pageY + 20) + 'px'); 
  };
  function handleMouseleave(event, d) {  
    TOOLTIP1.style('opacity', 0);
    d3.select(this)
    .style('stroke-width', '0px');     
  };
  function handleClick(event, d) {
    let subgroup = d.Area.split(' ')[1];
    buildSubgroupVis(subgroup);
  };
  g.selectAll('.vis1Bar')
      .on('mouseover', handleMouseover)
      .on('mousemove', handleMousemove)
      .on('mouseleave', handleMouseleave)
      .on('click', handleClick); 
  
  //build time visualization
  const TIMEVIS = d3.select('.timeVis')
    .append('svg')
    .attr('height', FRAME_HEIGHT)
    .attr('width', FRAME_HEIGHT)
    .attr('class', 'frame')
    .attr('viewBox', [MARGINS.left, MARGINS.bottom, VIS_WIDTH, VIS_HEIGHT]);

  // set max values for scaling
  let TIME_MAX_Y = 13500

  // get subgroup specific data
  let propTimeTotals = []
  for (let i = 0; i < data.length; i++) {
    if ( data[i].Area[0] == 'P'  && data[i].Area[7] == 'd' && (data[i].Area.slice(-1) == 'I' || data[i].Area.slice(-1) == '3')) { 
    propTimeTotals.push(data[i]) 
  }};
  // get subgroup specific data
  let recTimeTotals = []
  for (let i = 0; i < data.length; i++) {
    if ( data[i].Area[0] == 'R' && (data[i].Area.slice(-1) == 'I' || data[i].Area.slice(-1) == '3')) { 
    recTimeTotals.push(data[i]) 
  }};

  // create scaling functions
  let xscaleTime = d3.scaleBand()
    .domain(propTimeTotals.map((d) =>
      {return d.Area.split(' ')[1];}))
    .range([0, VIS_WIDTH - 19])
    .padding(0.4);
  let yscaleTime = d3.scaleLinear()
    .domain([(TIME_MAX_Y), 0])
    .range([0, VIS_HEIGHT]);

  // create x and y axes
  let gTime = TIMEVIS.append('g')
    .attr('transform', 'translate(' + MARGINS.left + ',' + MARGINS.top + ')');
  gTime.append('g')
    .attr('transform', 'translate(' + MARGINS.left + ',' + (MARGINS.top + VIS_HEIGHT) +')')
    .call(d3.axisBottom(xscaleTime))
    .attr('font-size', '12px')
    .selectAll('text')	
    .style('text-anchor', 'end')
    .attr('dx', '-.8em')
    .attr('dy', '.15em')
    .attr('transform', function(d) {
        return 'rotate(-35)' 
      });
  gTime.append('g')
    .attr('transform', 'translate(' + MARGINS.left + ',' + MARGINS.top +')')
    .call(d3.axisLeft(yscaleTime))
    .attr('font-size', '10px');

  // add title and axis labels
  TIMEVIS.append('text')
  .attr('transform', 'translate(' + MARGINS.left + ')')
  .attr('x', VIS_WIDTH/2)
  .attr('y', MARGINS.top)
  .attr('text-anchor', 'middle')
  .attr('class', 'header')
  .text('Proposed and Recorded Spending Over a Year (All Teams)');
  TIMEVIS.append('text')
  .attr('transform', 'translate(' + MARGINS.left + ')')
  .attr('x', (VIS_WIDTH/2))
  .attr('y', MARGINS.top + VIS_HEIGHT + MARGINS.bottom)
  .attr('text-anchor', 'middle')
  .attr('font-size', '17px')
  .attr('class', 'header')
  .text('Semester');
  TIMEVIS.append('text')
  .attr('transform', 'translate(' + (MARGINS.left - 8) + ')')
  .attr('x', 5)
  .attr('y', MARGINS.top + VIS_HEIGHT/2 + 20)
  .attr('text-anchor', 'middle')
  .attr('class', 'header')
  .attr('font-size', '13px')
  .text('Total Cost');

  // add legend
  TIMEVIS.append('text')
  .attr('transform', 'translate(' + (MARGINS.left - 8) + ')')
  .attr('x', MARGINS.left + 50)
  .attr('y', MARGINS.top + 80)
  .attr('text-anchor', 'middle')
  .attr('class', 'header')
  .attr('font-size', '14px')
  .text('Proposed');
  TIMEVIS.append('text')
  .attr('transform', 'translate(' + (MARGINS.left - 8) + ')')
  .attr('x', MARGINS.left + 50)
  .attr('y', MARGINS.top + 100)
  .attr('text-anchor', 'middle')
  .attr('class', 'header')
  .attr('font-size', '14px')
  .text('Recorded');
  TIMEVIS.append('text')
  .attr('transform', 'translate(' + (MARGINS.left - 8) + ')')
  .attr('x', MARGINS.left + 50)
  .attr('y', MARGINS.top + 60)
  .attr('text-anchor', 'middle')
  .attr('class', 'header')
  .attr('font-size', '15px')
  .text('Legend');
  gTime.append('circle')
        .attr('cx', MARGINS.left + 80)
        .attr('cy', MARGINS.top + 45)
        .attr('r', 4)
        .attr('class', 'propPoint');
  gTime.append('circle')
        .attr('cx', MARGINS.left + 80)
        .attr('cy', MARGINS.top + 65)
        .attr('r', 4)
        .attr('class', 'recPoint');

  // add points
  gTime.selectAll('points')
    .data(propTimeTotals)
    .enter()
      .append('circle')
      .attr('cx', (d) => {
        return (xscaleTime(d.Area.split(' ')[1]) + MARGINS.left + 10)
      })
      .attr('cy', (d) => {
        return (yscaleTime(d.Total) + MARGINS.top)
      })
      .attr('r', 5)
      .attr('class', 'propPoint point');
    gTime.selectAll('points')
      .data(recTimeTotals)
      .enter()
        .append('circle')
        .attr('cx', (d) => {
          return (xscaleTime(d.Area.split(' ')[1]) + MARGINS.left + 10)
        })
        .attr('cy', (d) => {
          return (yscaleTime(d.Total) + MARGINS.top)
        })
        .attr('r', 5)
        .attr('class', 'recPoint point');

  // add lines
  gTime.append("path")
    .datum(propTimeTotals)
    .attr("fill", "none")
    .attr("stroke", "rgb(60, 111, 187)")
    .attr("stroke-width", 3)
    .attr("d", d3.line()
      .x(function(d) { return xscaleTime(d.Area.split(' ')[1]) + MARGINS.left + 10})
      .y(function(d) { return yscaleTime(d.Total) + MARGINS.top})
      )
  gTime.append("path")
    .datum(recTimeTotals)
    .attr("fill", "none")
    .attr("stroke", "rgb(118, 176, 154)")
    .attr("stroke-width", 3)
    .attr("d", d3.line()
      .x(function(d) { return xscaleTime(d.Area.split(' ')[1]) + MARGINS.left + 10})
      .y(function(d) { return yscaleTime(d.Total) + MARGINS.top})
      )

  // initialize tooltip
  const TOOLTIPTIME = d3.select('.timeVis')
  .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  // create general barchart event handler functions
  function handleMouseoverTime(event, d) {
    TOOLTIPTIME.style('opacity', 1);
    d3.select(this)
      .style('stroke', 'black')
      .style('stroke-width', '2px');
  };
  function handleMousemoveTime(event, d) {  
    TOOLTIPTIME.html(d.Area + '<br>Total Purchases: $' + d.Total)
      .style('left', (event.pageX + 20) + 'px')
      .style('top', (event.pageY + 20) + 'px'); 
  };
  function handleMouseleaveTime(event, d) {  
    TOOLTIPTIME.style('opacity', 0);
    d3.select(this)
    .style('stroke-width', '0px');     
  };
  gTime.selectAll('.point')
      .on('mouseover', handleMouseoverTime)
      .on('mousemove', handleMousemoveTime)
      .on('mouseleave', handleMouseleaveTime); 
  
});

// create subgroup frame
const SUBGROUPFRAME = d3.select('.subgroupVis')
  .append('svg')
      .attr('height', FRAME_HEIGHT)
      .attr('width', FRAME_HEIGHT)
      .attr('viewBox', [0, 0, FRAME_WIDTH, FRAME_HEIGHT]);

function buildSubgroupVis(subgroupName) {
  proposed_data.then((data) => {

    // remove previous visualization
    SUBGROUPFRAME.selectAll('*').remove()
    let g = SUBGROUPFRAME.append('g')
      .attr('transform', 'translate(' + MARGINS.left + ',' + MARGINS.top + ')');
    
    if (subgroupName == 'Travel') {
      SUBGROUPFRAME.append("text")
        .attr('transform', 'translate(' + MARGINS.left + ')')
        .attr('x', VIS_WIDTH/2)
        .attr('y', MARGINS.top + VIS_HEIGHT/2)
        .attr('text-anchor', 'middle')
        .attr('class', 'header')
        .text('Travel expesnes are not proposed-they are calculated at the end of the semester.');
      return 0
    };

    // get subgroup specific data
    let subgroupData = []
    for (let i = 0; i < data.length; i++) {
      let subgroup = data[i].Subgroup
      if ( subgroup == subgroupName ) { 
        subgroupData.push(data[i]) 
    }};
  
    // x scaling function and axis
    let xscale = d3.scaleBand()
      .domain(subgroupData.map((d) =>
      {return d.Item;}))
      .range([0, VIS_WIDTH - 20]);
    g.append('g')
      .attr('transform', 'translate(' + MARGINS.left + ',' + (MARGINS.top + VIS_HEIGHT) +')')
      .call(d3.axisBottom(xscale))
      .attr('font-size', '8px')
      .selectAll('text')	
              .style('text-anchor', 'end')
              .attr('dx', '-.8em')
              .attr('dy', '.15em')
              .attr('transform', function(d) {
                  return 'rotate(-35)' 
                  });

    // add title and axis labels
    SUBGROUPFRAME.append('text')
      .attr('transform', 'translate(' + MARGINS.left + ')')
      .attr('x', MARGINS.left + VIS_WIDTH/2)
      .attr('y', MARGINS.top / 2)
      .attr('text-anchor', 'middle')
      .attr('class', 'header')
      .text('Proposed Purchases: ' + subgroupName + ' Team');
    SUBGROUPFRAME.append('text')
      .attr('transform', 'translate(' + (MARGINS.left - 8) + ')')
      .attr('x', 0)
      .attr('y', MARGINS.top + VIS_HEIGHT/2)
      .attr('text-anchor', 'middle')
      .attr('class', 'header')
      .attr('font-size', '16px')
      .text('Item Cost');

    // initialize tooltip
    const TOOLTIP = d3.select('.subgroupVis')
    .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);
  
    // create general barchart event handler functions
    function handleMouseover(event, d) {
      TOOLTIP.style('opacity', 1);
      d3.select(this)
        .style('fill', 'yellow');
    };
    function handleMousemove(event, d) {  
      TOOLTIP.html('Item: ' + d.Item + '<br>Semester: ' + d.Semester + '<br>Price: $' + d.Price + '<br>Quantity: ' + d.Quantity + '<br>Total Cost: $' + d.Cost + '<br>Importance: ' + d.Importance + '<br>Vendor: ' + d.Vendor + '<br>Description: ' + d.Description)
        .style('left', (event.pageX + 20) + 'px')
        .style('top', (event.pageY + 20) + 'px'); 
    };

    // define subgroup colors and max y values and make each graph
    if(subgroupName == 'Airframe') {
      let subgroupColor = 'rgb(43, 150, 244)';
      let subgroupMaxY = 600;
      // y scaling function and axis specific to subgroup
        let yscale = d3.scaleLinear()
        .domain([(subgroupMaxY + 20), 0])
        .range([0, VIS_HEIGHT]);
      g.append('g')
        .attr('transform', 'translate(' + MARGINS.left + ',' + MARGINS.top +')')
        .call(d3.axisLeft(yscale))
        .attr('font-size', '10px');
      // adding bars
      g.selectAll('bars')
        .data(subgroupData)
        .enter()
          .append('rect')
          .attr('x', (d) => {
            return (xscale(d.Item) + MARGINS.left + 8)
          })
          .attr('y', (d) => {
            return (MARGINS.top + (yscale(d.Price)))
          })
          .attr('height', (d) => {
            return (VIS_HEIGHT - yscale(d.Price))
          })
          .attr('width', '13px')
          .attr('class', subgroupName);
      // add event listeners to bars
      function handleMouseleave(event, d) {  
        TOOLTIP.style('opacity', 0);
        d3.select(this)
        .style('fill', subgroupColor);       
      };
      g.selectAll('.' + subgroupName)
        .on('mouseover', handleMouseover)
        .on('mousemove', handleMousemove)
        .on('mouseleave', handleMouseleave); 
    } else if(subgroupName == 'Avionics') {
      let subgroupColor = 'rgb(111, 2, 144)';
      let subgroupMaxY = 200;
      // y scaling function and axis specific to subgroup
      let yscale = d3.scaleLinear()
      .domain([(subgroupMaxY + 20), 0])
      .range([0, VIS_HEIGHT]);
    g.append('g')
      .attr('transform', 'translate(' + MARGINS.left + ',' + MARGINS.top +')')
      .call(d3.axisLeft(yscale))
      .attr('font-size', '10px');
    // adding bars
    g.selectAll('bars')
      .data(subgroupData)
      .enter()
        .append('rect')
        .attr('x', (d) => {
          return (xscale(d.Item) + MARGINS.left + 5)
        })
        .attr('y', (d) => {
          return (MARGINS.top + (yscale(d.Price)))
        })
        .attr('height', (d) => {
          return (VIS_HEIGHT - yscale(d.Price))
        })
        .attr('width', '12px')
        .attr('class', subgroupName);
    // add event listeners to bars
    function handleMouseleave(event, d) {  
      TOOLTIP.style('opacity', 0);
      d3.select(this)
      .style('fill', subgroupColor);       
    };
    g.selectAll('.' + subgroupName)
      .on('mouseover', handleMouseover)
      .on('mousemove', handleMousemove)
      .on('mouseleave', handleMouseleave); 
    } else if(subgroupName == 'Internal') {
      let subgroupData = []
      for (let i = 0; i < data.length; i++) {
        let subgroup = data[i].Subgroup
        if ( subgroup == 'Internal Mech' ) { 
          subgroupData.push(data[i]) 
      }};
      // x scaling function and axis
      let xscale = d3.scaleBand()
      .domain(subgroupData.map((d) =>
      {return d.Item;}))
      .range([0, VIS_WIDTH - 10]);
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

      // add title and axis labels
      SUBGROUPFRAME.append('text')
        .attr('transform', 'translate(' + MARGINS.left + ')')
        .attr('x', MARGINS.left + VIS_WIDTH/2)
        .attr('y', MARGINS.top / 2)
        .attr('text-anchor', 'middle')
        .attr('class', 'header')
        .text('Proposed Purchases: ' + subgroupName + ' Team');
      let subgroupColor = 'rgb(219, 26, 94)';
      let subgroupMaxY = 715;
      // y scaling function and axis specific to subgroup
      let yscale = d3.scaleLinear()
      .domain([(subgroupMaxY + 20), 0])
      .range([0, VIS_HEIGHT]);
    g.append('g')
      .attr('transform', 'translate(' + MARGINS.left + ',' + MARGINS.top +')')
      .call(d3.axisLeft(yscale))
      .attr('font-size', '10px');
    // adding bars
    g.selectAll('bars')
      .data(subgroupData)
      .enter()
        .append('rect')
        .attr('x', (d) => {
          return (xscale(d.Item) + MARGINS.left + 2)
        })
        .attr('y', (d) => {
          return (MARGINS.top + (yscale(d.Price)))
        })
        .attr('height', (d) => {
          return (VIS_HEIGHT - yscale(d.Price))
        })
        .attr('width', '10px')
        .attr('class', 'Internal');
    // add event listeners to bars
    function handleMouseleave(event, d) {  
      TOOLTIP.style('opacity', 0);
      d3.select(this)
      .style('fill', subgroupColor);       
    };
    g.selectAll('.Internal')
      .on('mouseover', handleMouseover)
      .on('mousemove', handleMousemove)
      .on('mouseleave', handleMouseleave); 
    } else if(subgroupName == 'Propulsion') {
      let subgroupColor = 'rgb(6, 132, 88)';
      let subgroupMaxY = 475;
      // y scaling function and axis specific to subgroup
      let yscale = d3.scaleLinear()
      .domain([(subgroupMaxY + 20), 0])
      .range([0, VIS_HEIGHT]);
    g.append('g')
      .attr('transform', 'translate(' + MARGINS.left + ',' + MARGINS.top +')')
      .call(d3.axisLeft(yscale))
      .attr('font-size', '10px');
    // adding bars
    g.selectAll('bars')
      .data(subgroupData)
      .enter()
        .append('rect')
        .attr('x', (d) => {
          return (xscale(d.Item) + MARGINS.left + 1)
        })
        .attr('y', (d) => {
          return (MARGINS.top + (yscale(d.Price)))
        })
        .attr('height', (d) => {
          return (VIS_HEIGHT - yscale(d.Price))
        })
        .attr('width', '7px')
        .attr('class', subgroupName);
    // add event listeners to bars
    function handleMouseleave(event, d) {  
      TOOLTIP.style('opacity', 0);
      d3.select(this)
      .style('fill', subgroupColor);       
    };
    g.selectAll('.' + subgroupName)
      .on('mouseover', handleMouseover)
      .on('mousemove', handleMousemove)
      .on('mouseleave', handleMouseleave); 
    } else if(subgroupName == 'Starship') {
      let subgroupColor = 'rgb(238, 157, 6)';
      let subgroupMaxY = 400;
      // y scaling function and axis specific to subgroup
      let yscale = d3.scaleLinear()
      .domain([(subgroupMaxY + 20), 0])
      .range([0, VIS_HEIGHT]);
    g.append('g')
      .attr('transform', 'translate(' + MARGINS.left + ',' + MARGINS.top +')')
      .call(d3.axisLeft(yscale))
      .attr('font-size', '10px');
    // adding bars
    g.selectAll('bars')
      .data(subgroupData)
      .enter()
        .append('rect')
        .attr('x', (d) => {
          return (xscale(d.Item) + MARGINS.left + 26)
        })
        .attr('y', (d) => {
          return (MARGINS.top + (yscale(d.Price)))
        })
        .attr('height', (d) => {
          return (VIS_HEIGHT - yscale(d.Price))
        })
        .attr('width', '25px')
        .attr('class', subgroupName);
    // add event listeners to bars
    function handleMouseleave(event, d) {  
      TOOLTIP.style('opacity', 0);
      d3.select(this)
      .style('fill', subgroupColor);       
    };
    g.selectAll('.' + subgroupName)
      .on('mouseover', handleMouseover)
      .on('mousemove', handleMousemove)
      .on('mouseleave', handleMouseleave); 
    };

})}

// create launch damage vis
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
	.range([0, VIS_WIDTH - 5])
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
    .attr('font-size', '11px')
    .selectAll('text')	
    .style('text-anchor', 'end')
    .attr('dx', '-.8em')
    .attr('dy', '.15em')
    .attr('transform', function(d) {
        return 'rotate(-35)' 
        });;

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
    .attr('font-size', '20px')
    .text('Damages During Launch');

    FRAME4.append('text')
    .attr('transform', 'translate(' + MARGINS.left + ')')
    .attr('x', MARGINS.left + VIS_WIDTH/2)
    .attr('y', MARGINS.top + VIS_HEIGHT + 90)
    .attr('text-anchor', 'middle')
    .attr('class', 'header')
    .attr('font-size', '16px')
    .text('Launch Date');

    FRAME4.append('text')
    .attr('transform', 'translate(' + MARGINS.left + ')')
    .attr('x', 0)
    .attr('y', MARGINS.top + VIS_HEIGHT/2)
    .attr('text-anchor', 'middle')
    .attr('class', 'header')
    .attr('font-size', '16px')
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
      .text('x')
      .attr('font-size', '30px')
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
    TOOLTIP.html('Item: ' + d.Item + '<br>Launch Date: ' + d.Launch_Date + '<br>Amount Broken: ' + d.Number_Broken + '<br>Total Cost: $' + d.Cost)
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
  });