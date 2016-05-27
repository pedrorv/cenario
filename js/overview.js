function createVisOverview() {

  if (!visConfig.dataCircles) {
    d3.json("js/data.json", function(error, json) {
      if (error) return console.warn(error);
      visConfig.data = json;
      console.time("Retorno dados Meses");
      visConfig.dataCircles = returnCirclesData(visConfig.data);
      console.timeEnd("Retorno dados Meses");
      console.time("Gerar visualização");
      createVis();
      console.timeEnd("Gerar visualização");
      console.time("Dados Highlight");
      visConfig.dataHighlight = returnMoviesData(visConfig.data);
      console.timeEnd("Dados Highlight");
    });
  } else {
    createVis();
    visConfig.dataHighlight = returnMoviesData(visConfig.data);
  }

  function createVis() {
    var vis = d3.select("svg")
      .append("g")
      .attr("class", "vis");

    var maxDataCirclesTitles = returnMaxDataCircles(visConfig.dataCircles, "Titulos"),
        minDataCirclesTitles = returnMinDataCircles(visConfig.dataCircles, "Titulos"),
        maxDataCirclesPublic = returnMaxDataCircles(visConfig.dataCircles, "Publico"),
        minDataCirclesPublic = returnMinDataCircles(visConfig.dataCircles, "Publico");

    var fillScale = d3.scale.linear().domain([minDataCirclesPublic,maxDataCirclesPublic]).range(["#e1f3f3","#020f15"]);

    for (var year in visConfig.dataCircles) {
      var visYear = vis.append("g")
        .attr("class", year);
      for (var month in visConfig.dataCircles[year]) {
        var cx, cy;
        visYear.append("circle")
          .attr("class", "_" + month + year)
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
            var rangeVal = maxDataCirclesTitles - minDataCirclesTitles;
            var rangeRadius = visConfig.circleBiggerRadius - visConfig.circleSmallerRadius;
            return visConfig.circleSmallerRadius + (visConfig.dataCircles[year][month]["Titulos"] - minDataCirclesTitles)*rangeRadius/rangeVal;
          })
          .attr("titulos", visConfig.dataCircles[year][month]["Titulos"])
          .attr("publico", visConfig.dataCircles[year][month]["Publico"])
          .attr("fill", fillScale(visConfig.dataCircles[year][month]["Publico"]))
          .on("click", monthHighlight);

        visYear.append("text")
          .attr("x", cx)
          .attr("y", function() {
            return cy - 2 - visConfig.circleBiggerRadius;
          })
          .attr("text-anchor", "middle")
          .attr("font-size", 10)
          .text(visConfig.months[parseInt(month)-1]);
      }

      visYear.append("text")
        .attr("x", function() {
          var circle = d3.select("circle._1" + year);
          var cx = circle.attr("cx");
          return parseFloat(cx) - visConfig.circleBiggerRadius;
        })
        .attr("y", function() {
          var circle = d3.select("circle._1" + year);
          var cy = circle.attr("cy");
          return parseFloat(cy) - visConfig.circleBiggerRadius - visConfig.hYearMargin + 5;
        })
        .attr("text-anchor", "start")
        .attr("font-size", 14)
        .text(year);
    }

    vis.append("text")
      .attr("x", function() {
        return visConfig.width - visConfig.wMargin;
      })
      .attr("y", function() {
        return visConfig.height - visConfig.hYearMargin;
      })
      .attr("text-anchor", "end")
      .text("2009 a 2014 - Visão Geral");
  }

  function monthHighlight() {
    var visBox = d3.select("g.vis")
      .append("g")
      .attr("class", "lightbox");

    visBox.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", visConfig.width)
      .attr("height", visConfig.height)
      .attr("fill", "black")
      .attr("opacity", 0)
      .on("click", removeHighlight)
      .transition()
      .duration(500)
      .attr("opacity", 0.3);

    visBox.append("rect")
      .attr("x", function() {
        return visConfig.width/2 - visConfig.wMonthHighlight/2;
      })
      .attr("y", function() {
        return visConfig.height/2 - visConfig.hMonthHighlight/2;
      })
      .attr("rx", 20)
      .attr("ry", 20)
      .attr("width", function() {
        return visConfig.wMonthHighlight;
      })
      .attr("height", function() {
        return visConfig.hMonthHighlight;
      })
      .attr("fill", "white")
      .attr("opacity", 0)
      .transition()
      .delay(500)
      .duration(500)
      .attr("opacity", 1);
  }

  function removeHighlight() {
    d3.select("g.lightbox").remove();
  }
}
