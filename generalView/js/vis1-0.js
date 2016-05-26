function createVis(dataCircles, dataBars) {

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
        .attr("cx", function() {

        })
        .attr("cy", function() {

        })
    }
  }
}
