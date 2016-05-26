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
      if (parseInt(month) < 4 && visConfig.years[year] < 4) {
        visYear.append("circle")
          .attr("class", month + "/" + year)
          .attr("cx", function () {
            var monthInt = parseInt(month);
            var yearInt = visConfig.years[year];
            var circlePosisition = (((monthInt-1)%3) * (visConfig.circleBiggerRadius*2) + visConfig.circleBiggerRadius) + ((yearInt%4) * visConfig.circleBiggerRadius * 3 * 2);
            var circleMargin = visConfig.wCircleMargin + (visConfig.wCircleMargin * (yearInt%4)) + ((monthInt-1)%3) * visConfig.wCircleMargin;
            var yearsMargin = (yearInt%4) * visConfig.wYearMargin;
            return visConfig.wMargin + circlePosisition + circleMargin + yearsMargin;
          })
          .attr("cy", function() {
            return 100;
          })
          .attr("r", function() {
            var rangeVal = maxDataCircles - minDataCircles;
            var rangeRadius = visConfig.circleBiggerRadius - visConfig.circleSmallerRadius;
            return visConfig.circleSmallerRadius + (visConfig.dataCircles[year][month]["Títulos"] - minDataCircles)*rangeRadius/rangeVal
          });
      }
    }
  }
}
