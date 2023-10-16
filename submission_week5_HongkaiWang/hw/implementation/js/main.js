// Code of this page is inspired by the coding style of this D3 example
// https://d3-graph-gallery.com/graph/area_basic.html


// D3 margin convention
let margin = {top: 100, right: 100, bottom: 50, left: 100};

// Width and height as the inner dimensions of the chart area
let widthLeft = 600 - margin.left - margin.right;
let heightLeft = 500 - margin.top - margin.bottom;

let widthRight = 500 - margin.left - margin.right;
let heightRight = 500 - margin.top - margin.bottom;


// svg left column 
let svg = d3.select("#left-column")
            .append("svg")
            .attr("width", widthLeft + margin.left + margin.right)
            .attr("height", heightLeft + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// svg right column 
let svgRight = d3.select("#right-column")
            .append("svg")
            .attr("width", widthRight + margin.left + margin.right)
            .attr("height", heightRight + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// csv data ingest and parsing.
d3.csv('/data/zaatari-refugee-camp-population.csv', (row)=>{
    let parseTime = d3.utcParse('%Y-%m-%d')

    //add data
    row.population = +row.population
    row.date = parseTime(row.date)

    return row
}).then( data =>{

    drawLeftPanel(data)
    drawRightPanel()

    }
)

// Draws an area graph with interactive tooltip 
function drawLeftPanel(data){

    // Set up xy-axis
    let x = d3.scaleTime()
                      .domain(d3.extent(data, function(d) { return d.date;}))
                      .range([0, widthLeft])

    let y = d3.scaleLinear()
                .domain([0, d3.max(data, function(d) { return d.population})])
                .range([heightLeft, 0]);

    // plot the area
    svg.append("path")
        .datum(data)
        .attr("class", "area-fill")
        .attr("fill", "#cce5df")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 1.5)
        .attr("d", 
        d3.area().x(function(d) { return x(d.date) })
                .y0(y(0))
                .y1(function(d) { return y(d.population) })
        )
    // render boundary of the upper line of the area chart
    svg.append('path')
        .datum(data)
        .attr("class", "area-top")
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("d", 
        d3.line().x(function(d) { return x(d.date) })
                .y(function(d) { return y(d.population) })
        )// this is really cool!

    // render axis last to allow the axis to surface on top
    svg.append('g') 
        .attr("class", 'axis y-axis')
        .call(d3.axisLeft(y))
    svg.append('g') 
        .attr("class", 'axis x-axis')
        .attr("transform", "translate(0," + heightLeft + ")")
        .call(d3.axisBottom(x).ticks(d3.utcMonth.every(4)).tickFormat(d3.utcFormat("%b %Y")));

    // Chart label 
    svg.append('g')
        .append('text')
        .attr("class", "graph-label") 
        .attr("x", widthLeft/2) 
        .attr("y", -50) 
        .style("text-anchor", "middle") 
        .text("Camp Population");

    // y label
    svg.append('g')
		.append("text")
		.attr("class", "axis-label") 
		.attr("x", widthLeft/2) 
		.attr("y", heightLeft + 40) 
		.style("text-anchor", "middle") 
		.text("Time (in month)");

    // x label
    svg.append('g')
		.append("text")
		.attr("class", "axis-label") 
		.attr("x", heightLeft/2) 
		.attr("y", 70) 
		.style("text-anchor", "middle") 
		.text("Population")
		.attr('transform', 'rotate(90) translate(0, -3)')

    // tooltip group
    let tooltip = svg.append('g').attr('class', 'tool-tip').attr('display', 'none')
    // line 
    tooltip.append('line')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', heightLeft)
            .attr('stroke', 'brown')
            .attr('class', 'vline');
    // text for pop value
    tooltip.append('text')
            .attr('id', 'tooltip-pop')
            .attr('transform', 'translate(10,0)')
            .text('pop')
    // text for date
    tooltip.append('text')
            .attr('id', 'tooltip-date')
            .attr('transform', 'translate(10,20)')
            .text('date')

    // cursor tracking with box element
    svg.append('rect')
            .attr('height', heightLeft)
            .attr('width', widthLeft)
            .attr('fill', 'transparent')
            .on('mouseover', (event) => { //set group display to null
                console.log(event.type)
                // need to use d3 to work with svg stuff. Can't directly use getElementByClass
                d3.selectAll('.tool-tip').attr('display', 'null')
            }) 
            .on('mouseout', (event) => { //reset group to display = none
                console.log(event.type)
                toolGroup = document.getElementsByClassName('tool-tip')
                d3.selectAll('.tool-tip').attr('display', 'none')
            }) 
            .on('mousemove', (event) => { //reset group to display = none
                mousemove(event, x, data)
            })
            
}   

// THis function helps to shift the tooltip as cursor moves over the graph.
function mousemove(event, xScale, dateData){
    let bisectDate = d3.bisector(d=>d.date).left;

    // reverse engineer the pointer position to x scale date and array index. 
    let xVal = d3.pointer(event)[0]
    let dateVal = xScale.invert(xVal)
    let ind = bisectDate(dateData, dateVal)

    //upate the tooltip information
    d3.selectAll('.tool-tip').attr('transform', `translate(${xVal}, 0)`)
    d3.select('#tooltip-pop').text('Population: ' + dateData[ind].population)
    d3.select('#tooltip-date').text('Date: ' + dateData[ind].date.toISOString().split('T')[0])
}

// draws a bar graph with static data
function drawRightPanel(){
    //data structure for types of housing in camp. Make this ordered s.t we do less work
    let shelterType = [{'type':'Caravans', 'percent':0.7968}, 
                       {'type':'Combination', 'percent':0.1081},
                       {'type':'Tents', 'percent':0.0951}]

    //set up linear y-axis - need to convert to percentage
    let formatter = d3.format(".0%");
    let y = d3.scaleLinear()
                .domain([0, d3.max(shelterType, (d) => d.percent) + 0.1])
                .range([heightRight, 0])
                
    svgRight.append('g')
        .attr('class', 'axis y-axis')
        .call(d3.axisLeft(y).tickFormat(formatter))


    console.log(shelterType.map((d)=> d.type))
    
    // set up x-axis. 
    let xLabs = ['Caravans', 'Combination', 'Tents']
    let x = d3.scaleBand()
            .domain(xLabs) 
            .range([0, widthRight]).paddingOuter(0.5)
    
    svgRight.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', 'translate(0,' + heightRight+ ')')
            .call(d3.axisBottom(x))

    // create bars
    svgRight.selectAll('rect')
            .data(shelterType)
            .enter()
            .append('rect')
            .attr("class", 'graph-bars')
            .attr('x', (d) =>  x(d.type))
            .attr('y', (d) => y(d.percent))
            .attr('width', 70)
            .attr('height', (d) => {return heightRight - y(d.percent)})
            .attr('fill', 'red')
             
    // add percentage label 
    let formatter2 = d3.format(".1%")
    svgRight.selectAll('.text')
            .data(shelterType)
            .enter()
            .append('text')
            .attr("class", 'percent-label')
            .attr('x', (d) =>  x(d.type) + 35)
            .attr('y', (d) => y(d.percent) - 5)
            .text((d) => {return formatter2(d.percent)})
            .attr('fill', 'black')
            .style("text-anchor", "middle") 

    svgRight.append('text')
            .attr("class", 'note')
            .attr('x', 0)
            .attr('y', 400-10)
            .text('*Combination - Households with \nrecorded tent and caravan combinations')
            .attr('fill', 'black')
            .style("text-anchor", "left") 
            
    // add graph title
    svgRight.append('g')
            .append('text')
            .attr("class", "graph-label") 
            .attr("x", widthRight/2) 
            .attr("y", -50) 
            .style("text-anchor", "middle") 
            .text("Types of Shelter");

    // axis labels
    svgRight.append('g')
        .append("text")
        .attr("class", "axis-label") 
        .attr("x", heightRight/2) 
        .attr("y", 50) 
        .style("text-anchor", "middle") 
        .text("Percentage of Population")
        .attr('transform', 'rotate(90) translate(0, -3)')
}

