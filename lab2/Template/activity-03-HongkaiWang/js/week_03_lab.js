
// Global variable with 60 attractions (JSON format)
// console.log(attractionData);

dataFiltering();

function dataFiltering() {
	let attractions = attractionData;

	console.log('hello from your js file. Good luck with the lab!');

	// FIX THIS SORTING CODE
	attractions.sort(function (a, b) {
		//reversed to get descending order
		return  b.Visitors - a.Visitors;
	})

	console.log('Sorted Array', attractions);

	let top5 = attractions.slice(0,5);
	/*or we do:
	let anotherTop5 = attractions.filter((value, index) => {
		return index < 5;
	});*/

	console.log(top5);

	renderBarChart(top5);
}


function dataManipulation() {
	let selectBox = document.getElementById("attraction-category");
	let selectedValue = selectBox.options[selectBox.selectedIndex].value;
	let attractions = attractionData;

	console.log(selectedValue)

	if (selectedValue == 'all') {
		attractions.sort(function (a, b) {
			//reversed to get descending order
			return  b.Visitors - a.Visitors;
		});
		renderBarChart(attractions.slice(0,5));

	} else {

		// assign a new data structure to resolve scope issue
		let temp = attractions.filter((element) => {
			return element.Category == selectedValue
		});

		console.log(temp)
		temp.sort(function (a, b) {
			//reversed to get descending order
			return  b.Visitors - a.Visitors;
		});

		renderBarChart(temp.slice(0,5));
	};
}