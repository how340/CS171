console.log("let's get started!")

//data structure used for this project
let sandwiches = [
    { name: "Thesis", price: 7.95, size: "large" },
    { name: "Dissertation", price: 8.95, size: "large" },
    { name: "Highlander", price: 6.50, size: "small" },
    { name: "Just Tuna", price: 6.50, size: "small" },
    { name: "So-La", price: 7.95, size: "large" },
    { name: "Special", price: 12.50, size: "small" }
];

let svg = d3.select("body").append("svg")
            .attr("width", 500)
            .attr("height", 500)


svg.selectAll('circle').data(sandwiches).enter()
    .append("circle")
    .attr("cx", (d, i) => i * 40 + 100) //add a constant of 100 to shift the circles to middle of screen a bit.
    .attr("cy", 50)
    .attr("r", (d) => {
        if (d.size == "small"){
            return 10
        } else {
            return 20
        }
    })
    .attr("fill", (d) => {
        if (d.price < 7.00) {
            return 'green'
        } else {
            return 'yellow'
        }
    })
    .attr("stroke", "black")
    .attr("stroke-width", "2")