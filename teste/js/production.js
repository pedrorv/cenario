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
          drawGraph();
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
          drawGraph();
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
      .attr("stroke", visConfig.monthBoxHexValue)
      .attr("stroke-width", visConfig.natGraphStrokeWidth);


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
      .attr("stroke", visConfig.monthBoxHexValue)
      .attr("stroke-width", visConfig.natGraphStrokeWidth);

    for (var i = 0; i <= visConfig.proYearsArr.length; i++) {
      graph.append("text")
        .attr("class", "axis-description")
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
    }

    drawGraph();

    function drawXAxisLabels(maxValue) {

      var graph = d3.select("g.axis");

      for (var i = 0; i <= (roundMultPowerTen(maxValue)/10); i++) {
        graph.append("text")
          .attr("class", "xaxis-description")
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
            return i * roundMultPowerTen(maxValue)/10;
          });
      }

    }

    function drawXAxisLabelsUpdate(maxValue) {

      d3.selectAll("text.xaxis-description")
        .transition()
        .duration(200)
        .attr("y", function() {
          var self = d3.select(this);
          return parseFloat(self.attr("y")) - 1280;
        })
        .each("end", function() {
          var self = d3.select(this);
          self.text(function() {
            var self = d3.select(this);
            return parseInt(self.attr("i")) * roundMultPowerTen(maxValue)/10;
          });
          d3.selectAll("text.xaxis-description")
          .transition()
          .duration(200)
          .attr("y", function() {
            var self = d3.select(this);
            return parseFloat(self.attr("y")) + 1280;
          });
        });

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

      if (!visConfig.maxValueXAxis) {
        visConfig.maxValueXAxis = maxDataRegions;
        drawXAxisLabels(visConfig.maxValueXAxis);
      } else if (visConfig.maxValueXAxis != maxDataRegions) {
        visConfig.maxValueXAxis = maxDataRegions;
        drawXAxisLabelsUpdate(visConfig.maxValueXAxis);
      }



    }


      //
      // for (var i = 0; i <= 10; i++) {
      //   graph.append("line")
      //     .attr("x1", function() {
      //       return visConfig.natGraphLeft + i * ((visConfig.width - visConfig.natGraphLeft - visConfig.natGraphRight)/10);
      //     })
      //     .attr("y1", function() {
      //       return visConfig.height - visConfig.natHMarginGraphAxis - visConfig.natGraphAxisDivHeight;
      //     })
      //     .attr("x2", function() {
      //       return visConfig.natGraphLeft + i * ((visConfig.width - visConfig.natGraphLeft - visConfig.natGraphRight)/10);
      //     })
      //     .attr("y2", function() {
      //       return visConfig.height - visConfig.natHMarginGraphAxis + visConfig.natGraphAxisDivHeight;
      //     })
      //     .attr("stroke", visConfig.monthBoxHexValue)
      //     .attr("stroke-width", visConfig.natGraphStrokeWidth);
      //
      // graph.append("text")
      //   .attr("class", "axis-description")
      //   .attr("x", function() {
      //     return visConfig.natGraphLeft + i * ((visConfig.width - visConfig.natGraphLeft - visConfig.natGraphRight)/10);
      //   })
      //   .attr("y", function() {
      //     return visConfig.height - visConfig.natHMarginGraphAxis + visConfig.natGraphAxisDivHeight + 1.5*visConfig.natContinentNameSize;
      //   })
      //   .attr("text-anchor", "middle")
      //   .attr("fill", visConfig.natContinentColor)
      //   .attr("font-size", visConfig.natSubTitleSize)
      //   .text(function() {
      //     return visConfig.publicFilter.min + i*(maxDataNations - visConfig.publicFilter.min)/10;
      //   });
      // }
      //
      // // Drawing Graph
      //
      // var auxContinent = 0;
      // for (var continent = 0; continent < dataHolder.length; continent++) {
      //
      //   if (dataHolder[continent].length > 0) {
      //
      //     for (var country = 0; country < dataHolder[continent].length; country++) {
      //
      //       // Drawing Bars
      //
      //       graph.append("rect")
      //         .attr("class", function() {
      //           return "country-bar bar" + auxContinent + "-" + country;
      //         })
      //         .attr("item", function() {
      //           return auxContinent + "-" + country;
      //         })
      //         .datum(dataHolder[continent][country])
      //         .attr("x", function() {
      //           if (auxContinent == 0 && country == 0) {
      //               return visConfig.natWMargin;
      //           } else {
      //             if (country > 0) {
      //               var reference = "rect.bar" + auxContinent + "-" + (country - 1);
      //               var x = parseFloat(d3.select(reference).attr("x"));
      //               var width = parseFloat(d3.select(reference).attr("width"));
      //               return x + width + visConfig.natGraphSpacing;
      //             } else {
      //               var reference = "rect.bar" + (auxContinent-1) + "-" + (dataHolder[lastContinent].length - 1);
      //               var x = parseFloat(d3.select(reference).attr("x"));
      //               var width = parseFloat(d3.select(reference).attr("width"));
      //               return x + width + visConfig.natGraphSpacing + visConfig.natGraphContinentSpacing;
      //             }
      //           }
      //         })
      //         .attr("y", function() {
      //           return visConfig.height - visConfig.natHMarginGraphAxis - visConfig.natHMarginGraph - visConfig.natHGraphBar;
      //         })
      //         .attr("width", function() {
      //           var titles = dataHolder[continent][country]["Dados"]["Títulos"];
      //           return (titles * totalWidthAvailable)/titlesSum;
      //         })
      //         .attr("height", visConfig.natHGraphBar)
      //         .attr("fill", visConfig.continentsColors[visConfig.continentsArr[continent]])
      //         .attr("stroke-width", 0)
      //         .attr("stroke", "transparent")
      //         .on("click", function() {
      //           var self = d3.select(this);
      //           var data = self.data()[0];
      //           d3.select("text.country-description").text(data["País"]);
      //           d3.select("text.titles-description").text(function() {
      //             if (data["Dados"]["Títulos"] > 1) return data["Dados"]["Títulos"] + " filmes lançados";
      //             return data["Dados"]["Títulos"] + " filme lançado";
      //           });
      //           d3.select("text.public-description").text(function() {
      //             return formatNumber(parseInt(data["Dados"]["Média"])) + " espectadores em média";
      //           });
      //           d3.selectAll("rect.country-bar").attr("stroke", "transparent").attr("stroke-width", 0);
      //           d3.selectAll("path.country-path").attr("stroke", "transparent").attr("stroke-width", 0);
      //           self.attr("stroke", visConfig.natStrokesColor).attr("stroke-width", visConfig.natStrokesWidth);
      //           d3.select("path.path" + self.attr("item")).attr("stroke", visConfig.natStrokesColor).attr("stroke-width", visConfig.natStrokesWidth);
      //         });
      //
      //       // Drawing Paths
      //
      //       graph.append("path")
      //         .attr("class", function() {
      //           return "country-path path" + auxContinent + "-" + country;
      //         })
      //         .datum(dataHolder[continent][country])
      //         .attr("d", function() {
      //             var avrg = dataHolder[continent][country]["Dados"]["Média"];
      //             var endingX = (avrg - visConfig.publicFilter.min) * totalAxisWidth / (maxDataNations - visConfig.publicFilter.min);
      //             endingX += visConfig.natGraphLeft;
      //             var reference = "rect.bar" + auxContinent + "-" + (country);
      //             var width = parseFloat(d3.select(reference).attr("width"));
      //             var startingX = parseFloat(d3.select(reference).attr("x"));
      //             var startingY = parseFloat(d3.select(reference).attr("y")) + visConfig.natHGraphBar;
      //             var endingY = visConfig.height - visConfig.natHMarginGraphAxis;
      //
      //             return "M" + startingX + " " +
      //                     startingY +
      //                    " L" + (startingX + width) + " " + startingY +
      //                    " L" + endingX + " " + endingY + " Z";
      //         })
      //         .attr("fill", visConfig.continentsColors[visConfig.continentsArr[continent]])
      //         .attr("stroke-width", 0)
      //         .attr("stroke", "transparent")
      //         .on("click", function() {
      //           var self = d3.select(this);
      //           var data = self.data()[0];
      //           d3.select("text.country-description").text(data["País"]);
      //           d3.select("text.titles-description").text(function() {
      //             if (data["Dados"]["Títulos"] > 1) return data["Dados"]["Títulos"] + " filmes lançados";
      //             return data["Dados"]["Títulos"] + " filme lançado";
      //           });
      //           d3.select("text.public-description").text(function() {
      //             return formatNumber(parseInt(data["Dados"]["Média"])) + " espectadores em média";
      //           });
      //           d3.selectAll("rect.country-bar").attr("stroke", "transparent").attr("stroke-width", 0);
      //           d3.selectAll("path.country-path").attr("stroke", "transparent").attr("stroke-width", 0);
      //           self.attr("stroke", visConfig.natStrokesColor).attr("stroke-width", visConfig.natStrokesWidth);
      //           d3.select("path.path" + self.attr("item")).attr("stroke", visConfig.natStrokesColor).attr("stroke-width", visConfig.natStrokesWidth);
      //         });
      //
      //     }
      //
      //     auxContinent++;
      //     lastContinent = continent;
      //   }
      // }
      // if (auxContinent === 0) {
      //   d3.select("text.warning-description").text(function() {
      //     return "Não há filmes desse(s) continente(s) com essa média de público selecionada.";
      //   });
      // }


    scaleVis(ratio);
  }

}
