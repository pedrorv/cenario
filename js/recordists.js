function createVisRecordists(userWindowWidth) {

  if (!visConfig.recordistsData) {
    d3.json("js/dataRec.json", function(error, json) {
      if (error) return console.warn(error);
      visConfig.recordistsData = json;
      createVis();
    });
  } else {
    createVis();
  }

  function createVis() {


    visConfig.recModeSelected = "titles";
    visConfig.recMaxYAxisValue = undefined;

    var vis = d3.select("svg.vis")
      .append("g")
      .attr("class", "vis");

    var ratio = scaleRatio(userWindowWidth, visConfig.width, visConfig.baseWidth);

    var superscription = vis.append("g")
      .attr("class", "superscription");

    superscription.append("text")
      .attr("class", "title")
      .attr("x", visConfig.baseWMargin)
      .attr("y", visConfig.baseHMarginVisTitle)
      .attr("text-anchor", "start")
      .attr("fill", visConfig.baseVisTitlesColors)
      .attr("font-size", visConfig.baseVisTitleSize)
      .attr("font-weight", "bold")
      .text("Filmes nacionais com mais de 500mil espectadores");

    superscription.append("text")
      .attr("class", "subtitle")
      .attr("x", visConfig.baseWMargin)
      .attr("y", visConfig.baseHMarginVisSubTitle)
      .attr("text-anchor", "start")
      .attr("fill", visConfig.baseVisTitlesColors)
      .attr("font-size", visConfig.baseVisSubtitle)
      .text("De 1970 a 2014");

    superscription.append("circle")
      .attr("class", "menu-option")
      .attr("cx", visConfig.recFirstOptionCircleW)
      .attr("cy", visConfig.recFirstOptionCircleH)
      .attr("r", visConfig.recOptionCircleRadius)
      .attr("fill", visConfig.recOptionCircleFill)
      .attr("stroke", visConfig.recOptionCircleFill)
      .attr("stroke-width", 1)
      .on("click", function() {
        d3.selectAll("circle.menu-option").attr("fill", "white");
        d3.select(this).attr("fill", visConfig.recOptionCircleFill);
        visConfig.recModeSelected = "titles";
        drawGraph(graphLimit, moviesRadius, moviesDistance, widthForDec);
      });

    superscription.append("text")
      .attr("class", "menu-option")
      .attr("x", visConfig.recFirstTextOptionW)
      .attr("y", visConfig.recFirstTextOptionH)
      .attr("fill", visConfig.recOptionCircleFill)
      .attr("font-size", visConfig.recOptionsTextSize)
      .text("Número de títulos");

    superscription.append("circle")
      .attr("class", "menu-option")
      .attr("cx", visConfig.recFirstOptionCircleW)
      .attr("cy", visConfig.recSecondOptionCircleH)
      .attr("r", visConfig.recOptionCircleRadius)
      .attr("fill", "white")
      .attr("stroke", visConfig.recOptionCircleFill)
      .attr("stroke-width", 1)
      .on("click", function() {
        d3.selectAll("circle.menu-option").attr("fill", "white");
        d3.select(this).attr("fill", visConfig.recOptionCircleFill);
        visConfig.recModeSelected = "public";
        drawGraph(graphLimit, moviesRadius, moviesDistance, widthForDec);
      });

    superscription.append("text")
      .attr("class", "menu-option")
      .attr("x", visConfig.recFirstTextOptionW)
      .attr("y", visConfig.recSecondTextOptionH)
      .attr("fill", visConfig.recOptionCircleFill)
      .attr("font-size", visConfig.recOptionsTextSize)
      .text("Público");

    superscription.append("text")
      .attr("class", "menu-option")
      .attr("x", (visConfig.recOriginW))
      .attr("y", (visConfig.height - visConfig.recGraphXAxisLabelsBottomMargin))
      .attr("fill", visConfig.recOptionCircleFill)
      .attr("font-size", visConfig.recGraphLabelsSize)
      .attr("text-anchor", "start")
      .text("Décadas");


    // Start Drawing Axis Base

    var graph = vis.append("g")
      .attr("class", "graph")
      .append("g")
      .attr("class", "axis");

    d3.select("g.graph")
      .append("g")
      .attr("class", "data");

    graph.append("rect")
      .attr("x", visConfig.recOriginW)
      .attr("y", (visConfig.height - visConfig.recOriginBottomMargin - visConfig.recGraphH))
      .attr("width", visConfig.recGraphW)
      .attr("height", visConfig.recGraphH)
      .attr("fill", "white")
      .on("click", function() {
        console.log("cliquei");
          d3.select("g.movie-detail").remove();
      });


    // Drawing x Axis

    graph.append("line")
      .attr("x1", visConfig.recOriginW)
      .attr("y1", (visConfig.height - visConfig.recOriginBottomMargin))
      .attr("x2", (visConfig.recOriginW + visConfig.recGraphW))
      .attr("y2", (visConfig.height - visConfig.recOriginBottomMargin))
      .attr("stroke", visConfig.recGraphColor)
      .attr("stroke-width", visConfig.recGraphThickness);


    // Draw y line

    graph.append("line")
      .attr("x1", visConfig.recOriginW)
      .attr("y1", (visConfig.height - visConfig.recOriginBottomMargin))
      .attr("x2", visConfig.recOriginW)
      .attr("y2", (visConfig.height - visConfig.recOriginBottomMargin - visConfig.recGraphH))
      .attr("stroke", visConfig.recGraphColor)
      .attr("stroke-width", visConfig.recGraphThickness);

    var decCount = 0;
    var maxMovieCount = 0;

    for (var decade in visConfig.recordistsData) {
      decCount++;
      for (var year in visConfig.recordistsData[decade]) {
        if (visConfig.recordistsData[decade][year].length > maxMovieCount) {
          maxMovieCount = visConfig.recordistsData[decade][year].length;
        }
      }
    }

    var graphLimit = roundMultPowerTen(maxMovieCount);
    var widthAvailable = visConfig.recGraphW - ((decCount - 1) * visConfig.recGraphDecadeSpacing);
    var widthForDec = widthAvailable / decCount;
    var moviesRadius = visConfig.recGraphH / graphLimit / 2;
    var moviesDistance = (widthForDec - 10*2*moviesRadius)/9;

    for (var decade in visConfig.recordistsData) {
      graph.append("text")
        .attr("x", function() {
          return visConfig.recOriginW + widthForDec/2 + visConfig.decadesIndex[decade] * (widthForDec + visConfig.recGraphDecadeSpacing);
        })
        .attr("y", (visConfig.height - visConfig.recGraphXAxisLabelsBottomMargin))
        .attr("fill", visConfig.recGraphColor)
        .attr("font-size", visConfig.recGraphLabelsSize)
        .attr("text-anchor", "middle")
        .text(decade);
    }

    function drawYAxisLabels(limit, radius) {

      for (var i = 0; i <= 10; i++) {
        graph.append("text")
          .attr("class", "yaxis-description")
          .attr("i", i)
          .attr("x", visConfig.recOriginW - visConfig.recGraphYAxisWMargin)
          .attr("y", function() {
            return (visConfig.height - visConfig.recOriginBottomMargin) - i * (limit)/10 * (radius * 2);
          })
          .attr("text-anchor", "end")
          .attr("fill", visConfig.recGraphColor)
          .attr("font-size", visConfig.recGraphLabelsSize)
          .text(function() {
            return i * (limit)/10;
          });
      }

    }

    function drawYAxisLabelsUpdate(maxValue, radius) {

      if (visConfig.recModeSelected === "titles") {
        d3.selectAll("text.yaxis-description")
          .transition()
          .duration(150)
          .attr("y", function() {
            var self = d3.select(this);
            return parseFloat(self.attr("y")) - 1280;
          })
          .each("end", function() {
            var self = d3.select(this);
            self.text(function() {
              var self = d3.select(this);
              return formatNumber(parseInt(self.attr("i")) * (maxValue)/10);
            });
            d3.selectAll("text.yaxis-description")
            .transition()
            .duration(150)
            .attr("y", function(d,i) {
              return (visConfig.height - visConfig.recOriginBottomMargin) - i * (maxValue)/10 * (radius * 2);
            });
          });
      }

      else {
        d3.selectAll("text.yaxis-description")
          .transition()
          .duration(150)
          .attr("y", function() {
            var self = d3.select(this);
            return parseFloat(self.attr("y")) - 1280;
          })
          .each("end", function() {
            var self = d3.select(this);
            self.text(function() {
              var self = d3.select(this);
              return formatNumber(parseInt(self.attr("i")) * (maxValue)/10);
            });
            d3.selectAll("text.yaxis-description")
            .transition()
            .duration(150)
            .attr("y", function(d,i) {
              return visConfig.height - visConfig.recOriginBottomMargin - i * (visConfig.recGraphH/10);
            });
          });
      }

    }

    function checkYAxisUpdate(limit, radius) {
      if (!visConfig.recMaxYAxisValue) {

        visConfig.recMaxYAxisValue = limit;
        drawYAxisLabels(limit, radius);

      } else if (visConfig.recMaxYAxisValue != limit) {

        visConfig.recPreviousMaxYAxisValue = visConfig.recMaxYAxisValue;
        visConfig.recMaxYAxisValue = limit;

        drawYAxisLabelsUpdate(visConfig.recMaxYAxisValue, radius);

      } else {

        visConfig.recPreviousMaxYAxisValue = visConfig.recMaxYAxisValue;

      }
    }

    function drawGraph(limit, radius, movDist, decWidth) {

      d3.select("g.graph-draw").remove();

      var draw = d3.select("g.data")
        .append("g")
        .attr("class", "graph-draw");


      if (visConfig.recModeSelected === "titles") {

        var graphLimit = limit;
        checkYAxisUpdate(graphLimit, moviesRadius);

        for (var decade in visConfig.recordistsData) {
          for (var year in visConfig.recordistsData[decade]) {
            visConfig.recordistsData[decade][year].sort(function(a,b) {
              return a["Público"] - b["Público"];
            });
            visConfig.recordistsData[decade][year].forEach(function(movie, movieIndex) {

              draw.append("circle")
                .datum(movie)
                .attr("class", "movie-info")
                .attr("cx", function() {
                  var decIndex = visConfig.decadesIndex[decade];
                  var yearIndex = parseInt(year[3]);
                  return visConfig.recOriginW + radius +
                         decIndex * (visConfig.recGraphDecadeSpacing + decWidth) +
                         yearIndex * (movDist + radius*2);
                })
                .attr("cy", function() {
                  return (visConfig.height - visConfig.recOriginBottomMargin - radius) -
                         (radius*2 * movieIndex);
                })
                .attr("r", radius)
                .attr("fill", function() {
                  var p = movie["Público"];
                  if (p > 10000000) {
                    return "#1A1A1A";
                  }
                  if (p > 5000000) {
                    return "#666666";
                  }
                  if (p > 2500000) {
                    return "#B2B2B2";
                  }
                  if (p > 1000000) {
                    return "#CCCCCC";
                  }
                  return "#E6E6E6";
                })
                .on("mouseover", function() {
                  var self = d3.select(this);
                  self
                    .transition("grow")
                    .duration(100)
                    .attr("r", radius + 2);
                })
                .on("mouseleave", function() {
                  var self = d3.selectAll("circle.movie-info");
                  self
                    .transition("all-shrink")
                    .duration(100)
                    .attr("r", radius);
                })
                .on("click", function() {
                  d3.select("g.movie-detail").remove();

                  var self = d3.select(this);
                  var center = [parseFloat(self.attr("cx")), parseFloat(self.attr("cy"))];

                  var details = draw.append("g")
                    .attr("class", "movie-detail");

                  var background = details.append("rect")
                    .attr("class", "details-background")
                    .attr("x", center[0])
                    .attr("y", center[1])
                    .attr("rx", 10)
                    .attr("ry", 10)
                    .attr("height", 0)
                    .attr("width", 0)
                    .attr("opacity", 0);

                  var maxWidth = 0;
                  var width,
                      height = 0;

                  var detailsText1 = details.append("text")
                    .attr("class", "movie-detail")
                    .attr("fill", "black")
                    .attr("font-size", visConfig.recDetailsTextSize)
                    .attr("opacity", 0)
                    .text("Título: " + movie["Título"]);

                  width = detailsText1.node().getBBox().width;
                  height += detailsText1.node().getBBox().height;
                  maxWidth = (width > maxWidth) ? width : maxWidth;

                  var detailsText2 = details.append("text")
                    .attr("class", "movie-detail")
                    .attr("fill", "black")
                    .attr("font-size", visConfig.recDetailsTextSize)
                    .attr("opacity", 0)
                    .text("UF: " + movie["UF"]);

                  width = detailsText2.node().getBBox().width;
                  height += detailsText2.node().getBBox().height;
                  maxWidth = (width > maxWidth) ? width : maxWidth;

                  var detailsText3 = details.append("text")
                    .attr("class", "movie-detail")
                    .attr("fill", "black")
                    .attr("font-size", visConfig.recDetailsTextSize)
                    .attr("opacity", 0)
                    .text("Público: " + formatNumber(movie["Público"]));

                  width = detailsText3.node().getBBox().width;
                  height += detailsText3.node().getBBox().height;
                  maxWidth = (width > maxWidth) ? width : maxWidth;

                  background.attr("x", function() {
                        if (center[0] > (visConfig.recOriginW + visConfig.recGraphW/2)) return center[0] - maxWidth - visConfig.recDetailsTotalPadding;
                        return center[0];
                      })
                      .attr("y", center[1] - (height + 2.5*visConfig.recDetailsTextMargin))
                      .attr("width", maxWidth + visConfig.recDetailsTotalPadding)
                      .attr("height", (height + 2.5*visConfig.recDetailsTextMargin))
                      .attr("fill", visConfig.recDetailsRectColor)
                      .transition()
                      .duration(100)
                      .attr("opacity", 0.8);


                   detailsText3.attr("y", center[1] - visConfig.recDetailsTextMargin);
                   detailsText2.attr("y", function() {
                     var dynamicMargin = ((height + 2.5*visConfig.recDetailsTextMargin) -
                                              1.6 * visConfig.recDetailsTextMargin -
                                              detailsText3.node().getBBox().height -
                                              detailsText1.node().getBBox().height -
                                              detailsText2.node().getBBox().height) / 2;

                     return center[1] - visConfig.recDetailsTextMargin -
                            detailsText3.node().getBBox().height -
                            dynamicMargin;
                   });
                   detailsText1.attr("y", function() {
                     return center[1] - (height + 2.5*visConfig.recDetailsTextMargin) +
                            0.6*visConfig.recDetailsTextMargin + detailsText1.node().getBBox().height;
                   })

                   d3.selectAll("text.movie-detail").attr("class", "movie-detail bold").attr("x", function() {
                     if (center[0] > (visConfig.recOriginW + visConfig.recGraphW/2)) return center[0] - maxWidth - visConfig.recDetailsTotalPadding/2;
                     return center[0] + visConfig.recDetailsTotalPadding/2;
                   })
                   .transition()
                   .duration(100)
                   .delay(50)
                   .attr("opacity", 1);
                })
                .attr("opacity", 0)
                .transition()
                .duration(50)
                .delay(function() {
                  var yearIndex = parseInt(year[3]);
                  return 50 + movieIndex * 10;
                })
                .attr("opacity", 1);

            });
          }
        }

      } else {

        var maxPublic = 0;
        for (var decade in visConfig.recordistsData) {
          for (var year in visConfig.recordistsData[decade]) {
            var yearSum = 0;
            visConfig.recordistsData[decade][year].forEach(function(movie) {
              yearSum += movie["Público"];
            });
            if (maxPublic < yearSum) maxPublic = yearSum;

            var graphLimit = roundMultPowerTen(maxPublic);

            checkYAxisUpdate(graphLimit, radius);

            draw.append("rect")
              .attr("class", "year-info")
              .attr("x", function() {
                var decIndex = visConfig.decadesIndex[decade];
                var yearIndex = parseInt(year[3]);
                return visConfig.recOriginW +
                       decIndex * (visConfig.recGraphDecadeSpacing + decWidth) +
                       yearIndex * (movDist + radius*2);
              })
              .attr("y", function() {
                return (visConfig.height - visConfig.recOriginBottomMargin) - yearSum * visConfig.recGraphH / graphLimit;
              })
              .attr("width", (radius * 2))
              .attr("height", function() {
                return yearSum * visConfig.recGraphH / graphLimit;
              })
              .attr("fill", function() {
                  return "#1A1A1A";
              })
              .attr("stroke", "black")
              .attr("stroke-width", 1)
              .attr("opacity", 0)
              .transition()
              .duration(50)
              .delay(function() {
                var yearIndex = parseInt(year[3]);
                return 50 + yearIndex * 10;
              })
              .attr("opacity", 1);

          }
        }
      }

    }

    drawGraph(graphLimit, moviesRadius, moviesDistance, widthForDec);

    scaleVis(ratio);
  }

}
