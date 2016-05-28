function createVisOverview() {

  if (!visConfig.dataCircles) {
    d3.json("js/data.json", function(error, json) {
      if (error) return console.warn(error);
      visConfig.data = json;
      visConfig.dataCircles = returnCirclesData(visConfig.data);
      createVis();
      visConfig.dataHighlight = returnMoviesData(visConfig.data);
    });
  } else {
    createVis();
    visConfig.dataHighlight = returnMoviesData(visConfig.data);
  }

  function createVis() {
    var vis = d3.select("svg")
      .append("g")
      .attr("class", "vis");

    var maxDataCirclesTitles = returnMaxDataCircles(visConfig.dataCircles, "Títulos"),
        minDataCirclesTitles = returnMinDataCircles(visConfig.dataCircles, "Títulos"),
        maxDataCirclesPublic = returnMaxDataCircles(visConfig.dataCircles, "Público"),
        minDataCirclesPublic = returnMinDataCircles(visConfig.dataCircles, "Público");

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
            return visConfig.circleSmallerRadius + (visConfig.dataCircles[year][month]["Títulos"] - minDataCirclesTitles)*rangeRadius/rangeVal;
          })
          .attr("titulos", visConfig.dataCircles[year][month]["Títulos"])
          .attr("publico", visConfig.dataCircles[year][month]["Público"])
          .attr("month", month)
          .attr("year", year)
          .attr("fill", fillScale(visConfig.dataCircles[year][month]["Público"]))
          .on("click", function() {
            var self = d3.select(this);
            monthHighlight(self.attr("month"), self.attr("year"));
          });

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

  function monthHighlight(month, year) {
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
      .attr("class", "highlight")
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
      .delay(300)
      .duration(500)
      .attr("opacity", 1);

    visBox.append("text")
      .attr("class", "header")
      .attr("id", "header1")
      .attr("x", function() {
        return parseFloat(d3.select("rect.highlight").attr("x")) + visConfig.wHighlightMargin;
      })
      .attr("y", function() {
        return parseFloat(d3.select("rect.highlight").attr("y")) + visConfig.hHighlightMargin + visConfig.HighlightHeadersSize;
      })
      .attr("text-anchor", "start")
      .text(function() {
        return visConfig.months[parseInt(month)-1] + " - " + year;
      })
      .attr("opacity", 0)
      .transition()
      .delay(700)
      .duration(300)
      .attr("opacity", 1);

    visBox.append("line")
      .attr("class", "highlight-division")
      .attr("id", "line1")
      .attr("x1", function() {
        return parseFloat(d3.select("rect.highlight").attr("x")) + visConfig.wHighlightMargin;
      })
      .attr("y1", function() {
        return parseFloat(d3.select("rect.highlight").attr("y")) + visConfig.hHighlightLine1Spacing;
      })
      .attr("x2", function() {
        return parseFloat(d3.select("rect.highlight").attr("x")) + visConfig.wMonthHighlight - visConfig.wHighlightMargin;
      })
      .attr("y2", function() {
        return parseFloat(d3.select("rect.highlight").attr("y")) + visConfig.hHighlightLine1Spacing;
      })
      .attr("opacity", 0)
      .transition()
      .delay(700)
      .duration(300)
      .attr("opacity", 1);

    visBox.append("line")
      .attr("class", "highlight-division")
      .attr("id", "line2")
      .attr("x1", function() {
        return parseFloat(d3.select("rect.highlight").attr("x")) + visConfig.wHighlightMargin;
      })
      .attr("y1", function() {
        return parseFloat(d3.select("rect.highlight").attr("y")) + visConfig.hHighlightLine2Spacing;
      })
      .attr("x2", function() {
        return parseFloat(d3.select("rect.highlight").attr("x")) + visConfig.wMonthHighlight - visConfig.wHighlightMargin;
      })
      .attr("y2", function() {
        return parseFloat(d3.select("rect.highlight").attr("y")) + visConfig.hHighlightLine2Spacing;
      })
      .attr("opacity", 0)
      .transition()
      .delay(700)
      .duration(300)
      .attr("opacity", 1);

    visBox.append("text")
      .attr("class", "info")
      .attr("x", function() {
        return parseFloat(d3.select("rect.highlight").attr("x")) + visConfig.wHighlightMargin;
      })
      .attr("y", function() {
        return parseFloat(d3.select("line#line1").attr("y1")) + visConfig.hHighlightTextMargin + visConfig.HighlightTextsSize;
      })
      .attr("text-anchor", "start")
      .text(function() {
        return "Total de público: " + formatNumber(visConfig.dataCircles[year][month]["Público"]);
      })
      .attr("opacity", 0)
      .transition()
      .delay(700)
      .duration(300)
      .attr("opacity", 1);

    visBox.append("text")
      .attr("class", "info")
      .attr("x", function() {
        return parseFloat(d3.select("rect.highlight").attr("x")) + visConfig.wHighlightMargin;
      })
      .attr("y", function() {
        return parseFloat(d3.select("line#line2").attr("y1")) - visConfig.hHighlightTextMargin;
      })
      .attr("text-anchor", "start")
      .text(function() {
        return "Total de renda: R$" + formatNumber(visConfig.dataCircles[year][month]["Renda"]);
      })
      .attr("opacity", 0)
      .transition()
      .delay(700)
      .duration(300)
      .attr("opacity", 1);

    visBox.append("text")
      .attr("class", "header")
      .attr("id", "header2")
      .attr("x", function() {
        return parseFloat(d3.select("rect.highlight").attr("x")) + visConfig.wHighlightMargin;
      })
      .attr("y", function() {
        return parseFloat(d3.select("line#line2").attr("y1")) + visConfig.hHighlightMargin + visConfig.HighlightHeadersSize;
      })
      .attr("text-anchor", "start")
      .text(function() {
        return "Filmes mais vistos entre os " + visConfig.dataCircles[year][month]["Títulos"] + " lançados";
      })
      .attr("opacity", 0)
      .transition()
      .delay(700)
      .duration(300)
      .attr("opacity", 1);

    for (var i = 0; i < 5; i++) {
      visBox.append("circle")
        .attr("class", "movies-ranking")
        .attr("id", "ranked-movie-" + i)
        .attr("cx", function() {
          var boxX = parseFloat(d3.select("rect.highlight").attr("x"));
          var position = (visConfig.wMonthHighlight - 2*visConfig.wHighlightMargin - 2*visConfig.circleRankingBiggerRadius) / 4;
          return boxX + visConfig.wHighlightMargin + visConfig.circleRankingBiggerRadius + (position * i);
        })
        .attr("cy", function() {
          var headerY = parseFloat(d3.select("text#header2").attr("y"));
          return headerY + visConfig.circleRankingBiggerRadius + visConfig.circleRankingHMargin;
        })
        .attr("r", function() {
          var max = visConfig.dataHighlight[year][parseInt(month)-1][0]["Público"];
          var min = visConfig.dataHighlight[year][parseInt(month)-1][4]["Público"];
          var rangeVal = max - min;
          var rangeRadius = visConfig.circleRankingBiggerRadius - visConfig.circleRankingSmallerRadius;
          return visConfig.circleRankingSmallerRadius + (visConfig.dataHighlight[year][parseInt(month)-1][i]["Público"] - min)*rangeRadius/rangeVal;
        })
        .attr("i", i)
        .attr("year", year)
        .attr("month", month)
        .attr("opacity", 0)
        .on("click", function() {
          var self = d3.select(this);
          var index = parseInt(self.attr("i"));
          showFilmDetail(index, self, self.attr("month"), self.attr("year"));
        })
        .transition()
        .delay(700)
        .duration(300)
        .attr("opacity", 0.7)
        .each("end", function() {
          var index0 = d3.select("circle#ranked-movie-0");
          showFilmDetail(0, index0, index0.attr("month"), index0.attr("year"));
        });
    }

  }

  function showFilmDetail(index, referenceCircle, month, year) {

    d3.selectAll("text#header3").remove();

    d3.selectAll("circle.movies-ranking").attr("opacity", 0.7);
    referenceCircle.attr("opacity", 1);


    var visBox = d3.select("g.lightbox");

    visBox.append("text")
      .attr("class", "header")
      .attr("id", "header3")
      .attr("x", function() {
        return parseFloat(d3.select("rect.highlight").attr("x")) + visConfig.wHighlightMargin;
      })
      .attr("y", function() {
        return parseFloat(d3.select("circle#ranked-movie-0").attr("cy")) + visConfig.circleRankingBiggerRadius + visConfig.circleRankingHMargin + visConfig.HighlightHeadersSize;
      })
      .attr("text-anchor", "start")
      .text(function() {
        return visConfig.dataHighlight[parseInt(year)][parseInt(month)-1][index]["Título"];
      })
      .attr("opacity", 0)
      .transition()
      .delay(200)
      .duration(300)
      .attr("opacity", 1);
  }

  function removeHighlight() {
    d3.select("g.lightbox").remove();
  }
}
