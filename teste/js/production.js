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
        .text(visConfig.ufsData[uf]["Estado"].toUpperCase());
    }

    var menuFilters = vis.append("g")
      .attr("class", "menu-filters");

    menuFilters.append("text")
      .attr("class", "subtitle")
      .attr("x", function() {
        return visConfig.natWMargin;
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
        return visConfig.natWMargin;
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
          return visConfig.natWMargin + visConfig.proMenuCirclesRadius + ((i%3)*visConfig.proMenuCirclesWDist);
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
          // visConfig.continentsFilter[visConfig.continentsArr[continent]] = !visConfig.continentsFilter[visConfig.continentsArr[continent]];
          // drawGraph();
        });

      menuFilters.append("text")
        .attr("class", "subtitle")
        .attr("x", function() {
          return visConfig.natWMargin + 2.7*visConfig.proMenuCirclesRadius + ((i%3)*visConfig.proMenuCirclesWDist);
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

    function drawGraph() {

    }

    scaleVis(ratio);
  }

}
