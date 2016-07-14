function createVisNationalities(userWindowWidth) {

  if (!visConfig.countries) {
    d3.json("js/paises.json", function(error, json) {
      if (error) return console.warn(error);
      visConfig.countries = json;
      d3.json("js/data.json", function(error2, json2) {
        if (error) return console.warn(error2);
        visConfig.dataNationalitiesVis = json2;
        visConfig.dataCircles = returnCirclesData(visConfig.dataNationalitiesVis);
        createVis();
      });
      visConfig.dataHighlight = returnMoviesData(visConfig.dataNationalitiesVis);
    });
  } else {
    createVis();
    visConfig.dataHighlight = returnMoviesData(visConfig.dataNationalitiesVis);
  }

  function createVis() {

    var vis = d3.select("svg")
      .append("g")
      .attr("class", "vis");

    var maxDataCirclesTitles = returnMaxDataCircles(visConfig.dataCircles, "Títulos"),
        minDataCirclesTitles = returnMinDataCircles(visConfig.dataCircles, "Títulos"),
        maxDataCirclesPublic = returnMaxDataCircles(visConfig.dataCircles, "Público"),
        minDataCirclesPublic = returnMinDataCircles(visConfig.dataCircles, "Público");

    var fillScale = d3.scale.linear().domain([minDataCirclesPublic,maxDataCirclesPublic]).range(["#6eced3","#1f0133"]);

    var visGuideLines = vis.append("g")
      .attr("class", "guidelines");

    for (var month in visConfig.months) {
      visGuideLines.append("line")
        .attr("x1", function() {
          return returnXPosition(parseInt(month));
        })
        .attr("y1", function() {
          return visConfig.hTopMargin;
        })
        .attr("x2", function() {
          return returnXPosition(parseInt(month));
        })
        .attr("y2", function() {
          return visConfig.height - visConfig.hBottomMargin;
        })
        .attr("stroke", visConfig.verticalGuidelineHexValue)
        .attr("stroke-width", visConfig.guidelineStrokeWidth)
        .attr("originalmonth", month)
        .attr("currentmonth", month);
    }

    for (var year in visConfig.dataCircles) {
      visGuideLines.append("line")
        .attr("x1", function() {
          return visConfig.wLeftMargin;
        })
        .attr("y1", function() {
          return returnYPosition(visConfig.years[year]);
        })
        .attr("x2", function() {
          return visConfig.width - visConfig.wRightMargin;
        })
        .attr("y2", function() {
          return returnYPosition(visConfig.years[year]);
        })
        .attr("stroke", visConfig.horizontalGuidelineHexValue)
        .attr("stroke-width", visConfig.guidelineStrokeWidth)
        .attr("originalyear", year)
        .attr("currentyear", year);
    }

    var visMonths = vis.append("g")
      .attr("class", "monthBoxes");

    for (var month in visConfig.months) {
      visMonths.append("rect")
        .attr("class", "month")
        .attr("x", function() {
          return returnXPosition(parseInt(month)) - visConfig.circleBiggerRadius;
        })
        .attr("y", visConfig.hMonthMargin)
        .attr("width", (visConfig.circleBiggerRadius*2))
        .attr("height", visConfig.hMonthBox)
        .attr("fill", visConfig.monthBoxHexValue)
        .attr("originalmonth", month)
        .attr("currentmonth", month)
        .call(dragX);

      visMonths.append("text")
        .attr("class", "month")
        .attr("x", function() {
          return returnXPosition(parseInt(month));
        })
        .attr("y", function() {
          return visConfig.hMonthMargin + visConfig.hMonthBox - 4;
        })
        .attr("text-anchor", "middle")
        .attr("fill", "#ffffff")
        .attr("font-size", visConfig.monthBoxTextSize)
        .text(visConfig.months[month])
        .attr("originalmonth", month)
        .attr("currentmonth", month)
        .call(dragX);

      visMonths.append("rect")
        .attr("class", "month")
        .attr("x", function() {
          return returnXPosition(parseInt(month)) - visConfig.circleBiggerRadius;
        })
        .attr("y", visConfig.hMonthMargin)
        .attr("width", (visConfig.circleBiggerRadius*2))
        .attr("height", visConfig.hMonthBox)
        .attr("fill", "#ffffff")
        .attr("opacity", 0.01)
        .attr("originalmonth", month)
        .attr("currentmonth", month)
        .call(dragX);

    }

    for (var year in visConfig.dataCircles) {
      var visYear = vis.append("g")
        .attr("class", year);
      for (var month in visConfig.dataCircles[year]) {
        var cx, cy;
        visYear.append("circle")
          .attr("class", "_" + month + year)
          .attr("cx", function () {
            return returnXPosition(parseInt(month) - 1);
          })
          .attr("cy", function() {
            return returnYPosition(visConfig.years[year]);
          })
          .attr("r", function() {
            var rangeVal = maxDataCirclesTitles - minDataCirclesTitles;
            var rangeRadius = visConfig.circleBiggerRadius - visConfig.circleSmallerRadius;
            return visConfig.circleSmallerRadius + (visConfig.dataCircles[year][month]["Títulos"] - minDataCirclesTitles)*rangeRadius/rangeVal;
          })
          .attr("titulos", visConfig.dataCircles[year][month]["Títulos"])
          .attr("publico", visConfig.dataCircles[year][month]["Público"])
          .attr("year", year)
          .attr("month", month)
          .attr("originalmonth", (month-1))
          .attr("currentmonth", (month-1))
          .attr("originalyear", visConfig.years[year])
          .attr("currentyear", visConfig.years[year])
          .attr("fill", fillScale(visConfig.dataCircles[year][month]["Público"]))
          .on("click", function() {
            var self = d3.select(this);
            monthHighlight(self.attr("month"), self.attr("year"));
          });
      }

      visYear.append("text")
        .attr("x", function() {
          return visConfig.wYearMargin;
        })
        .attr("y", function() {
          return returnYPosition(visConfig.years[year]) + (visConfig.yearTextSize/3);
        })
        .attr("text-anchor", "start")
        .attr("font-size", visConfig.yearTextSize)
        .text(year)
        .attr("originalyear", visConfig.years[year])
        .attr("currentyear", visConfig.years[year])
        .call(dragY);
    }


    scaleVis(scaleRatio(userWindowWidth, visConfig.width, 1366));

  }

}
