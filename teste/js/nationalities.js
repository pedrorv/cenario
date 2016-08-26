function createVisNationalities(userWindowWidth) {

  if (!visConfig.countries) {
    d3.json("js/data2.json", function(error, json) {
      if (error) return console.warn(error);
      visConfig.countries = json;

      d3.json("js/data.json", function(error2, json2) {
        if (error2) return console.warn(error2);
        visConfig.dataNationalitiesVis = json2;
        visConfig.datasetGraphAux = returnNationsData(visConfig.dataNationalitiesVis, visConfig.countries);
        visConfig.datasetGraph = returnGraphData(visConfig.datasetGraphAux);
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

    var map = new Datamap({
      element: document.getElementById('container'),
      projection: 'equirectangular',
      height: ratio * 331,
      width:  ratio * 686,
      fills: {
        defaultFill: '#CDCDCD'
      },
      geographyConfig: {
        popupOnHover: false,
        highlightOnHover: false
      },
    });

    var superscription = vis.append("g")
      .attr("class", "superscription");

    superscription.append("text")
      .attr("class", "title")
      .attr("x", function() {
        return visConfig.natWMargin;
      })
      .attr("y", function() {
        return visConfig.superHMargin + 1.5* visConfig.superTextSize;;
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

    drawGraph();

    function drawGraph() {

      var graph = vis.append("g")
        .attr("class", "graph");

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

      var dataHolder = visConfig.datasetGraph["2014"];
      var countriesSum = 0;
      var continentsSum = 0;
      var titlesSum = 0;
      var spacingSum = 0;

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
        }
      }

      var totalWidthAvailable = visConfig.width - (visConfig.natGraphLeft + visConfig.natGraphRight
        + (visConfig.natGraphSpacing * spacingSum)
        + ((continentsSum-1) * visConfig.natGraphContinentSpacing));

      var totalAxisWidth = visConfig.width - visConfig.natGraphLeft - visConfig.natGraphRight;

      for (var continent = 0; continent < dataHolder.length; continent++) {
        for (var country = 0; country < dataHolder[continent].length; country++) {

          // Drawing Bars

          graph.append("rect")
            .attr("class", function() {
              return "bar" + continent + "-" + country;
            })
            .datum(dataHolder[continent][country])
            .attr("x", function() {
              if (continent == 0 && country == 0) {
                  return visConfig.natWMargin;
              } else {
                if (country > 0) {
                  var reference = "rect.bar" + continent + "-" + (country - 1);
                  var x = parseFloat(d3.select(reference).attr("x"));
                  var width = parseFloat(d3.select(reference).attr("width"));
                  return x + width + visConfig.natGraphSpacing;
                } else {
                  var reference = "rect.bar" + (continent - 1) + "-" + (dataHolder[continent - 1].length - 1);
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
              return "path" + continent + "-" + country;
            })
            .attr("d", function() {
                var endingX = (dataHolder[continent][country]["Dados"]["Público"]/130000000) * totalAxisWidth;
                endingX += visConfig.natGraphLeft;
                var reference = "rect.bar" + continent + "-" + (country);
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
      }

    }

    scaleVis(ratio);
  }

}
