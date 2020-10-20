///////////////////////////////////////////////////////////////////////////
/////////////////////////////// Set-up SVG ////////////////////////////////
///////////////////////////////////////////////////////////////////////////

var marginLegend = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};
var widthLegend = document.getElementById("bookLegend").offsetWidth;
var minRadius = 10,
	maxRadius = 55;
var bookLegendRadius = Math.max(Math.min(maxRadius, widthLegend*0.25), minRadius);

var heightLegend = bookLegendRadius * 5;
var heightLegendCircles = bookLegendRadius * 0.6 * 5;

//SVG container
var svgLegend = d3.select('#bookLegend')
	.append("svg")
	.attr("width", widthLegend + marginLegend.left + marginLegend.right)
	.attr("height", heightLegend + marginLegend.top + marginLegend.bottom)
	.append("g")
	.attr("transform", "translate(" + (marginLegend.left + widthLegend/2) + "," + 
		(marginLegend.top + heightLegend/2) + ")");

var svgLegendCircles = d3.select('#bookLegendCircles')
	.append("svg")
	.attr("width", widthLegend + marginLegend.left + marginLegend.right)
	.attr("height", heightLegendCircles + marginLegend.top + marginLegend.bottom)
	.append("g")
	.attr("transform", "translate(" + (marginLegend.left + widthLegend/2) + "," + 
		(marginLegend.top) + ")");

var legendInterval;

