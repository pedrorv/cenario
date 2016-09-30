function createVisProduction(userWindowWidth) {

  if (!visConfig.productionData) {
    d3.json("js/ufsData.json", function(error, json) {
      if (error) return console.warn(error);
      visConfig.productionData = json;
      d3.json("js/ufs.json", function(error, json) {
        if (error) return console.warn(error);
        visConfig.ufsData = json;
        visConfig.regionsData = returnRegionsData(visConfig.productionData);
        createVis();
      });
    });
  } else {
    createVis();
  }

  function createVis() {

    // Initial state of vis
    for (var uf in visConfig.proUfsFilter) {
      visConfig.proUfsFilter[uf] = false;
    }
    for (var region in visConfig.regionsFilter) {
      visConfig.regionsFilter[region] = true;
    }

    var vis = d3.select("svg.vis")
      .append("g")
      .attr("class", "vis");

    var ratio = scaleRatio(userWindowWidth, visConfig.width, visConfig.baseWidth);

    var superscription = vis.append("g")
      .attr("class", "superscription");

    superscription.append("text")
      .attr("class", "title")
      .attr("x", function() {
        return visConfig.natWMargin;
      })
      .attr("y", function() {
        return visConfig.superHMargin + 1.5* visConfig.superTextSize;
      })
      .attr("text-anchor", "start")
      .attr("fill", visConfig.monthBoxHexValue)
      .attr("font-size", visConfig.natTitleSize)
      .attr("font-weight", "bold")
      .text("Produção nacional");

    superscription.append("text")
      .attr("class", "subtitle")
      .attr("x", function() {
        return visConfig.natWMargin;
      })
      .attr("y", function() {
        return 2 * visConfig.superHMargin + 1.5* visConfig.superTextSize + visConfig.superSubtextSize;
      })
      .attr("text-anchor", "start")
      .attr("fill", visConfig.monthBoxHexValue)
      .attr("font-size", visConfig.natSubTitleSize)
      .text("Participação na produção cinematográfica brasileira por UF");

    var ufs = d3.select("div.visualization").append("div")
      .attr("id", "word-cloud");

    for (var uf in visConfig.ufsData) {
      ufs.append("p")
        .attr("class", "uf bold")
        .attr("id", uf)
        .style({
          "font-size": function() {
            var max = visConfig.ufsData['RJ']['Total'];
            var min = visConfig.ufsData['AM']['Total'];
            var fontMax = 37;
            var fontMin = 8;
            return fontMin + (visConfig.ufsData[uf]["Total"] - min) * (fontMax - fontMin) / (max - min) + "px";
          },
          color: "#000",
          display: "inline-block",
          padding: "5px"
        })
        .text(visConfig.ufsData[uf]["Estado"].toUpperCase())
        .on("click", function() {
          var self = d3.select(this);
          var uf = self.attr("id");
          visConfig.proUfsFilter[uf] = !visConfig.proUfsFilter[uf];
          var region = visConfig.ufsData[uf]["Região"].toLowerCase();
          self.classed(region, !self.classed(region));
          updateGraph();
        });
    }

    var menuFilters = vis.append("g")
      .attr("class", "menu-filters");

    menuFilters.append("text")
      .attr("class", "subtitle")
      .attr("x", function() {
        return visConfig.proWMargin;
      })
      .attr("y", function() {
        return visConfig.proMenuTopMargin;
      })
      .attr("text-anchor", "start")
      .attr("fill", visConfig.monthBoxHexValue)
      .attr("font-size", visConfig.proMenuTitleSize)
      .attr("font-weight", "bold")
      .text("Produção por região");

    menuFilters.append("text")
      .attr("class", "subtitle")
      .attr("x", function() {
        return visConfig.proWMargin;
      })
      .attr("y", function() {
        return visConfig.proMenuTopMargin + visConfig.proSelStartTopMargin
               + visConfig.proMenuCirclesHDist + visConfig.proMenuSecondTitleTopMargin;
      })
      .attr("text-anchor", "start")
      .attr("fill", visConfig.monthBoxHexValue)
      .attr("font-size", visConfig.proMenuTitleSize)
      .attr("font-weight", "bold")
      .text("Estados brasileiros produtores");

    for (var i = 0; i < visConfig.regionsArr.length; i++) {
      menuFilters.append("circle")
        .attr("class", "region-selector")
        .attr("r", visConfig.natMenuCirclesRadius)
        .attr("i", i)
        .attr("cx", function() {
          return visConfig.proWMargin + visConfig.proMenuCirclesRadius + ((i%3)*visConfig.proMenuCirclesWDist);
        })
        .attr("cy", function() {
          return visConfig.proMenuTopMargin + ((Math.floor(i/3) + 1) * visConfig.proMenuCirclesHDist) + visConfig.proMenuCirclesRadius;
        })
        .attr("fill", function() {
          return visConfig.regionsColors[visConfig.regionsArr[i]];
        })
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .on("click", function() {
          var self = d3.select(this);
          var region = parseInt(self.attr("i"));
          self.attr("fill", function() {
            return (self.attr("fill") == "white") ? visConfig.regionsColors[visConfig.regionsArr[region]] : "white";
          });
          visConfig.regionsFilter[visConfig.regionsArr[region]] = !visConfig.regionsFilter[visConfig.regionsArr[region]];
          updateGraph();
        });

      menuFilters.append("text")
        .attr("class", "subtitle")
        .attr("x", function() {
          return visConfig.proWMargin + 2.7*visConfig.proMenuCirclesRadius + ((i%3)*visConfig.proMenuCirclesWDist);
        })
        .attr("y", function() {
          return visConfig.proMenuTopMargin + ((Math.floor(i/3) + 1) * visConfig.proMenuCirclesHDist) + 1.7*visConfig.proMenuCirclesRadius;
        })
        .attr("text-anchor", "start")
        .attr("fill", visConfig.monthBoxHexValue)
        .attr("font-size", visConfig.proMenuSelectionSize)
        .text(function() {
          return visConfig.regionsArr[i];
        });

    }

    // Start Drawing Axis Base

    var graph = vis.append("g")
      .attr("class", "graph")
      .append("g")
      .attr("class", "axis");

    d3.select("g.graph")
      .append("g")
      .attr("class", "paths");

    d3.select("g.graph")
      .append("g")
      .attr("class", "circles");


    graph.append("text")
      .attr("class", "graph-description")
      .attr("x", function() {
        return visConfig.proWMargin + visConfig.proProdLabelLeftMargin - visConfig.proLabelRightMargin;
      })
      .attr("y", function() {
        return visConfig.proProdLabelTopMargin;
      })
      .attr("text-anchor", "start")
      .attr("fill", visConfig.natContinentColor)
      .attr("font-size", visConfig.proLabelSize)
      .text("Total produzido");

    graph.append("text")
      .attr("class", "graph-description")
      .attr("x", function() {
        return visConfig.proWMargin + visConfig.proYearsLabelLeftMargin - visConfig.proLabelRightMargin;
      })
      .attr("y", function() {
        return visConfig.proAxisStartH + visConfig.proYearsLabelTopMargin;
      })
      .attr("text-anchor", "start")
      .attr("fill", visConfig.natContinentColor)
      .attr("font-size", visConfig.proLabelSize)
      .text("Anos");

    // Drawing x Axis

    graph.append("line")
      .attr("x1", (visConfig.proWMargin + visConfig.proAxisStartW))
      .attr("y1", function() {
        return visConfig.proAxisStartH;
      })
      .attr("x2", function() {
        return (visConfig.proWMargin + visConfig.proAxisStartW + visConfig.proXAxisW);
      })
      .attr("y2", function() {
        return visConfig.proAxisStartH;
      })
      .attr("stroke", visConfig.proPathsColor)
      .attr("stroke-width", visConfig.proLinesWidth);


    // Draw y line

    graph.append("line")
      .attr("x1", (visConfig.proWMargin + visConfig.proAxisStartW))
      .attr("y1", function() {
        return visConfig.proAxisStartH;
      })
      .attr("x2", function() {
        return (visConfig.proWMargin + visConfig.proAxisStartW);
      })
      .attr("y2", function() {
        return visConfig.proAxisStartH - visConfig.proYAxisH;
      })
      .attr("stroke", visConfig.proPathsColor)
      .attr("stroke-width", visConfig.proLinesWidth);

    for (var i = 0; i <= visConfig.proYearsArr.length; i++) {
      graph.append("text")
        .attr("class", "xaxis-description")
        .attr("x", function() {
          return (visConfig.proWMargin + visConfig.proAxisStartW) + i*visConfig.proXAxisW/(visConfig.proYearsArr.length-1);
        })
        .attr("y", function() {
          return visConfig.proAxisStartH + visConfig.proYearsLabelTopMargin;
        })
        .attr("text-anchor", "middle")
        .attr("fill", visConfig.natContinentColor)
        .attr("font-size", visConfig.proLabelSize)
        .text(function() {
          return visConfig.proYearsArr[i];
        });

      if (i > 0) {
        graph.append("line")
          .attr("class", "x-guidelines")
          .attr("x1", function() {
            return (visConfig.proWMargin + visConfig.proAxisStartW) + i*visConfig.proXAxisW/(visConfig.proYearsArr.length-1);
          })
          .attr("y1", function() {
            return visConfig.proAxisStartH;
          })
          .attr("x2", function() {
            return (visConfig.proWMargin + visConfig.proAxisStartW) + i*visConfig.proXAxisW/(visConfig.proYearsArr.length-1);
          })
          .attr("y2", function() {
            return visConfig.proAxisStartH - visConfig.proYAxisH;
          })
          .attr("stroke", visConfig.proGuidelinesColor)
          .attr("stroke-width", visConfig.proLinesWidth);
      }
    }

    for (var i = 1; i <= 10; i++) {
      graph.append("line")
        .attr("class", "y-guidelines")
        .attr("i", i)
        .attr("x1", (visConfig.proWMargin + visConfig.proAxisStartW))
        .attr("x2", (visConfig.proWMargin + visConfig.proAxisStartW + visConfig.proXAxisW))
        .attr("y1", (visConfig.proAxisStartH - i * (visConfig.proYAxisH/10)))
        .attr("y2", (visConfig.proAxisStartH - i * (visConfig.proYAxisH/10)))
        .attr("stroke", visConfig.proGuidelinesColor)
        .attr("stroke-width", visConfig.proLinesWidth)
    }

    drawGraph();

    function drawYAxisLabels(maxValue) {

      var graph = d3.select("g.axis");

      for (var i = 0; i <= 10; i++) {
        graph.append("text")
          .attr("class", "yaxis-description")
          .attr("i", i)
          .attr("x", function() {
            return (visConfig.proWMargin + visConfig.proAxisStartW - visConfig.proLabelRightMargin);
          })
          .attr("y", function() {
            return visConfig.proAxisStartH - i * (visConfig.proYAxisH/10);
          })
          .attr("text-anchor", "end")
          .attr("fill", visConfig.natContinentColor)
          .attr("font-size", visConfig.proLabelSize)
          .text(function() {
            return i * (maxValue)/10;
          });
      }

    }

    function drawYAxisLabelsUpdate(maxValue) {

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
            return parseInt(self.attr("i")) * (maxValue)/10;
          });
          d3.selectAll("text.yaxis-description")
          .transition()
          .duration(150)
          .attr("y", function(d,i) {
            return visConfig.proAxisStartH - i * (visConfig.proYAxisH/10);
          });
        });

    }

    function updateLine(identifier, dataset) {

      var id = identifier.toLowerCase();

      d3.select("path#" + id).remove();

      var circles = d3.select("g.circles");
      var paths = d3.select("g.paths");

      circles.selectAll("circle#" + id)
        .data(dataset)
        .transition()
        .duration(150)
        .attr("cx", function(d,i) {
          return (visConfig.proWMargin + visConfig.proAxisStartW) + i*visConfig.proXAxisW/(visConfig.proYearsArr.length-1);
        })
        .attr("cy", function(d,i) {
          var amount = d;
          var y = amount * visConfig.proYAxisH / (visConfig.proMaxYValue);
          return visConfig.proAxisStartH - y;
        });

      var lineFunction = d3.svg
                            .line()
                            .x(function(d, i) {
                              return (visConfig.proWMargin + visConfig.proAxisStartW) + i*visConfig.proXAxisW/(visConfig.proYearsArr.length-1);
                            })
                            .y(function(d, i) {
                              var amount = d;
                              var y = amount * visConfig.proYAxisH / (visConfig.proMaxYValue);
                              return visConfig.proAxisStartH - y;
                            })
                            .interpolate("linear");


      var lineGraph = paths.append("path")
                        .attr("id", id)
                        .attr("d", lineFunction(dataset))
                        .attr("stroke", visConfig.proPathsColor)
                        .attr("stroke-width", visConfig.proLinesWidth)
                        .attr("fill", "none")
                        .attr("opacity", 0)
                        .transition()
                        .duration(100)
                        .delay(150)
                        .attr("opacity", 1);

    }



    function drawLine(identifier, dataset) {

      var paths = d3.select("g.paths");
      var circles = d3.select("g.circles");

      var id = identifier.toLowerCase();

      var lineFunction = d3.svg
                            .line()
                            .x(function(d, i) {
                              return (visConfig.proWMargin + visConfig.proAxisStartW) + i*visConfig.proXAxisW/(visConfig.proYearsArr.length-1);
                            })
                            .y(function(d, i) {
                              var amount = d;
                              var y = amount * visConfig.proYAxisH / (visConfig.proMaxYValue);
                              return visConfig.proAxisStartH - y;
                            })
                            .interpolate("linear");

      var lineGraph = paths.append("path")
                        .attr("id", id)
                        .attr("d", lineFunction(dataset))
                        .attr("stroke", visConfig.proPathsColor)
                        .attr("stroke-width", visConfig.proLinesWidth)
                        .attr("fill", "none")
                        .attr("opacity", 0)
                        .transition()
                        .duration(100)
                        .delay(200)
                        .attr("opacity", 1);

      if (!visConfig.regionsColors[identifier]) {
        var fill = visConfig.regionsColors[visConfig.ufsData[identifier]["Região"]];
      } else {
        var fill = visConfig.regionsColors[identifier];
      }

      circles.selectAll("circle#" + id)
        .data(dataset)
        .enter()
        .append("circle")
        .attr("id", id)
        .attr("class", "graph-points")
        .attr("cx", function(d,i) {
          return (visConfig.proWMargin + visConfig.proAxisStartW) + i*visConfig.proXAxisW/(visConfig.proYearsArr.length-1);
        })
        .attr("cy", function(d,i) {
          var amount = d;
          var y = amount * visConfig.proYAxisH / (visConfig.proMaxYValue);
          return visConfig.proAxisStartH - y;
        })
        .attr("r", visConfig.proCircleRadius)
        .attr("fill", fill)
        .attr("opacity", 0)
        .transition()
        .duration(150)
        .delay(function(d,i) {
          return i*10;
        })
        .attr("opacity", 1);


    }

    function updateGraph() {
      setTimeout(drawGraph, 250);
    }

    function drawGraph() {

      // Calculate Paramaters

      var dataHolder = visConfig.regionsData;
      var maxDataRegions = 0;
      var minDataRegions = Infinity;

      for (var region in dataHolder) {
        if (!visConfig.regionsFilter[region]) continue;
        for (var j = 0; j < dataHolder[region].length; j++) {
          if (dataHolder[region][j] > maxDataRegions) {
            maxDataRegions = dataHolder[region][j];
          }
          if (dataHolder[region][j] < minDataRegions) {
            minDataRegions = dataHolder[region][j];
          }
        }
      }

      // Calculate Paramaters 2

      var dataHolder2 = visConfig.productionData;

      for (var uf in dataHolder2) {
        if (!visConfig.proUfsFilter[uf]) continue;
        for (var j = 0; j < dataHolder2[uf].length; j++) {
          if (dataHolder2[uf][j] > maxDataRegions) {
            maxDataRegions = dataHolder2[uf][j];
          }
          if (dataHolder2[uf][j] < minDataRegions) {
            minDataRegions = dataHolder2[uf][j];
          }
        }
      }

      if (!visConfig.proMaxYValue) {

        visConfig.proMaxYValue = roundMultPowerTen(maxDataRegions);
        drawYAxisLabels(visConfig.proMaxYValue);

      } else if (visConfig.proMaxYValue != roundMultPowerTen(maxDataRegions)) {

        visConfig.proPreviousMaxYValue = visConfig.proMaxYValue;
        visConfig.proMaxYValue = roundMultPowerTen(maxDataRegions);

        if (d3.selectAll("text.yaxis-description").empty()) {
          drawYAxisLabels(visConfig.proMaxYValue);
        } else {
          drawYAxisLabelsUpdate(visConfig.proMaxYValue);
        }

      } else {

        visConfig.proPreviousMaxYValue = visConfig.proMaxYValue;
        if (d3.selectAll("text.yaxis-description").empty()) {
          drawYAxisLabels(visConfig.proMaxYValue);
        }

      }

      for (var region in visConfig.regionsData) {
        var id = region.toLowerCase();
        if (visConfig.regionsFilter[region]) {
          if (d3.selectAll("circle#" + id).empty()) {
            drawLine(region, visConfig.regionsData[region]);
          } else {
            if (visConfig.proMaxYValue !== visConfig.proPreviousMaxYValue) {
              updateLine(region, visConfig.regionsData[region]);
            }
          }
        }
        else {
          if (!d3.selectAll("circle#" + id).empty()) {
            d3.selectAll("circle#" + id).remove();
            d3.selectAll("path#" + id).remove();
          }
        }
      }

      for (var uf in visConfig.productionData) {
        var id = uf.toLowerCase();
        if (visConfig.proUfsFilter[uf]) {
          if (d3.selectAll("circle#" + id).empty()) {
            drawLine(uf, visConfig.productionData[uf]);
          } else {
            if (visConfig.proMaxYValue !== visConfig.proPreviousMaxYValue) {
              updateLine(uf, visConfig.productionData[uf]);
            }
          }
        }
        else {
          if (!d3.selectAll("circle#" + id).empty()) {
            d3.selectAll("circle#" + id).remove();
            d3.selectAll("path#" + id).remove();
          }
        }
      }

    }

    scaleVis(ratio);
  }

}
