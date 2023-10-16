
// Margin object with properties for the four directions
let margin = {top: 20, right: 10, bottom: 20, left: 10};

// Width and height as the inner dimensions of the chart area
let width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

let padding = 30;

// Load CSV file
d3.csv("data/wealth-health-2014.csv", d => {
	d.LifeExpectancy = +d.LifeExpectancy
	d.Income = +d.Income
	d.Population = d.Population
	return d;
}).then( data => {
	// Analyze the dataset in the web console
	console.log(data);
	console.log("Countries: " + data.length)

	// TODO: sort the data
	data.sort((a, b) => {return b.Population - a.Population})

	//setting up x and y scales
	let incomeMax = d3.max(data, function(d){return d.Income})
	let incomeMin = d3.min(data, function(d){return d.Income})
	let lifeMax = d3.max(data, function(d){return d.LifeExpectancy})
	let lifeMin = d3.min(data, function(d){return d.LifeExpectancy})

	let incomeScale = d3.scaleLog().domain([incomeMin - 300 , incomeMax + 1000 ]).range([0,width])
	let lifeExpectancyScale = d3.scaleLinear().domain([lifeMin-10, lifeMax+10 ]).range([height, 0]) //inverted to put high life expectancy on top.

	// testing the scale function outputs
	console.log(incomeScale(5000))
	console.log(lifeExpectancyScale(68))

	// svg body
	let svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// svg axes
	let xAxis = d3.axisBottom().scale(incomeScale);
	let yAxis = d3.axisLeft().scale(lifeExpectancyScale)
	
	svg.append('g')
		.attr("class", 'axis x-axis')
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
	svg.append('g')
		.attr("class", 'axis y-axis')
		.attr("transform", "translate(40, 0)")
		.call(yAxis)
	
	// axes titles
	svg.append('g')
		.append("text")
		.attr("class", "axis-label") 
		.attr("x", width/2) 
		.attr("y", height + 20) 
		.style("text-anchor", "middle") 
		.text("National Income");

	// the rotate transformation is rotating off the origin of svg
	svg.append('g')
		.append("text")
		.attr("class", "axis-label") 
		.attr("x", height/2) 
		.attr("y", 0) 
		.style("text-anchor", "middle") 
		.text("Life Expectancy")
		.attr('transform', 'rotate(90) translate(0, -3)')
	
	// population scale for dynamic radius 
	let popMax = d3.max(data, function(d){return d.Population})
	let popMin = d3.min(data, function(d){return d.Population})
	let populationScale = d3.scaleLinear().domain([popMin, popMax]).range([4, 6])

	// color scale

	let regions = data.map((value)=>{return value.Region})
	let colorPalette = d3.scaleOrdinal(d3.schemeCategory10).domain(removeusingSet(regions));

	svg.selectAll('circle')
	.data(data)
	.enter()
	.append('circle')
	.attr('class', 'country-dots')
	.attr('cx', (d) => {return incomeScale(d.Income)})
	.attr('cy', (d) => {return lifeExpectancyScale(d.LifeExpectancy)})
	.attr('r', (d) => {return populationScale(d.Population)})
	.attr('stroke', 'black')
	.attr('fill', (d)=>{return colorPalette(d.Region)})
});


// TODO: create a separate function that is in charge of drawing the data, which means it takes the sorted data as an argument
// function ... (){}
let outputArray = [];
 
function removeusingSet(arr) {
    let outputArray = Array.from(new Set(arr))
    return outputArray
}