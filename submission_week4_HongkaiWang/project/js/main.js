// load in data through csv
d3.csv('data/buildings.csv', (row) => {
    //keep numbers as numerical dtypes
    row.completed = +row.completed
    row.floor     = +row.floor
    row.height_ft = +row.height_ft
    row.height_m  = +row.height_m
    row.height_px = +row.height_px
    return row
}).then((data) => {
    console.log(data)
    //sort the data first for descending order
    let buildingData = data.sort((a,b) => {return b.height_m - a.height_m})
    
    let barHeight = 50
    let barLeft = 300
    let barGap = 80
    //establish svg canvas
    let svg = d3.select("#bar-graph").append('svg')
                .attr("width", 600).attr("height", 800)

    //add horizontal bars
    svg.selectAll("rect")
    .data(buildingData)
    .enter()
    .append('rect')
    .attr('x', barLeft) //left boundary of bars
    .attr('y', (d, i) => i*barGap)
    .attr("width", (d) => d.height_px)//shrink everything down to fit in area.
    .attr('height', barHeight )
    .attr('fill', 'green')
    .on("click", interactiveFacts)

    //add building lables
    svg.selectAll(".building-label")
    .data(buildingData)
    .enter()
    .append("text")
    .attr("class", 'building-label')
    .attr('x', 290) 
    .attr('y', (d, i) => i*barGap + barHeight/2)
    .text((d) => d.building)
    .on("click", interactiveFacts)

    //add height number to bars
    svg.selectAll(".building-height")
    .data(buildingData)
    .enter()
    .append("text")
    .attr("class", 'building-height')
    .attr('x', (d) => barLeft + d.height_px - 33) 
    .attr('y', (d, i) => i*barGap + barHeight/2)
    .text((d) => d.height_m)
    .on("click", interactiveFacts)
})


//make dynamic fact tables
function interactiveFacts(event, data){
    let fact = document.getElementById("facts")
    console.log(data)
    //half-hardcoded for consistent formatting
    fact.innerHTML = `
        <div class="row fact-elements"> 
            <img src="img/${data.image}">
        </div>
        <hr>
        <div class="row fact-elements text-center"><p>${data.building}</p></div>
        <hr>
        <div class="row fact-elements text-center">
            <div class="col-2">Height</div>
            <div class="col-10">${data.height_m}</div>
        </div>
        <hr>
        <div class="row fact-elements text-center">
            <div class="col-2">City</div>
            <div class="col-10">${data.city}</div>
        </div>
        <hr>
        <div class="row fact-elements text-center">
            <div class="col-2">Floors</div>
            <div class="col-10">${data.floors}</div>
        </div>
        <hr>
        <div class="row fact-elements text-center">
            <div class="col-2">Completed</div>
            <div class="col-10">${data.completed}</div>
        </div>

        <div class="row text-center" id="more">
            <a href="https://www.google.com/search?q=${data.building}" target="_blank">Wanna know more about this building?</a>
        </div>
    `
}