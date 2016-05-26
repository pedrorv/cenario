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
          return visConfig.wMargin + circlePosisition + circleMargin + yearsMargin;
        })
        .attr("cy", function() {
          var monthInt = parseInt(month),
              monthProp = Math.floor((monthInt-1)/3),
              yearInt = visConfig.years[year],
              yearProp = Math.floor(yearInt/4);
          var circlePosisition = (monthProp * (visConfig.circleBiggerRadius*2)) + visConfig.circleBiggerRadius + (yearProp * visConfig.circleBiggerRadius * 4 * 2);
          var circleMargin = visConfig.hCircleMargin + (visConfig.hCircleMargin * yearProp) + monthProp * visConfig.hCircleMargin + (yearProp * visConfig.hCircleMargin * 5);
          var yearsMargin = yearProp * visConfig.hYearMargin + visConfig.hYearMargin;
          return visConfig.hMargin + circlePosisition + circleMargin + yearsMargin;
        })
        .attr("r", function() {
          var rangeVal = maxDataCircles - minDataCircles;
          var rangeRadius = visConfig.circleBiggerRadius - visConfig.circleSmallerRadius;
          return visConfig.circleSmallerRadius + (visConfig.dataCircles[year][month]["Títulos"] - minDataCircles)*rangeRadius/rangeVal
        })
        .attr("títulos", visConfig.dataCircles[year][month]["Títulos"]);
    }
  }
}