function createLegend(legendTitle, angleScale, alphabet) {

	///////////////////////////////////////////////////////////////////////////
	/////////////////////// Create book specific variables ////////////////////
	///////////////////////////////////////////////////////////////////////////

	var fontLegendScale = d3.scaleSqrt()
		.domain([minRadius, maxRadius])
		.range([12,30]);

	d3.select("#span-visible").html(legendTitle);
	d3.select("#bookTitle").style("font-size", fontLegendScale(bookLegendRadius) + "px");

	//Scale of the mini circles around the bigger ones
	var rMiniScale = d3.scaleSqrt()
		.domain([2,30])
		.range([0.2,1.75]);	

	var radiusCircle = rMiniScale(bookLegendRadius);
	var colorBook = "#FF003C";

	///////////////////////////////////////////////////////////////////////////
	//////////////////// Draw the fav/non-fav circle legend ///////////////////
	///////////////////////////////////////////////////////////////////////////


	//Add the explanation above
	svgLegendCircles.selectAll(".text-circle-legend")
		.data(["Favorite book", "Non-favorite book"])
		.enter().append("text")
		.attr("class", "text-circle-legend")
		.attr("x", function(d,i) { return (i === 0 ? -1 : 1) * widthLegend*0.2; })
		.attr("y", 20)
		.style("font-size", fontLegendScale(bookLegendRadius*0.3) + "px")
		.text(function(d) { return d; });

	svgLegendCircles.append("text")
		.attr("class", "subtext-circle-legend")
		.attr("x", widthLegend*0.2)
		.attr("y", 35)
		.style("font-size", fontLegendScale(bookLegendRadius*0.18) + "px")
		.text("by favorite author");

	//Draw the large circle
	svgLegendCircles.append("circle")
		.attr("class", "book-circle-legend")
		.attr("cx", -widthLegend*0.2)
		.attr("cy", 50 + bookLegendRadius*0.6)
		.attr("r", bookLegendRadius*0.6)
		.style("fill", colorBook);

	svgLegendCircles.append("circle")
		.attr("class", "book-circle-legend")
		.attr("cx", widthLegend*0.2)
		.attr("cy", 50 + bookLegendRadius*0.6)
		.attr("r", bookLegendRadius*0.6)
		.style("fill", "white")
		.style("stroke", colorBook)
		.style("stroke-width", bookLegendRadius*0.075);

	///////////////////////////////////////////////////////////////////////////
	////////////// Calculate all mini circle positionas & paths ///////////////
	///////////////////////////////////////////////////////////////////////////

	//Turn to lowercase
	var title = legendTitle.toLocaleLowerCase();

	//Split the title up into words 
	var words = title.split(" ");
	//Total number of alpha letters
	var numLetters = title.length;
	
	//Only keep a-z characters
	for(var j=0; j<words.length; j++) {
		words[j] = words[j].replace(/[^a-z]/gi, '');
		//numLetters = numLetters + words.length;
	}//for j

	//Array that keeps count of how often a letter has passed
	var letterCount = new Array(26);
	for(var j=0; j<letterCount.length; j++) {
		letterCount[alphabet[j]] = 0
	}//for j

	//Array to save the positions of the letters in
	var letterLoc = new Array(words.length);
	for(var j=0; j<letterLoc.length; j++) {
		letterLoc[j] = new Array(words[j].length);
		for(var k=0; k<letterLoc[j].length; k++) {
			letterLoc[j][k] = {};
		}//for k
	}//for j

	//Array to save the paths in
	var paths = new Array(words.length);
	// for(var j=0; j<paths.length; j++) {
	// 	paths[j] = "";
	// }//for j
	for(var j=0; j<words.length; j++) {
		paths[j] = new Array(words[j].length);
		for(var k=0; k<paths[j].length; k++) {
			paths[j][k] = "";
		}//for k
	}//for j


	//Create the letter circles & paths
	for(var j=0; j<words.length; j++){

		//Split the word into letters
		var letters = words[j].split("");

		//Loop over all letters and draw a small circle around the book circle
		for(var k=0; k<letters.length; k++) {
			//Add the letter to the alphabet counter
			letterCount[letters[k]] += 1;

			//Save positions in array to use later
			letterLoc[j][k].x = (bookLegendRadius + 2.75 * radiusCircle * letterCount[letters[k]] - 0.75 * radiusCircle) * Math.cos(angleScale(letters[k]));
			letterLoc[j][k].y = (bookLegendRadius + 2.75 * radiusCircle * letterCount[letters[k]] - 0.75 * radiusCircle) * Math.sin(angleScale(letters[k]));

		}//for k

		//Draw a line between all the letters in the word
		if(letters.length > 1) {
			for(var k=0; k<(letters.length-1); k++) {
				//Somewhat round the numbers, so Illustrator can handle it
				var x1 = round2(letterLoc[j][k].x),
					y1 = round2(letterLoc[j][k].y),
					x2 = round2(letterLoc[j][k+1].x),
					y2 = round2(letterLoc[j][k+1].y),
					dx = x1 - x2,
					dy = y1 - y2;

				var curve = round2(Math.sqrt(dx*dx + dy*dy) * 0.55);

				//Get the angles to determine the optimum sweepflag
				var a1 = angleScale(letters[k]),
					a2 = angleScale(letters[k+1]);
				var da = (a2-a1)/Math.PI;
			
				var sweepFlag = 1;
				//if( (da > -3/2 && da <= -1) || (da > -1/2 && da <= 0) || (da > 1/2 && da <= 1) || (da > 3/2 && da <= 2) ) {
				if( (da > -1 && da <= 0) || (da > 1 && da <= 2) ) {
					sweepFlag = 0;
				}//if
				
				//Add the new arced section to the path
				paths[j][k] = "M" + x1 + " " + y1 + " A" + curve + " " + curve + " 0 1 " + sweepFlag + " " + x2 + " " + y2;
			}//for k
		}//if

	}//for j

	///////////////////////////////////////////////////////////////////////////
	/////////////////////////// Draw the book legend //////////////////////////
	///////////////////////////////////////////////////////////////////////////

	//Draw the large circle
	var bookCircle = svgLegend.append("circle")
		.datum(legendTitle)
		.attr("class", "book-circle-legend")
		.attr("r", bookLegendRadius)
		.style("fill", colorBook);

	//Draw the letters inside the circle
	var letters = svgLegend.selectAll(".letter-legend")
		.data(alphabet)
		.enter().append("text")
		.attr("class", "letter-legend")
		.attr("x", function(d) { return bookLegendRadius*0.8 * Math.cos(angleScale(d)); })
		.attr("y", function(d) { return bookLegendRadius*0.8 * Math.sin(angleScale(d)); })
		.attr("dy", "0.375em")
		.style("font-size", fontLegendScale(bookLegendRadius) * 0.35 )
		.text(function(d) { return d; })
		.style("opacity", 1);

	//var totalLengths = [];

	//Draw the book circle and stuff around it
	for(var j=0; j<letterLoc.length; j++){
		for(var k=0; k<letterLoc[j].length; k++) {

			//Draw the circle
			svgLegend.append("circle")
				.attr("class", "letter-circle-legend")
				.attr("cx", letterLoc[j][k].x)
				.attr("cy", letterLoc[j][k].y)
				.attr("r", radiusCircle )
				.style("fill", colorBook)
				.style("opacity", 0);

			//Draw the word path
			var pathWord = svgLegend.append("path")
				.attr("class","letter-path-legend")
				.attr("d", paths[j][k])
				.style("stroke", colorBook )
				.style("stroke-width", Math.max(0.3, radiusCircle * 0.5) )
				.style("opacity", 0);

			//totalLengths.push( pathWord.node().getTotalLength() );

		}//for k
	}//for j

	///////////////////////////////////////////////////////////////////////////
	//////////////////////////// Animate the legend ///////////////////////////
	///////////////////////////////////////////////////////////////////////////

	if(isMobile) {
		d3.selectAll(".letter-circle-legend, .letter-legend")
				.style("opacity", 1);

		d3.selectAll(".letter-path-legend")
				.style("opacity", 0.7);
	} else {
		//I'm in a plane right now going from Melbourne to Amsterdam, so 24h without wifi
		//So the code below might not be the most efficient, but this way it was working
		//without the need of online help...

		//Speed in which the animation goes through the letters
		var lettertime = 800;

		//General transition
		var t = d3.transition()
			.duration(lettertime);

		//Mapping between the letter and the position in the alphabet
		var letterNum = []
		for(var i=0; i<alphabet.length; i++)
			letterNum[alphabet[i]] = i;

		//Base opacity of the letters of the alphabet inside the circle
		var letterOpacity = 0.5;

		setTimeout(repeatLegend, 1000);

		//Function that animates the drawing of the title, circles and lines around the legend
		function repeatLegend() {
			var j = 1,
				counter = 0;

			//Set all opacities back to zero
			d3.selectAll(".letter-circle-legend, .letter-path-legend, .letter-legend")
				.transition().duration(1000)
				.style("opacity", 0);

			//Loop through the alphabet for the inner circles
			d3.selectAll(".letter-legend")
				.transition().duration(100).delay(function(d,i) { return i*100; })
				.style("opacity", 1)
				.transition().duration(100).delay(1500)
				.style("opacity", letterOpacity);
			//Fade out the total title on top
			d3.select("#span-visible")
				.transition().duration(2000).delay(1500)
				.style("opacity", 0);
			
			setTimeout(drawWords, alphabet.length*100+100+100+1500);

			//Slowly start drawing the circle and paths of the letters in the title
			function drawWords() {

				//Show the circle for the first letter
				d3.select( d3.selectAll(".letter-circle-legend")._groups[0][0] )
					.style("opacity", 1);
				//Show the letter of the first letter
				var letter = title[0];
				d3.select( d3.selectAll(".letter-legend")._groups[0][letterNum[letter]] )
					.transition(t)
					.style("opacity", 1)
					.transition().duration(lettertime*0.5).delay(lettertime)
					.style("opacity", letterOpacity);
				//Show the first letter in the title above the circle
				d3.select("#span-visible")
					.style("opacity", 1)
					.html(legendTitle.slice(0,1) );
				d3.select("#span-invisible")
					.html(legendTitle.slice(1) );

				//Go through the other letter
				var k = 0,
					counter = 0;

				legendInterval = setInterval(function() {

					letter = title[k+1];

					//Move the title letters around so that the new letters seems to appear
					d3.select("#span-visible")
						.html(legendTitle.slice(0,k+1) );
					d3.select("#span-become-visible")
						.style("opacity", 0)
						.html(legendTitle.slice(k+1,k+2))
						.transition(t)
						.style("opacity", 1);
					d3.select("#span-invisible")
						.html(legendTitle.slice(k+2) );

					if(letter !== " " && letter !== "'") {

						d3.select( d3.selectAll(".letter-legend")._groups[0][letterNum[letter]] )
							.transition(t)
							.style("opacity", 1)
							.transition().duration(lettertime*2).delay(lettertime)
							.style("opacity", letterOpacity);

						d3.select( d3.selectAll(".letter-circle-legend")._groups[0][(counter+1)] )
							.transition(t)
							.style("opacity", 1);

						var pathLetter = d3.select( d3.selectAll(".letter-path-legend")._groups[0][counter] );  
						var totalLength = pathLetter.node().getTotalLength();
						pathLetter
							.style("opacity", 0.7)
						  	.attr("stroke-dasharray", totalLength + " " + totalLength)
							.attr("stroke-dashoffset", totalLength)
						  	.transition(t)
							.attr("stroke-dashoffset", 0);

						counter +=1;
					}//if

					k += 1;

					//Clear the interval when done
					if(k === title.length)
						clearInterval(legendInterval);

				}, lettertime+50);

				setTimeout(showLetters, title.length*lettertime + 3*lettertime + 1000);

			}//drawWords

			//Show all the letters inside the circle in full opacity again
			function showLetters() {
				d3.selectAll(".letter-legend")
					.transition().duration(1000)
					.style("opacity", 1);

				//Repeat the animation
				setTimeout(repeatLegend, 5000);
			}//showLetters

		}//repeatLegend
	
	}//else isMobile

}//createLegend