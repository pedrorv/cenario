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

    deleteVis();

    // Initial state of vis
    for (var continent in visConfig.continentsFilter) {
      visConfig.continentsFilter[continent] = true;
    }

    visConfig.natYearSelected = "2009";



    var vis = d3.select("svg.vis")
      .append("g")
      .attr("class", "vis");

    var ratio = scaleRatio(userWindowWidth, visConfig.width, visConfig.baseWidth);

    // Rect used to set all opacities to 1 
    vis.append("rect")
       .attr("x", 0)
       .attr("y", 0)
       .attr("width", visConfig.width)
       .attr("height", visConfig.height)
       .attr("fill", "#FFFFFF")
       .on("click", function() {
         d3.selectAll("path.country-path").attr("opacity", 1);
         d3.selectAll("rect.country-bar").attr("opacity", 1);
         d3.selectAll("text.description-texts").text("");
       });

    var superscription = vis.append("g")
      .attr("class", "superscription");

    // Vis Title

    superscription.append("text")
      .attr("class", "title")
      .attr("x", visConfig.baseWMargin)
      .attr("y", visConfig.baseHMarginVisTitle)
      .attr("text-anchor", "start")
      .attr("fill", visConfig.baseVisTitlesColors)
      .attr("font-size", visConfig.baseVisTitleSize)
      .attr("font-weight", "bold")
      .text("Nacionalidades exibidas no Brasil");

    // Vis Subtitle

    superscription.append("text")
      .attr("class", "subtitle")
      .attr("x", visConfig.baseWMargin)
      .attr("y", visConfig.baseHMarginVisSubTitle)
      .attr("text-anchor", "start")
      .attr("fill", visConfig.baseVisTitlesColors)
      .attr("font-size", visConfig.baseVisSubtitle)
      .text("De 2009 a 2014");

    var menuFilters = vis.append("g")
      .attr("class", "menu-filters");

    // Fist menu filter title

    menuFilters.append("text")
      .attr("class", "subtitle bold")
      .attr("x", visConfig.baseWMargin)
      .attr("y", visConfig.natMenuFirstTitleH)
      .attr("text-anchor", "start")
      .attr("fill", visConfig.baseVisMenusColors)
      .attr("font-size", visConfig.natMenuTitlesSize)
      .text("Selecionar continentes");

    // Second menu filter title

    menuFilters.append("text")
      .attr("class", "subtitle bold")
      .attr("x", visConfig.baseWMargin)
      .attr("y", visConfig.natMenuSecondTitleH)
      .attr("text-anchor", "start")
      .attr("fill", visConfig.baseVisMenusColors)
      .attr("font-size", visConfig.natMenuTitlesSize)
      .text("Filtrar por média de público");


    // Filter Menu

    for (var i = 0; i < 6; i++) {

      // Squares for first selection

      menuFilters.append("rect")
        .attr("class", "continent-selector light")
        .attr("r", visConfig.natMenuCirclesRadius)
        .attr("i", i)
        .attr("x", function() {
          return visConfig.baseWMargin + (i*visConfig.natMenuWDistance);
        })
        .attr("y", (visConfig.natOptionsSquareH - visConfig.natOptionsSquareSide))
        .attr("width", visConfig.natOptionsSquareSide)
        .attr("height", visConfig.natOptionsSquareSide)
        .attr("fill", function() {
          return visConfig.continentsColors[visConfig.continentsArr[i]];
        })
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .on("click", function() {
          var self = d3.select(this);
          var continent = parseInt(self.attr("i"));
          self.attr("fill", function() {
            return (self.attr("fill") == "white") ? visConfig.continentsColors[visConfig.continentsArr[continent]] : "white";
          });
          visConfig.continentsFilter[visConfig.continentsArr[continent]] = !visConfig.continentsFilter[visConfig.continentsArr[continent]];
          drawGraph();
        });

      // Texts for first selection

      menuFilters.append("text")
        .attr("class", "subtitle")
        .attr("x", function() {
          return visConfig.natFirstOptionsTextW + (i*visConfig.natMenuWDistance);
        })
        .attr("y", visConfig.natFirstOptionsTextH)
        .attr("text-anchor", "start")
        .attr("fill", visConfig.baseVisMenusColors)
        .attr("font-size", visConfig.natFirstOptionsTextSize)
        .text(visConfig.continentsArr[i]);


      // Circles for second selection

      menuFilters.append("circle")
        .attr("class", "value-selector")
        .attr("i", i)
        .attr("r", visConfig.natOptionsCircleRadius)
        .attr("cx", function() {
          return visConfig.natOptionsCircleCenterW + (i*visConfig.natMenuWDistance);
        })
        .attr("cy", visConfig.natOptionsCircleCenterH)
        .attr("fill", function() {
          if (i !== 5) return "white";
          return "black";
        })
        .attr("stroke", "black")
        .attr("stroke-width", 1)
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

      // Texts for second selection

      menuFilters.append("text")
        .attr("class", "subtitle light")
        .attr("x", function() {
          return visConfig.natSecondOptionsTextW + (i*visConfig.natMenuWDistance);
        })
        .attr("y", visConfig.natSecondOptionsTextH)
        .attr("text-anchor", "start")
        .attr("fill", visConfig.baseVisMenusColors)
        .attr("font-size", visConfig.natFirstOptionsTextSize)
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
        .attr("id", "y" + year)
        .attr("year", year)
        .attr("x", function() {
          return visConfig.natMenuYearsW + (visConfig.years[year]*visConfig.natMenuWDistance);
        })
        .attr("y", visConfig.natMenuYearsH)
        .attr("text-anchor", "middle")
        .attr("fill", function() {
          if (year == 2009) return visConfig.natMenuYearsColorSelected;
          return visConfig.natMenuYearsColorNotSelected;
        })
        .attr("font-size", visConfig.natMenuYearsSize)
        .text(year)
        .on("click", function() {
          d3.selectAll("text.year-selector").classed("bold", false).classed("light", true).attr("fill", visConfig.natMenuYearsColorNotSelected);

          var self = d3.select(this);
          self.classed("light", false).classed("bold", true).attr("fill", visConfig.natMenuYearsColorSelected);

          visConfig.natYearSelected = self.attr("year");
          moveYearIndicator();
          drawGraph();
        })

    }

    // Continent line

    menuFilters.append("line")
      .attr("x1", visConfig.natDivisionLineW)
      .attr("y1", visConfig.natDivisionLineH)
      .attr("x2", visConfig.natDivisionLineW + visConfig.natDivisionLineSize)
      .attr("y2", visConfig.natDivisionLineH)
      .attr("stroke", visConfig.natDivisionLineColor)
      .attr("stroke-width", visConfig.natDivisionLineThickness);

    menuFilters.append("rect")
      .attr("class", "year-indicator")
      .attr("x", visConfig.natYearIndicatorW - visConfig.natYearIndicatorSize/2)
      .attr("y", visConfig.natYearIndicatorH)
      .attr("width", visConfig.natYearIndicatorSize)
      .attr("height", visConfig.natYearIndicatorThickness)
      .attr("fill", visConfig.natYearIndicatorColor);


    // Play/Pause Controllers

    menuFilters.append("path")
      .attr("class", "play-button")
      .attr("d", function() {
        var str = "";
        str += "M " + visConfig.baseWMargin + " " + visConfig.natPlayButtonStartH + " ";
        str += "L " + (visConfig.baseWMargin + (Math.cos(toRadians(30)) * visConfig.natPlayButtonSize)) + " " +
                      (visConfig.natPlayButtonStartH - (Math.cos(toRadians(60)) * visConfig.natPlayButtonSize)) + " ";
        str += "L " + visConfig.baseWMargin + " " + (visConfig.natPlayButtonStartH - visConfig.natPlayButtonSize) + " Z";
        return str;
      })
      .attr("fill", visConfig.natPlayButtonColor)
      .on("click", timeAnimation);

    menuFilters.append("rect")
      .attr("class", "pause-button")
      .attr("y", visConfig.natPauseButtonH)
      .attr("x", visConfig.natPauseButtonW)
      .attr("width", visConfig.natPauseButtonWidthSize)
      .attr("height", visConfig.natPauseButtonHeight)
      .attr("fill", visConfig.natPlayButtonColor);

    menuFilters.append("rect")
      .attr("class", "pause-button")
      .attr("y", visConfig.natPauseButtonH)
      .attr("x", (visConfig.natPauseButtonW + visConfig.natPauseButtonWidthSize + visConfig.natPauseButtonDivision))
      .attr("width", visConfig.natPauseButtonWidthSize)
      .attr("height", visConfig.natPauseButtonHeight)
      .attr("fill", visConfig.natPlayButtonColor);

    menuFilters.append("rect")
      .attr("class", "pause-button")
      .attr("y", visConfig.natPauseButtonH)
      .attr("x", visConfig.natPauseButtonW)
      .attr("width", (2*visConfig.natPauseButtonWidthSize + visConfig.natPauseButtonDivision))
      .attr("height", visConfig.natPauseButtonHeight)
      .attr("fill", "transparent")
      .on("click", function() {
        clearInterval(visConfig.animationTimer);
        moveYearIndicator();
      });


    drawGraph();
    timeAnimation();
    
    function timeAnimation() {
      clearInterval(visConfig.animationTimer);
      visConfig.animationTimer = setInterval(function () {
        var year = parseInt(visConfig.natYearSelected) + 1;
        year = (year === 2015) ? 2009 : year;
    
        visConfig.natYearSelected = "" + year;
        d3.selectAll("text.year-selector").classed("bold", false);
        d3.select("#y" + year).classed("light", false).classed("bold", true);

        
        moveYearIndicator();
        drawGraph();
      }, 3000);
    }

    function moveYearIndicator() {
      d3.select("rect.year-indicator")
        .transition('changing-year')
        .duration(300)
        .attr("x", function() {
          return visConfig.natYearIndicatorW + 
                 visConfig.years[visConfig.natYearSelected] * visConfig.natYearIndicatorDistance -
                 visConfig.natYearIndicatorSize/2
        })
    }

    function drawGraph() {

      d3.selectAll("g.graph").remove();

      // Calculate Paramaters

      visConfig.datasetGraph = returnGraphData(visConfig.datasetGraphAux, visConfig.continentsFilter, visConfig.publicFilter);

      var dataHolder = visConfig.datasetGraph[visConfig.natYearSelected];
      var countriesSum = 0;
      var continentsSum = 0;
      var titlesSum = 0;
      var spacingSum = 0;
      var maxDataNations = 0;
      var minDataNations = Infinity;

      dataHolder.forEach(function(continent) {
        continent.sort(function(a, b){return b["Dados"]["Títulos"]-a["Dados"]["Títulos"]});
        if (continent.length > 0) {
          continentsSum++;
          countriesSum += continent.length;
          if (continent.length > 1) spacingSum += continent.length - 1;
        }
        continent.forEach(function(country) {
          titlesSum += country["Dados"]["Títulos"];
          if (country["Dados"]["Média"] > maxDataNations) {
            maxDataNations = country["Dados"]["Média"];
          }
          if (country["Dados"]["Média"] < minDataNations) {
            minDataNations = country["Dados"]["Média"];
          }
        })
      });

      if (visConfig.publicFilter.max === Infinity) {
        maxDataNations = roundMultPowerTen(maxDataNations);
      } else {
        maxDataNations = visConfig.publicFilter.max;
      }

      var totalWidthAvailable = visConfig.natGraphXAxisW - ((visConfig.natGraphCountrySpacing * spacingSum)
        + ((continentsSum-1) * visConfig.natGraphContinentSpacing));

      var totalAxisWidth = visConfig.natGraphXAxisW;

      // Start Drawing

      var graph = vis.append("g")
        .attr("class", "graph");


      // Messages to user

      graph.append("text")
        .attr("class", "description-texts country-description")
        .attr("x", function() {
          var deslc = (visConfig.natGraphXAxisW)/4;
          return visConfig.baseWMargin + deslc;
        })
        .attr("y", (visConfig.height - visConfig.natGraphTextDescriptionBottomMargin))
        .attr("text-anchor", "middle")
        .attr("fill", visConfig.natGraphTextDescriptionColor)
        .attr("font-size", visConfig.natGraphTextDescriptionSize)
        .attr("font-weight", "bold")
        .text("");

      graph.append("text")
        .attr("class", "description-texts titles-description")
        .attr("x", function() {
          var deslc = (visConfig.natGraphXAxisW)/4;
          return visConfig.baseWMargin + 2*deslc;
        })
        .attr("y", (visConfig.height - visConfig.natGraphTextDescriptionBottomMargin))
        .attr("text-anchor", "middle")
        .attr("fill", visConfig.natGraphTextDescriptionColor)
        .attr("font-size", visConfig.natGraphTextDescriptionSize)
        .attr("font-weight", "lighter")
        .text("");

      graph.append("text")
        .attr("class", "description-texts public-description")
        .attr("x", function() {
          var deslc = (visConfig.natGraphXAxisW)/4;
          return visConfig.baseWMargin + 3*deslc;
        })
        .attr("y", (visConfig.height - visConfig.natGraphTextDescriptionBottomMargin))
        .attr("text-anchor", "middle")
        .attr("fill", visConfig.natGraphTextDescriptionColor)
        .attr("font-size", visConfig.natGraphTextDescriptionSize)
        .attr("font-weight", "lighter")
        .text("");

      graph.append("text")
        .attr("class", "description-texts warning-description")
        .attr("x", function() {
          var deslc = (visConfig.natGraphXAxisW)/2;
          return visConfig.baseWMargin + deslc;
        })
        .attr("y", (visConfig.height - visConfig.natGraphTextDescriptionBottomMargin))
        .attr("text-anchor", "middle")
        .attr("fill", visConfig.natGraphTextDescriptionColor)
        .attr("font-size", visConfig.natGraphTextDescriptionSize)
        .attr("font-weight", "lighter")
        .text("");

      // Axis labels

      graph.append("text")
        .attr("class", "graph-description")
        .attr("x", visConfig.baseWMargin)
        .attr("y", (visConfig.height - visConfig.natGraphXAxisLabelH))
        .attr("text-anchor", "start")
        .attr("fill", visConfig.natContinentColor)
        .attr("font-size", visConfig.natSubTitleSize)
        .text("Média de Público");

      graph.append("text")
        .attr("class", "graph-description")
        .attr("x", visConfig.natGraphAxisLabelsW)
        .attr("y", (visConfig.height - visConfig.natGraphYAxisLabelH))
        .attr("text-anchor", "start")
        .attr("fill", visConfig.natContinentColor)
        .attr("font-size", visConfig.natSubTitleSize)
        .text("Títulos");


      // Drawing Axis

      graph.append("line")
        .attr("x1", visConfig.baseWMargin)
        .attr("y1", function() {
          return visConfig.height - visConfig.natGraphXAxisBottomMargin;
        })
        .attr("x2", function() {
          return visConfig.baseWMargin + visConfig.natGraphXAxisW;
        })
        .attr("y2", function() {
          return visConfig.height - visConfig.natGraphXAxisBottomMargin;
        })
        .attr("stroke", visConfig.natDivisionLineColor)
        .attr("stroke-width", visConfig.natDivisionLineThickness);

      for (var i = 0; i <= 10; i++) {
        graph.append("line")
          .attr("x1", function() {
            return visConfig.baseWMargin + i * (visConfig.natGraphXAxisW/10);
          })
          .attr("y1", function() {
            return visConfig.height - visConfig.natGraphXAxisBottomMargin - visConfig.natGraphXAxisDivisionH;
          })
          .attr("x2", function() {
            return visConfig.baseWMargin + i * (visConfig.natGraphXAxisW/10);
          })
          .attr("y2", function() {
            return visConfig.height - visConfig.natGraphXAxisBottomMargin + visConfig.natGraphXAxisDivisionH;
          })
          .attr("stroke", visConfig.natDivisionLineColor)
          .attr("stroke-width", visConfig.natDivisionLineThickness);

      graph.append("text")
        .attr("class", "axis-description")
        .attr("x", function() {
          return visConfig.baseWMargin + i * ((visConfig.natGraphXAxisW)/10);
        })
        .attr("y", function() {
          return visConfig.height - visConfig.natGraphXAxisLabelsH;
        })
        .attr("text-anchor", "middle")
        .attr("fill", visConfig.natGraphXAxisLabelColor)
        .attr("font-size", visConfig.natGraphXAxisLabelsSize)
        .text(function() {
          return formatNumber((visConfig.publicFilter.min + i*(maxDataNations - visConfig.publicFilter.min)/10));
        });
      }

      // Drawing Graph

      var auxContinent = 0;
      for (var continent = 0; continent < dataHolder.length; continent++) {

        if (dataHolder[continent].length > 0) {

          for (var country = 0; country < dataHolder[continent].length; country++) {

            // Drawing Bars

            graph.append("rect")
              .attr("class", function() {
                return "country-bar bar" + auxContinent + "-" + country;
              })
              .attr("item", function() {
                return auxContinent + "-" + country;
              })
              .datum(dataHolder[continent][country])
              .attr("x", function() {
                if (auxContinent == 0 && country == 0) {
                    return visConfig.baseWMargin;
                } else {
                  if (country > 0) {
                    var reference = "rect.bar" + auxContinent + "-" + (country - 1);
                    var x = parseFloat(d3.select(reference).attr("x"));
                    var width = parseFloat(d3.select(reference).attr("width"));
                    return x + width + visConfig.natGraphCountrySpacing;
                  } else {
                    var reference = "rect.bar" + (auxContinent-1) + "-" + (dataHolder[lastContinent].length - 1);
                    var x = parseFloat(d3.select(reference).attr("x"));
                    var width = parseFloat(d3.select(reference).attr("width"));
                    return x + width + visConfig.natGraphCountrySpacing + visConfig.natGraphContinentSpacing;
                  }
                }
              })
              .attr("y", function() {
                return visConfig.height - visConfig.natGraphRectBottomMargin;
              })
              .attr("width", function() {
                var titles = dataHolder[continent][country]["Dados"]["Títulos"];
                return (titles * totalWidthAvailable)/titlesSum;
              })
              .attr("height", visConfig.natGraphRectH)
              .attr("fill", visConfig.continentsColors[visConfig.continentsArr[continent]])
              .attr("stroke-width", 0)
              .attr("stroke", "transparent")
              .on("click", function() {
                var self = d3.select(this);
                var data = self.data()[0];
                d3.select("text.country-description").text(data["País"]);
                d3.select("text.titles-description").text(function() {
                  if (data["Dados"]["Títulos"] > 1) return data["Dados"]["Títulos"] + " filmes lançados";
                  return data["Dados"]["Títulos"] + " filme lançado";
                });
                d3.select("text.public-description").text(function() {
                  return formatNumber(parseInt(data["Dados"]["Média"])) + " espectadores em média";
                });
                d3.selectAll("rect.country-bar").attr("opacity", 0.7);
                d3.selectAll("path.country-path").attr("opacity", 0.7);
                self.attr("opacity", 1);
                d3.select("path.path" + self.attr("item")).attr("opacity", 1);
              })
              .on("mouseover", function() {
                var self = d3.select(this);
                self
                  .transition((self.datum()["País"] + "up"))
                  .duration(100)
                  .attr("y", (visConfig.height - visConfig.natGraphRectBottomMargin) - 10)
                  .attr("height", visConfig.natGraphRectH + 10);
              })
              .on("mouseleave", function() {
                var self = d3.selectAll("rect.country-bar");
                self
                  .transition("all-down")
                  .duration(100)
                  .attr("y", (visConfig.height - visConfig.natGraphRectBottomMargin))
                  .attr("height", visConfig.natGraphRectH);
              })
              .attr("opacity", 0)
              .transition()
              .duration(50)
              .delay(50 * country)
              .attr("opacity", 1);

            // Drawing Paths

            graph.append("path")
              .attr("class", function() {
                return "country-path path" + auxContinent + "-" + country;
              })
              .attr("item", function() {
                return auxContinent + "-" + country;
              })
              .datum(dataHolder[continent][country])
              .attr("d", function() {
                  var avrg = dataHolder[continent][country]["Dados"]["Média"];
                  var endingX = (avrg - visConfig.publicFilter.min) * totalAxisWidth / (maxDataNations - visConfig.publicFilter.min);
                  endingX += visConfig.baseWMargin;
                  var reference = "rect.bar" + auxContinent + "-" + (country);
                  var width = parseFloat(d3.select(reference).attr("width"));
                  var startingX = parseFloat(d3.select(reference).attr("x"));
                  var startingY = parseFloat(d3.select(reference).attr("y")) + visConfig.natGraphRectH;
                  var endingY = visConfig.height - visConfig.natGraphXAxisBottomMargin;

                  return "M" + startingX + " " +
                          startingY +
                         " L" + (startingX + width) + " " + startingY +
                         " L" + endingX + " " + endingY + " Z";
              })
              .attr("fill", visConfig.continentsColors[visConfig.continentsArr[continent]])
              .attr("stroke-width", 0)
              .attr("stroke", "transparent")
              .on("click", function() {
                var self = d3.select(this);
                var data = self.data()[0];
                d3.select("text.country-description").text(data["País"]);
                d3.select("text.titles-description").text(function() {
                  if (data["Dados"]["Títulos"] > 1) return data["Dados"]["Títulos"] + " filmes lançados";
                  return data["Dados"]["Títulos"] + " filme lançado";
                });
                d3.select("text.public-description").text(function() {
                  return formatNumber(parseInt(data["Dados"]["Média"])) + " espectadores em média";
                });
                d3.selectAll("rect.country-bar").attr("opacity", 0.7);
                d3.selectAll("path.country-path").attr("opacity", 0.7);
                self.attr("opacity", 1);
                d3.select("rect.bar" + self.attr("item")).attr("opacity", 1);
              })
              .attr("opacity", 0)
              .transition()
              .duration(50)
              .delay(50 + (50 * country))
              .attr("opacity", 1);

          }

          auxContinent++;
          lastContinent = continent;
        }
      }
      if (auxContinent === 0) {
        d3.select("text.warning-description").text(function() {
          return "Não há filmes desse(s) continente(s) com essa média de público selecionada.";
        });
      }

    }

    scaleVis(ratio);
  }

}
