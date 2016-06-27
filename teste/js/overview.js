function createVisOverview(userWindowWidth) {

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

    // var drag = d3.behavior.drag()
    //     .on("drag", function() {
    //         var dx = d3.event.dx,
    //             dy = d3.event.dy,
    //             self = this,
    //             svg = d3.select("svg");
    //         var x = returnXPosition(parseInt(self.attr("currentmonth")));
    //         var coordinates = d3.mouse(svg);
    //         var index = testXPosition(coordinates[0]);
    //         if (index) {
    //           if (index > parseInt(self.attr("currentmonth"))) {
    //
    //           }
    //         }
    //         d3.selectAll("*[currentmonth='"+self.attr("currentmonth")+"']")
    //         })
    //     });

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
        .attr("currentmonth", month);

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
        .attr("currentmonth", month);

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
        .attr("currentmonth", month);
        // .on("drag", function() {
        //   var self = this;
        //   //,
        //   //     svg = d3.select("svg");
        //   // var x = returnXPosition(parseInt(self.attr("currentmonth")));
        //   // var coordinates = d3.mouse(svg);
        //   // var index = testXPosition(coordinates[0]);
        //   // if (index) {
        //   //   if (index > parseInt(self.attr("currentmonth"))) {
        //   //
        //   //   }
        //   // }
        //   // d3.selectAll("*[currentmonth='"+self.attr("currentmonth")+"']")
        // })
        // .on("dragend", function() {
        //   var self = d3.select(this),
        //     svg = d3.select("svg");
        //   var x = returnXPosition(parseInt(self.attr("currentmonth")));
        //   var coordinates = d3.mouse(svg.node());
        //   var index = testXPosition(coordinates[0]);
        //   console.log(index);
        //   var originalmonth = parseInt(self.attr("originalmonth"));
        //
        //   if (index !== false) {
        //     d3.selectAll("rect.month[originalmonth='" + originalmonth + "']")
        //       .transition()
        //       .duration(300)
        //       .attr("x", function() {
        //         return returnXPosition(index)- visConfig.circleBiggerRadius;
        //       });
        //
        //     d3.select("text.month[originalmonth='" + originalmonth + "']")
        //       .transition()
        //       .duration(300)
        //       .attr("x", function() {
        //         return returnXPosition(index);
        //       });
        //   }
        // });
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
          .attr("originalmonth", month)
          .attr("currentmonth", month)
          .attr("originalyear", year)
          .attr("currentyear", year)
          .attr("fill", fillScale(visConfig.dataCircles[year][month]["Público"]))
          .on("click", function() {
            var self = d3.select(this);
            monthHighlight(self.attr("originalmonth"), self.attr("originalyear"));
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
        .attr("originalyear", year)
        .attr("currentyear", year);
    }


    scaleVis(scaleRatio(userWindowWidth, visConfig.width, 1366));

  }

  function monthHighlight(month, year) {
    var visBox = d3.select("g.vis")
      .append("g")
      .attr("class", "lightbox");

    visBox.append("rect")
      .attr("id", "lightbox")
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

    visBox.append("text")
      .attr("class", "header")
      .attr("id", "close")
      .attr("x", function() {
        return parseFloat(d3.select("rect.highlight").attr("x")) + visConfig.wMonthHighlight - visConfig.wHighlightMargin;
      })
      .attr("y", function() {
        return parseFloat(d3.select("rect.highlight").attr("y")) + visConfig.hHighlightMargin + visConfig.HighlightHeadersSize;
      })
      .attr("text-anchor", "end")
      .text("X")
      .attr("opacity", 0)
      .on("click", function() {
        removeHighlight();
      })
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
        .attr("originalmonth", month)
        .attr("originalyear", year)
        .attr("opacity", 0)
        .on("click", function() {
          var self = d3.select(this);
          var index = parseInt(self.attr("i"));
          showFilmDetail(index, self, self.attr("originalmonth"), self.attr("originalyear"));
        })
        .transition()
        .delay(700)
        .duration(300)
        .attr("opacity", 0.3)
        .each("end", function() {
          var index0 = d3.select("circle#ranked-movie-0");
          showFilmDetail(0, index0, index0.attr("originalmonth"), index0.attr("originalyear"));
        });
    }

  }

  function showFilmDetail(index, referenceCircle, month, year) {

    d3.select("g.movie-info").remove();

    d3.selectAll("circle.movies-ranking").attr("opacity", 0.3);
    referenceCircle.attr("opacity", 1);


    var visBox = d3.select("g.lightbox")
      .append("g")
      .attr("class", "movie-info");

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
        return visConfig.dataHighlight[year][parseInt(month)-1][index]["Título"];
      })
      .attr("opacity", 0)
      .transition()
      .delay(200)
      .duration(300)
      .attr("opacity", 1);

    visBox.append("text")
      .attr("class", "info")
      .attr("x", function() {
        return parseFloat(d3.select("rect.highlight").attr("x")) + visConfig.wHighlightMargin;
      })
      .attr("y", function() {
        return parseFloat(d3.select("text#header3").attr("y")) + visConfig.hHighlightTextMargin + visConfig.HighlightTextsSize;
      })
      .attr("text-anchor", "start")
      .text(function() {
        return "Gênero: " + visConfig.dataHighlight[year][parseInt(month)-1][index]["Gênero"];
      })
      .attr("opacity", 0)
      .transition()
      .delay(200)
      .duration(300)
      .attr("opacity", 1);

    visBox.append("text")
      .attr("class", "info")
      .attr("x", function() {
        return parseFloat(d3.select("rect.highlight").attr("x")) + visConfig.wHighlightMargin;
      })
      .attr("y", function() {
        return parseFloat(d3.select("text#header3").attr("y")) + 2*visConfig.hHighlightTextMargin + 2*visConfig.HighlightTextsSize;
      })
      .attr("text-anchor", "start")
      .text(function() {
        return "Nacionalidade: " + visConfig.dataHighlight[year][parseInt(month)-1][index]["País"];
      })
      .attr("opacity", 0)
      .transition()
      .delay(200)
      .duration(300)
      .attr("opacity", 1);

    visBox.append("text")
      .attr("class", "info")
      .attr("x", function() {
        return parseFloat(d3.select("circle#ranked-movie-2").attr("cx"));
      })
      .attr("y", function() {
        return parseFloat(d3.select("text#header3").attr("y")) + visConfig.hHighlightTextMargin + visConfig.HighlightTextsSize;
      })
      .attr("text-anchor", "start")
      .text(function() {
        return "Público: " + formatNumber(visConfig.dataHighlight[year][parseInt(month)-1][index]["Público"]);
      })
      .attr("opacity", 0)
      .transition()
      .delay(200)
      .duration(300)
      .attr("opacity", 1);

    visBox.append("text")
      .attr("class", "info")
      .attr("x", function() {
        return parseFloat(d3.select("circle#ranked-movie-2").attr("cx"));
      })
      .attr("y", function() {
        return parseFloat(d3.select("text#header3").attr("y")) + 2*visConfig.hHighlightTextMargin + 2*visConfig.HighlightTextsSize;
      })
      .attr("text-anchor", "start")
      .text(function() {
        return "Renda: R$" + formatNumber(visConfig.dataHighlight[year][parseInt(month)-1][index]["Renda"]);
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