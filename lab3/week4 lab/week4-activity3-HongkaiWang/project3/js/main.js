console.log("let's get started!")

let europeanCountry = d3.csv("data/cities.csv", (row) => {
    row.population = +row.population;
    row.x = +row.x;
    row.y = +row.y;
    return row
}).then((data) => {
    //filter out european countries and save to variable for later use. 
    let euCountry = data.filter((row) => row.eu == 'true')

    //display country info
    d3.select('body').append('p').text(`Number of European cities is: ${euCountry.length}`)
    
    //set up svg canvas
    let svg = d3.select('body').append('svg')
    .attr("width", 700).attr("height", 550)

    //draw circles
    svg.selectAll("circle").data(euCountry).enter()
    .append('circle')
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("r", (d) => {
        if (d.population < 1000000) {
            return 4
        } else {
            return 8
        }
    })
    .attr("fill", 'green')
    .on("click", function(event, d){
        console.log('User just clicked on', d)
    })

    //add text lables
    svg.selectAll(".city-label")
    .data(euCountry)
    .enter()
    .append("text")
    .attr("class", "city-label")
    .attr("x", (d) => d.x)
    .attr("y", (d) => d.y)
    .text((d) => d.city)
    .attr("dy", -10) // Adjust the vertical position of the label (above the circle)
     // this is inspired by chatgpt results for writing clean one line conditionals
    .attr("opacity", d => d.population >= 1000000 ? 1 : 0)
}
)
