var isMobile = window.screen.width < 400 ? true : false;

if(isMobile) {
	d3.selectAll(".mobile").style("display", "inline-block");
	d3.selectAll(".desktop").style("display", "none");
	d3.selectAll(".explanation-text").style("font-size", 13 + "px" );
} else {
	var widthFont = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	//Sort of based on :https://www.smashingmagazine.com/2016/05/fluid-typography/
	d3.selectAll(".explanation-text").style("font-size", Math.min( Math.max(11 + (15 - 11) * (widthFont - 400)/(1000 - 400),11), 15) + "px" );
}

//Make the top title
createTitle();

function createTitle() {

	///////////////////////////////////////////////////////////////////////////
	/////////////////////////////// Set-up SVG ////////////////////////////////
	///////////////////////////////////////////////////////////////////////////

	var margin = {
	  top: 70,
	  right: 10,
	  bottom: 10,
	  left: 10
	};
	var width = 720;
	var height = 200;

	//SVG container
	var svg = d3.select('#headerTitle')
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + (margin.left + width/2) + "," + (margin.top) + ")");

	///////////////////////////////////////////////////////////////////////////
	//////////////////////////// Create the text //////////////////////////////
	///////////////////////////////////////////////////////////////////////////

	svg.append("image")
		.attr("xlink:href", "img/fuzzy-magic-4.jpg")
		.attr("x", -240)
		.attr("y", -70)
		.attr("width", 500)
		.attr("height", 300)
		.style("opacity", 0.9);

	svg.append("text")
		.attr("class", "title-magic")
		.attr("x", 0)
		.attr("y", 110)
		.style("fill", "white")
		.text("Magic");

	svg.append("text")
		.attr("class", "title-rest")
		.attr("x", -160)
		.attr("y", 30)
		.text("The");

	svg.append("text")
		.attr("class", "title-rest")
		.attr("x", 210)
		.attr("y", 145)
		.text("is everywhere");

}//createTitle
