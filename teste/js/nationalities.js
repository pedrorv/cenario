function createVisNationalities(userWindowWidth) {

  if (!visConfig.countries) {
    d3.json("js/data2.json", function(error, json) {
      if (error) return console.warn(error);
      visConfig.countries = json;

      d3.json("js/data.json", function(error2, json2) {
        if (error2) return console.warn(error2);
        visConfig.dataNationalitiesVis = json2;
        visConfig.datasetGraphAux = returnNationsData(visConfig.dataNationalitiesVis, visConfig.countries);
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
      .text("Nacionalidades presentes no cinema brasileiro");

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
      .text("De 2009 a 2014");

    var menuFilters = vis.append("g")
      .attr("class", "menu-filters");

    menuFilters.append("text")
      .attr("class", "subtitle")
      .attr("x", function() {
        return visConfig.natWMargin;
      })
      .attr("y", function() {
        return 2 * visConfig.superHMargin + 1.5* visConfig.superTextSize + visConfig.superSubtextSize +
               visConfig.natMenuTitlesSize + visConfig.natMenuTitleTopMargin;
      })
      .attr("text-anchor", "start")
      .attr("fill", visConfig.monthBoxHexValue)
      .attr("font-size", visConfig.natMenuTitlesSize)
      .text("Selecionar continentes");

    menuFilters.append("text")
      .attr("class", "subtitle")
      .attr("x", function() {
        return visConfig.natWMargin;
      })
      .attr("y", function() {
        return 2 * visConfig.superHMargin + 1.5* visConfig.superTextSize + visConfig.superSubtextSize +
               visConfig.natMenuTitlesSize + visConfig.natMenuTitleTopMargin + visConfig.natMenuTitleBottomMargin + 6*visConfig.natMenuCirclesRadius;
      })
      .attr("text-anchor", "start")
      .attr("fill", visConfig.monthBoxHexValue)
      .attr("font-size", visConfig.natMenuTitlesSize)
      .text("Filtrar por média");


    // Filter Menu

    for (var i = 0; i < 6; i++) {

      menuFilters.append("circle")
        .attr("class", "continent-selector")
        .attr("r", visConfig.natMenuCirclesRadius)
        .attr("i", i)
        .attr("cx", function() {
          return visConfig.natGraphLeft + visConfig.natMenuCirclesRadius + (i*visConfig.natMenuWDistance);
        })
        .attr("cy", function() {
          return 2 * visConfig.superHMargin + 1.5* visConfig.superTextSize + visConfig.superSubtextSize +
                 visConfig.natMenuTitlesSize + visConfig.natMenuTitleTopMargin + visConfig.natMenuTitleBottomMargin + visConfig.natMenuCirclesRadius;
        })
        .attr("fill", "black")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .on("click", function() {
          var self = d3.select(this);
          var continent = parseInt(self.attr("i"));
          self.attr("fill", function() {
            return (self.attr("fill") == "white") ? "black" : "white";
          });
          visConfig.continentsFilter[visConfig.continentsArr[continent]] = !visConfig.continentsFilter[visConfig.continentsArr[continent]];
          drawGraph();
        });

      menuFilters.append("text")
        .attr("class", "subtitle")
        .attr("x", function() {
          return visConfig.natGraphLeft + 4*visConfig.natMenuCirclesRadius + (i*visConfig.natMenuWDistance);
        })
        .attr("y", function() {
          return 2 * visConfig.superHMargin + 1.5* visConfig.superTextSize + visConfig.superSubtextSize +
                 visConfig.natMenuTitlesSize + visConfig.natMenuTitleTopMargin + visConfig.natMenuTitleBottomMargin + 1.7*visConfig.natMenuCirclesRadius;
        })
        .attr("text-anchor", "start")
        .attr("fill", visConfig.monthBoxHexValue)
        .attr("font-size", visConfig.natMenuOptionsSize)
        .text(function() {
          if (i === 6) return "Todos";
          return visConfig.continentsArr[i];
        });

      menuFilters.append("circle")
        .attr("class", "value-selector")
        .attr("i", i)
        .attr("r", visConfig.natMenuCirclesRadius)
        .attr("cx", function() {
          return visConfig.natGraphLeft + visConfig.natMenuCirclesRadius + (i*visConfig.natMenuWDistance);
        })
        .attr("cy", function() {
          return 2 * visConfig.superHMargin + 1.5* visConfig.superTextSize + visConfig.superSubtextSize +
                 visConfig.natMenuTitlesSize + visConfig.natMenuTitleTopMargin + 2*visConfig.natMenuTitleBottomMargin + 7*visConfig.natMenuCirclesRadius;
        })
        .attr("fill", function() {
          if (i !== 5) return "white";
          return "black";
        })
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .on("click", function() {
          d3.selectAll("circle.value-selector").attr("fill", "white");
          var self = d3.select(this);
          var publicFilter = parseInt(self.attr("i"));
          self.attr("fill", function() {
            return (self.attr("fill") == "white") ? "black" : "white";
          });
          visConfig.publicFilter.min = visConfig.publicFilterOptions[publicFilter].min;
          visConfig.publicFilter.max = visConfig.publicFilterOptions[publicFilter].max;
          drawGraph();
        });

      menuFilters.append("text")
        .attr("class", "subtitle")
        .attr("x", function() {
          return visConfig.natGraphLeft + 4*visConfig.natMenuCirclesRadius + (i*visConfig.natMenuWDistance);
        })
        .attr("y", function() {
          return 2 * visConfig.superHMargin + 1.5* visConfig.superTextSize + visConfig.superSubtextSize +
                 visConfig.natMenuTitlesSize + visConfig.natMenuTitleTopMargin + 2*visConfig.natMenuTitleBottomMargin + 7.7*visConfig.natMenuCirclesRadius;
        })
        .attr("text-anchor", "start")
        .attr("fill", visConfig.monthBoxHexValue)
        .attr("font-size", visConfig.natMenuOptionsSize)
        .text(function() {
          return visConfig.publicFilterOptions[i].text;
        });

    }

    for (var year in visConfig.years) {

      menuFilters.append("text")
        .attr("class", function() {
          if (year == 2009) return "year-selector bold";
          return "year-selector light";
        })
        .attr("year", year)
        .attr("x", function() {
          return visConfig.natGraphLeft + (visConfig.years[year]*visConfig.natMenuWDistance);
        })
        .attr("y", function() {
          return 2 * visConfig.superHMargin + 1.5* visConfig.superTextSize + visConfig.superSubtextSize +
                 visConfig.natMenuTitlesSize + visConfig.natMenuTitleTopMargin + 2*visConfig.natMenuTitleBottomMargin + 14.7*visConfig.natMenuCirclesRadius;
        })
        .attr("text-anchor", "start")
        .attr("fill", visConfig.monthBoxHexValue)
        .attr("font-size", visConfig.natContinentNameSize)
        .text(year)
        .on("click", function() {
          d3.selectAll("text.year-selector").classed("bold", false);
          d3.selectAll("text.year-selector").classed("light", true);
          var self = d3.select(this);
          self.classed("light", false);
          self.classed("bold", true);

          visConfig.natYearSelected = self.attr("year");
          drawGraph();
        })

    }



    drawGraph();

    function drawGraph() {

      d3.selectAll("g.graph").remove();

      visConfig.datasetGraph = returnGraphData(visConfig.datasetGraphAux, visConfig.continentsFilter, visConfig.publicFilter);

      var graph = vis.append("g")
        .attr("class", "graph");


      // Continent line

      graph.append("line")
        .attr("x1", visConfig.natGraphLeft)
        .attr("y1", function() {
          return visConfig.natMenuH - visConfig.natMenuHMargin;
        })
        .attr("x2", function() {
          return visConfig.width - visConfig.natGraphRight;
        })
        .attr("y2", function() {
          return visConfig.natMenuH - visConfig.natMenuHMargin;
        })
        .attr("stroke", visConfig.monthBoxHexValue)
        .attr("stroke-width", visConfig.natGraphStrokeWidth);

      // Drawing Axis

      graph.append("line")
        .attr("x1", visConfig.natGraphLeft)
        .attr("y1", function() {
          return visConfig.height - visConfig.natHMarginGraphAxis;
        })
        .attr("x2", function() {
          return visConfig.width - visConfig.natGraphRight;
        })
        .attr("y2", function() {
          return visConfig.height - visConfig.natHMarginGraphAxis;
        })
        .attr("stroke", visConfig.monthBoxHexValue)
        .attr("stroke-width", visConfig.natGraphStrokeWidth);

      for (var i = 0; i <= 13; i++) {
        graph.append("line")
          .attr("x1", function() {
            return visConfig.natGraphLeft + i * visConfig.natGraphAxisSpacing;
          })
          .attr("y1", function() {
            return visConfig.height - visConfig.natHMarginGraphAxis - visConfig.natGraphAxisDivHeight;
          })
          .attr("x2", function() {
            return visConfig.natGraphLeft + i * visConfig.natGraphAxisSpacing;
          })
          .attr("y2", function() {
            return visConfig.height - visConfig.natHMarginGraphAxis + visConfig.natGraphAxisDivHeight;
          })
          .attr("stroke", visConfig.monthBoxHexValue)
          .attr("stroke-width", visConfig.natGraphStrokeWidth);
      }

      // Drawing Graph

      var dataHolder = visConfig.datasetGraph[visConfig.natYearSelected];
      var countriesSum = 0;
      var continentsSum = 0;
      var titlesSum = 0;
      var spacingSum = 0;
      var maxDataNations = 0;

      for (var j = 0; j < dataHolder.length; j++) {
        dataHolder[j].sort(function(a, b){return b["Dados"]["Títulos"]-a["Dados"]["Títulos"]});
        if (dataHolder[j].length > 0) {
          continentsSum++;
          countriesSum += dataHolder[j].length;
          if (dataHolder[j].length > 1) {
            spacingSum += dataHolder[j].length - 1;
          }
        }
        for (var k = 0; k < dataHolder[j].length; k++) {
            titlesSum += dataHolder[j][k]["Dados"]["Títulos"];
            if (dataHolder[j][k]["Dados"]["Média"] > maxDataNations) {
              maxDataNations = dataHolder[j][k]["Dados"]["Média"];
            }
        }
      }

      var totalWidthAvailable = visConfig.width - (visConfig.natGraphLeft + visConfig.natGraphRight
        + (visConfig.natGraphSpacing * spacingSum)
        + ((continentsSum-1) * visConfig.natGraphContinentSpacing));

      var totalAxisWidth = visConfig.width - visConfig.natGraphLeft - visConfig.natGraphRight;

      var auxContinent = 0;
      for (var continent = 0; continent < dataHolder.length; continent++) {

        if (dataHolder[continent].length > 0) {

          for (var country = 0; country < dataHolder[continent].length; country++) {

            // Drawing Bars

            graph.append("rect")
              .attr("class", function() {
                return "bar" + auxContinent + "-" + country;
              })
              .datum(dataHolder[continent][country])
              .attr("x", function() {
                if (auxContinent == 0 && country == 0) {
                    return visConfig.natWMargin;
                } else {
                  if (country > 0) {
                    var reference = "rect.bar" + auxContinent + "-" + (country - 1);
                    var x = parseFloat(d3.select(reference).attr("x"));
                    var width = parseFloat(d3.select(reference).attr("width"));
                    return x + width + visConfig.natGraphSpacing;
                  } else {
                    var reference = "rect.bar" + (auxContinent-1) + "-" + (dataHolder[lastContinent].length - 1);
                    var x = parseFloat(d3.select(reference).attr("x"));
                    var width = parseFloat(d3.select(reference).attr("width"));
                    return x + width + visConfig.natGraphSpacing + visConfig.natGraphContinentSpacing;
                  }
                }
              })
              .attr("y", function() {
                return visConfig.height - visConfig.natHMarginGraphAxis - visConfig.natHMarginGraph - visConfig.natHGraphBar;
              })
              .attr("width", function() {
                var titles = dataHolder[continent][country]["Dados"]["Títulos"];
                return (titles * totalWidthAvailable)/titlesSum;
              })
              .attr("height", visConfig.natHGraphBar)
              .attr("fill", visConfig.continentsColors[visConfig.continentsArr[continent]])
              .attr("stroke-width", 0)
              .attr("stroke", "transparent");

            // Drawing Paths

            graph.append("path")
              .attr("class", function() {
                return "path" + auxContinent + "-" + country;
              })
              .attr("d", function() {
                  var endingX = (dataHolder[continent][country]["Dados"]["Média"]/maxDataNations) * totalAxisWidth;
                  endingX += visConfig.natGraphLeft;
                  var reference = "rect.bar" + auxContinent + "-" + (country);
                  var width = parseFloat(d3.select(reference).attr("width"));
                  var startingX = parseFloat(d3.select(reference).attr("x"));
                  var startingY = parseFloat(d3.select(reference).attr("y")) + visConfig.natHGraphBar;
                  var endingY = visConfig.height - visConfig.natHMarginGraphAxis;

                  return "M" + startingX + " " +
                          startingY +
                         " L" + (startingX + width) + " " + startingY +
                         " L" + endingX + " " + endingY + " Z";
              })
              .attr("fill", visConfig.continentsColors[visConfig.continentsArr[continent]])
              .attr("stroke-width", 0)
              .attr("stroke", "transparent");

          }

          graph
            .append("text")
            .attr("class", "title-description")
            .attr("x", function() {
              var firstX = parseFloat(d3.select('rect.bar' + auxContinent + '-' + 0).attr("x"));
              var last = d3.select('rect.bar' + auxContinent + '-' + (dataHolder[continent].length-1));
              var desl = ((parseFloat(last.attr("x")) + parseFloat(last.attr("width"))) - firstX)/2;
              return firstX + desl;
            })
            .attr("y", function() {
              return visConfig.height - visConfig.natHMarginGraphAxis - visConfig.natHMarginGraph - visConfig.natHGraphBar - (2 * visConfig.natContinentHMargin);
            })
            .attr("text-anchor", "middle")
            .attr("fill", visConfig.natContinentColor)
            .attr("font-size", visConfig.natContinentNameSize)
            .text(visConfig.continentsArr[continent]);

          auxContinent++;
          lastContinent = continent;
        }
      }

    }

    scaleVis(ratio);
  }

}
