console.log("graphs.js loaded");
console.log("STATIC_URL = "+STATIC_URL);

queue()
    .defer(d3.json, STATIC_URL+"panel/data.json")
    .await(makeGraphs);

function makeGraphs(error, articulosJson) {
	
	console.log( Object.keys(articulosJson[0]));

	//Clean the data
	articulosJson.forEach(function(d) {
		d['Hospitalario'] = d['Hospitalario'] == -1 ? "No hospitalario" : "Hospitalario";
		d['Centro'] = d['Centro'].trim();
	});

	//Create a Crossfilter instance
	var ndx = crossfilter(articulosJson);

	//Define Dimensions
	var dateDim = ndx.dimension(function(d) { return d["a\u00f1opub"]; });
	var publicoPrivadoDim = ndx.dimension(function(d) { return d["Publico"]; });
	var hospitalarioDim = ndx.dimension(function(d) { return d["Hospitalario"]; });
	var centroDim = ndx.dimension(function(d) { return d["Centro"]; });

	//Calculate metrics
	var numArticlesByDate = dateDim.group(); 
	var numArticlesByPublicoPrivado = publicoPrivadoDim.group();
	var numArticlesByHospitalario = hospitalarioDim.group();
	var numArticlesByCentro = centroDim.group();
	
	var minDate = dateDim.bottom(1)[0]["a\u00f1opub"];
	var maxDate = dateDim.top(1)[0]["a\u00f1opub"];
	
    //Charts
	var timeChart = dc.barChart("#time-chart");
	var publicoPrivadoBarChart = dc.rowChart("#publico-privado-row-chart");
	var publicoPrivadoPieChart = dc.pieChart("#publico-privado-pie-chart");
	var hospitalarioBarChart = dc.rowChart("#hospitalario-row-chart");
	var centroBarChart = dc.rowChart("#centro-row-chart");

	timeChart
		.width(1000)
		.height(160)
		.margins({top: 10, right: 50, bottom: 30, left: 50})
		.dimension(dateDim)
		.group(numArticlesByDate)
		.transitionDuration(500)
		.x(d3.time.scale().domain([minDate, maxDate]))
		.elasticY(true)		
		.renderLabel(true)	
		.on('renderlet', function(timeChart) {
			console.log("!!!!!!!!!!!");
		    var extra_data = [{x: timeChart.x().range()[0], y: timeChart.y()(200)}, 
		                      {x: timeChart.x().range()[1], y: timeChart.y()(400)}];
		    var line = d3.svg.line()
		        .x(function(d) { return d.x; })
		        .y(function(d) { return d.y; })
		        .interpolate('linear');
		    var path = timeChart.select('g.chart-body').selectAll('path.extra').data([extra_data]);
		    path.enter().append('path').attr('class', 'extra').attr('stroke', 'red');
		    path.attr('d', line);
		})
		.xAxisLabel("Year")	
		.yAxis().ticks(4);	


	publicoPrivadoBarChart
        .width(500)
        .height(250)
        .dimension(publicoPrivadoDim)
        .group(numArticlesByPublicoPrivado)
        .xAxis().ticks(4);

    publicoPrivadoPieChart
        .width(500)
        .height(250)
	    .slicesCap(4)
	    .innerRadius(40)
	    .dimension(publicoPrivadoDim)
	    .group(numArticlesByPublicoPrivado)
	    .legend(dc.legend());

	hospitalarioBarChart
        .width(500)
        .height(250)
        .dimension(hospitalarioDim)
        .group(numArticlesByHospitalario)
        .xAxis().ticks(4);

    centroBarChart
        .width(1000)
        .height(250)
        .dimension(centroDim)
        .group(numArticlesByCentro)
        .ordering(function(d){ return d.calls;})
        .cap(100)
        .othersGrouper(false) //Removes "Other" from the list
        .xAxis().ticks(4);
    
    dc.renderAll();

};