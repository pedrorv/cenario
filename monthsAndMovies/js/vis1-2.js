function createVis(dataCircles, dataBars) {

  var movies = d3.select("svg")
    .append("g")
    .attr("class", "movies");

  var months = d3.select("svg")
    .append("g")
    .attr("class", "months");

  var guidelines = d3.select("svg")
    .append("g")
    .attr("class", "guides");

  var maxDataCircles = returnMaxDataCircles(dataCircles, "Público"),
      maxDataBars = returnMaxDataBars(dataBars, "Público"),
      lineGraph,
      monthY,
      monthX;

  for (var year in dataBars) {
    lineGraph = [];
    for (var month in dataBars[year]) {
        var monthValue = parseInt(month);
        monthY = visConfig.hMargin + ((monthValue - 1) * visConfig.barSpacing) + (visConfig.years[year] * visConfig.barSpacing * visConfig.barSpacing) + (visConfig.years[year] * visConfig.barMargin);

        guidelines.append("line")
        .attr("class", "guide")
        .attr("x1", function(d, i) {
          return visConfig.wMargin;
        })
        .attr("y1", function(d, i) {
          return monthY;
        })
        .attr("x2", function(d, i) {
          return visConfig.width - visConfig.wMargin;
        })
        .attr("y2", function(d, i) {
          return monthY;
        });

        months.append("line")
          .attr("class", "month")
          .attr("x1", function(d, i) {
            return visConfig.wMargin;
          })
          .attr("y1", function(d, i) {
            return monthY;
          })
          .attr("x2", function(d, i) {
            monthX = (visConfig.wMargin) + (425 * dataBars[year][month]["Público"]/maxDataBars);
            return monthX;
          })
          .attr("y2", function(d, i) {
            return monthY;
          });

        lineGraph[monthValue - 1] = {
          x: monthX,
          y: monthY
        };

        var line = d3.svg.line()
          .interpolate("linear")
          .x(function(d) { return d.x; })
          .y(function(d) { return d.y; });

        months.append("path")
          .datum(lineGraph)
          .attr("class", "line")
          .attr("d", line);

        var moviesA = [];
        for (var movie in dataCircles[year][month]) {
          moviesA.push(dataCircles[year][month][movie]);
        }

        for (var k = 0; k < moviesA.length; k++) {
          movies.append("circle")
            .attr("class", "movie")
            .attr("cx", function(d, i) {
              return (visConfig.wMargin) + (10 * k);
            })
            .attr("cy", function(d, i) {
              return monthY;
            })
            .attr("r", visConfig.circleRadius);
        }
      }
  }
}
