


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

    var maxDataCircles = returnMaxDataCircles(visConfig.dataCircles, "Titulos"),
        minDataCircles = returnMinDataCircles(visConfig.dataCircles, "Titulos");

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
            return visConfig.circleSmallerRadius + (visConfig.dataCircles[year][month]["Titulos"] - minDataCircles)*rangeRadius/rangeVal;
          })
          .attr("titulos", visConfig.dataCircles[year][month]["Titulos"]);

        visYear.append("text")
          .attr("x", cx)
          .attr("y", function() {
            return cy - 2 - visConfig.circleBiggerRadius;
          })
          .attr("text-anchor", "middle")
          .attr("font-size", 10)
          .text(visConfig.months[parseInt(month)-1]);
      }
    }
  }
}
