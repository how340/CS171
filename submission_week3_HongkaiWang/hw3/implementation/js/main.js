

// DATASETS

// Global variable with 1198 pizza deliveries
// console.log(deliveryData);

// Global variable with 200 customer feedbacks
// console.log(feedbackData.length);


// FILTER DATA, THEN DISPLAY SUMMARY OF DATA & BAR CHART

createVisualization();

function createVisualization() {

	//create new filtered dataset to reduce namespace issues
	let delivery = deliveryDataSelection()
	let feedback = feedbackDataSelection(delivery)

	//delivery data manipulation
	let deliveryCount = delivery.length;
	let pizzaCount = 0;
	let totalSales = 0;
	let averageDeliveryTime = 0 ;
	
	delivery.forEach((element) => {
		averageDeliveryTime += element.delivery_time;
		totalSales += element.price;
		pizzaCount += element.count
	});

	//control the floating point situation
	averageDeliveryTime = (averageDeliveryTime/deliveryCount).toFixed(2);
	totalSales = totalSales.toFixed(2)

	//feedback data manipulation
	let feedbackCount = feedback.length;
	let feedbackLo = 0;
	let feedbackMe = 0;
	let feedbackHi = 0;

	feedback.forEach((element) => {
		if (element.quality == 'low') {
			feedbackLo += 1
		} else if (element.quality == 'medium') {
			feedbackMe += 1
		} else if (element.quality == 'high') {
			feedbackHi += 1
		} else {
			console.log("issue with feedback id: " + element.delivery_id)
		}
	});

	renderDataTable(deliveryCount, pizzaCount, averageDeliveryTime,
		totalSales, feedbackCount, feedbackLo, feedbackMe, feedbackHi);
	//create the table
    renderBarChart(delivery);
}

function renderDataTable(deliveryCount, pizzaCount, averageDeliveryTime,
	totalSales, feedbackCount, feedbackLo, feedbackMe, feedbackHi){
	
	let items = ['deliveryCount', 'pizzaCount', 'averageDeliveryTime',
		'totalSales', 'feedbackCount', 'feedbackLo', 'feedbackMe', 'feedbackHi']
	let data = [deliveryCount, pizzaCount, averageDeliveryTime,
		totalSales, feedbackCount, feedbackLo, feedbackMe, feedbackHi]

	tableArea = document.getElementById('table-area');
	
	items.forEach((item, index) => {
		document.getElementById(item).innerHTML = data[index]
	})
	
}

function deliveryDataSelection(){
	// retrieve data from the selection bars
	let areaSelection = document.getElementById('area-select').value
	let typeSelection = document.getElementById('type-select').value
	
	console.log("filtering on:", areaSelection, typeSelection)

	//create new filted delivery dataset
	let tempData
	if (areaSelection == 'all' && typeSelection != 'all') {
		tempData = deliveryData.filter((element) => {
			return element.order_type == typeSelection
		})
	} else if (areaSelection != 'all' && typeSelection == 'all'){
		tempData = deliveryData.filter((element) => {
			return element.area == areaSelection
		})
	} else if (areaSelection != 'all' && typeSelection != 'all'){
		tempData = deliveryData.filter((element) => {
			return (element.area == areaSelection) && (element.order_type == typeSelection) 
		})
	} else {
		tempData = deliveryData
	}
	
	return tempData
}

// this function takes in the filtered delivery data and produce an array containing 
// all feedbacks in available in the filted dataset
function feedbackDataSelection(delivery){
	let deliveryId = new Set(delivery.map((element) => {return element.delivery_id}))

	let filtedFeedback = feedbackData.filter((element) => {
		return deliveryId.has(element.delivery_id)
	})
	console.log(filtedFeedback)
	return filtedFeedback
}