


function createVisOverview() {

  d3.json("js/data.json", function(error, json) {
    if (error) return console.warn(error);
    visConfig.data = json;
    visConfig.dataCircles = returnCirclesData(visConfig.data);
    createVis();
  });

  function createVis() {
    var vis = d3.select("svg")
      .append("g")
      .attr("class", "vis");

    var maxDataCircles = returnMaxDataCircles(visConfig.dataCircles, "Títulos"),
        minDataCircles = returnMinDataCircles(visConfig.dataCircles, "Títulos");

    for (var year in visConfig.dataCircles) {
      var visYear = vis.append("g")
        .attr("class", year);
      for (var month in visConfig.dataCircles[year]) {
        var cx, cy;
        visYear.append("circle")
          .attr("class", month + "/" + year)
          .attr("cx", function () {
            var monthInt = parseInt(month),
                monthProp = ((monthInt-1)%3),
                yearInt = visConfig.years[year],
                yearProp = yearInt%4;
            var circlePosisition = (monthProp * (visConfig.circleBiggerRadius*2) + visConfig.circleBiggerRadius) + (yearProp * visConfig.circleBiggerRadius * 3 * 2);
            var circleMargin = visConfig.wCircleMargin + (visConfig.wCircleMargin * yearProp) + monthProp * visConfig.wCircleMargin + (yearProp * visConfig.wCircleMargin * 4);
            var yearsMargin = yearProp * visConfig.wYearMargin;
            cx = visConfig.wMargin + circlePosisition + circleMargin + yearsMargin;
            return cx;
          })
          .attr("cy", function() {
            var monthInt = parseInt(month),
                monthProp = Math.floor((monthInt-1)/3),
                yearInt = visConfig.years[year],
                yearProp = Math.floor(yearInt/4);
            var circlePosisition = (monthProp * (visConfig.circleBiggerRadius*2)) + visConfig.circleBiggerRadius + (yearProp * visConfig.circleBiggerRadius * 4 * 2);
            var circleMargin = visConfig.hCircleMargin + (visConfig.hCircleMargin * yearProp) + monthProp * visConfig.hCircleMargin + (yearProp * visConfig.hCircleMargin * 5);
            var yearsMargin = yearProp * visConfig.hYearMargin + visConfig.hYearMargin;
            cy = visConfig.hMargin + circlePosisition + circleMargin + yearsMargin;
            return cy;
          })
          .attr("r", function() {
            var rangeVal = maxDataCircles - minDataCircles;
            var rangeRadius = visConfig.circleBiggerRadius - visConfig.circleSmallerRadius;
            return visConfig.circleSmallerRadius + (visConfig.dataCircles[year][month]["Títulos"] - minDataCircles)*rangeRadius/rangeVal;
          })
          .attr("títulos", visConfig.dataCircles[year][month]["Títulos"]);

        visYear.append("text")
          .attr("class", "month")
          .attr("x", cx)
          .attr("y", function() {
            return cy - 2 - visConfig.circleBiggerRadius;
          })
          .attr("text-anchor", "middle")
          .attr("font-size", 10)
          .text(visConfig.months[parseInt(month)-1]);
      }

      visYear.append("text")
        .attr("class", "year")
        .attr("x", function() {
          var circle = "circle.1/" + year;
          var cx = d3.selectAll(circle)[0][0].attributes.cx.value;
          return parseFloat(cx) - visConfig.circleBiggerRadius;
        })
        .attr("y", function() {
          var circle = "circle.1/" + year;
          var cy = d3.selectAll(circle)[0][0].attributes.cy.value;
          return parseFloat(cy) - visConfig.circleBiggerRadius - visConfig.hYearMargin;
        })
        .attr("text-anchor", "start")
        .attr("font-size", 14)
        .text(year);
    }
  }
}