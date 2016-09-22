
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
      .text("Filmes nacionais com mais de 500mil espectadores");

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
      .text("De 1970 a 2014");

    superscription.append("text")
      .attr("class", "subtitle")
      .attr("x", function() {
        return visConfig.recTreemapW + visConfig.recMovieDescMargin;
      })
      .attr("y", function() {
        return visConfig.superHMargin + 1.5* visConfig.superTextSize;
      })
      .attr("text-anchor", "start")
      .attr("fill", visConfig.monthBoxHexValue)
      .attr("font-size", visConfig.natSubTitleSize)
      .text("Ano selecionado");

    superscription.append("text")
      .attr("class", "subtitle year-selected")
      .attr("x", function() {
        return visConfig.recTreemapW + visConfig.recMovieDescMargin;
      })
      .attr("y", function() {
        return 2 * visConfig.superHMargin + 1.5* visConfig.superTextSize + visConfig.superSubtextSize;
      })
      .attr("text-anchor", "start")
      .attr("fill", visConfig.monthBoxHexValue)
      .attr("font-size", visConfig.natSubTitleSize)
      .text("")
      .attr("opacity", 0);

    superscription.append("text")
      .attr("class", "subtitle")
      .attr("x", function() {
        return visConfig.recTreemapW + visConfig.recMovieDescMargin + visConfig.recMovieDescSubWMargin;
      })
      .attr("y", function() {
        return visConfig.superHMargin + 1.5* visConfig.superTextSize;
      })
      .attr("text-anchor", "start")
      .attr("fill", visConfig.monthBoxHexValue)
      .attr("font-size", visConfig.natSubTitleSize)
      .text("Comparar com");

    superscription.append("text")
      .attr("class", "subtitle year-compared")
      .attr("x", function() {
        return visConfig.recTreemapW + visConfig.recMovieDescMargin + visConfig.recMovieDescSubWMargin;
      })
      .attr("y", function() {
        return 2 * visConfig.superHMargin + 1.5* visConfig.superTextSize + visConfig.superSubtextSize;
      })
      .attr("text-anchor", "start")
      .attr("fill", visConfig.monthBoxHexValue)
      .attr("font-size", visConfig.natSubTitleSize)
      .text("")
      .attr("opacity", 0);

    superscription.append("path")
      .attr("class", "subtitle")
      .attr("fill", visConfig.monthBoxHexValue)
      .attr("d", function() {
        var size = 10;
        var startingX = visConfig.recTreemapW + visConfig.recMovieDescMargin + visConfig.recMovieDescSubWMargin + 90;
        var startingY = visConfig.superHMargin + 1.5* visConfig.superTextSize - visConfig.natSubTitleSize + 3;
        return "M " + startingX + " " + startingY +
               "L " + (startingX + size) + " " + startingY +
               "L " + (startingX + (size/2)) + " " + (startingY + (size*Math.sqrt(3)/2)) +
               " Z";
      })
      .on("click", function() {
        drawMenu();
      });


    visConfig.recDecadesData = returnTreemapDecadeData(visConfig.recordistsData);

    function a(dataset, bigger, smaller) {
      obj = {};

      for (var dec in dataset) {
        if (!obj[dec]) {
          obj[dec] = {
            "quantidade": 0,
            "lado": 0,
            "xy": ["x", "y"]
          };
        }
        for (var year in dataset[dec]) {
          if (!obj[year]) {
            obj[year] = {
              "quantidade": dataset[dec][year].length,
              "lado": 0,
              "xy": ["x", "y"]
            };
          }
          obj[dec].quantidade += dataset[dec][year].length;
        }
      }

      var max = 0;
      var min = Infinity;

      for (var i in obj) {
        if (obj[i].quantidade > max) {
          max = obj[i].quantidade;
        }
        if (obj[i].quantidade < min) {
          min = obj[i].quantidade;
        }
      }

      for (var j in obj) {
        var qtd = obj[j].quantidade;
        console.log(qtd);
        var range = max - min;
        console.log(range);
        var rangeSize = bigger - smaller;
        console.log(rangeSize);

        obj[j].lado = Math.sqrt(smaller + (qtd - min)*rangeSize/range);
      }

      return obj;
    }

    console.log(JSON.stringify(a(visConfig.recordistsData, visConfig.recDecBiggerArea, visConfig.recDecSmallerArea)));

    var treemapDecades = d3.layout.treemap()
      .size([visConfig.recTreemapW, visConfig.recTreemapH])
      .sticky(true)
      .sort(function(a, b) {
        var aInt = parseInt(a.name),
            bInt = parseInt(b.name);

        var a1 = (aInt < 20) ? (2000 + aInt) : (1900 + aInt);
        var b1 = (bInt < 20) ? (2000 + bInt) : (1900 + bInt);
        return b1 - a1;
      })
      .value(function(d) { return d.size; });

    var gtreemap = vis.append("g")
        .attr("class", "treemap");

    var node = gtreemap.datum(visConfig.recDecadesData)
        .selectAll(".node")
        .data(treemapDecades.nodes)
        .enter()
        .append("g")
        .attr("class", function(d) {
          return ("decade-treemap" + d.name);
        });

        node.append("rect")
        .attr("class", "node")
        .attr("x", function(d) { return (visConfig.recTreemapMarginLeft + parseFloat(d.x)); })
        .attr("y", function(d) { return (visConfig.recTreemapMarginTop  + parseFloat(d.y)); })
        .attr("width", function(d) {  return Math.max(0, d.dx - 1); })
        .attr("height", function(d) { return Math.max(0, d.dy - 1); })
        .attr("fill", function(d) {
          return visConfig.decadesColors[d.name];
        })
        .on("click", function(d) {
          var reference = d3.select(this);
          var referenceName = d.name;
          var yearsData = returnTreemapYearsData(visConfig.recordistsData, referenceName);

          var treemapYears = d3.layout.treemap()
            .size([parseFloat(reference.attr("width")), parseFloat(reference.attr("height"))])
            .sticky(true)
            .sort(function(a, b) {
              var aInt = parseInt(a.name),
                  bInt = parseInt(b.name);
              return bInt - aInt;
            })
            .value(function(d) { return d.size; });


          var nodeYear = d3.select(("g.decade-treemap" + referenceName))
              .datum(yearsData)
              .selectAll(".node")
              .data(treemapYears.nodes)
              .enter()
              .append("g")
              .attr("class", function(d) {
                return ("year-treemap" + referenceName);
              });

          nodeYear.append("rect")
            .attr("class", "node")
            .attr("fill", visConfig.decadesColors[referenceName])
            .attr("stroke", "white")
            .attr("x", function(d) { return parseFloat(reference.attr("x")) + parseFloat(d.x); })
            .attr("y", function(d) { return parseFloat(reference.attr("y")) + parseFloat(d.y); })
            .attr("width", function(d) {  return Math.max(0, d.dx - 1); })
            .attr("height", function(d) { return Math.max(0, d.dy - 1); })
            .attr("opacity", 0)
            .on("click", function(d) {
              drawYearDetails(d.name, "selected");
            })
            .transition()
            .duration(100)
            .delay(function (d, i) {
              return 100 * i;
            })
            .attr("opacity", 1);

        })
        .text(function(d) { return d.children ? null : d.name; });

        node.append("text")
          .attr("fill", "#00ffff")
          .attr("x", function(d) {
            return (visConfig.recTreemapMarginLeft + parseFloat(d.x)) + 15;
          })
          .attr("y", function(d) {
            return (visConfig.recTreemapMarginTop + parseFloat(d.y)) + 15;
          })
          .attr("font-size", 15)
          .text(function(d) {
            return d.name;
          });

    function drawYearDetails(year, type) {

      d3.select(("g.films-details-"+type)).remove();

      d3.select(("text.year-" + type))
        .text(("" + year))
        .transition()
        .duration(100)
        .attr("opacity", 1);

      var decade = (""+year)[2] + "0";

      var sumPublic = 0,
          moviesCount = visConfig.recordistsData[decade][year].length,
          gFilmDetail = d3.select("g.vis")
            .append("g")
            .attr("class", ("films-details-"+type));

      for (var movie = 0; movie < moviesCount; movie++) {
        sumPublic += visConfig.recordistsData[decade][year][movie]["Público"];
      }

      visConfig.recordistsData[decade][year].sort(function(a,b) {
        return b["Público"] - a["Público"];
      });

      for (var i = 0; i < moviesCount; i++) {
        gFilmDetail
          .append("rect")
          .datum(visConfig.recordistsData[decade][year][i])
          .attr("class", "film-detail-" + type + i)
          .attr("x", function() {
            if (type === "selected") {
              return visConfig.recTreemapW + visConfig.recMovieDescMargin;
            }
            if (type === "compared") {
              return visConfig.recTreemapW + visConfig.recMovieDescMargin + visConfig.recMovieDescSubWMargin;
            }
          })
          .attr("y", function() {
            if (i === 0) return visConfig.recTreemapMarginTop;
            var previous = d3.select("rect.film-detail-" + type + (i-1));
            return parseFloat(previous.attr("y")) + parseFloat(previous.attr("height"));
          })
          .attr("width", visConfig.recMoviesDescW)
          .attr("height", function() {
            return visConfig.recordistsData[decade][year][i]["Público"] * visConfig.recTreemapH/sumPublic;
          })
          .attr("fill", visConfig.moviesColors[i%5])
          .attr("opacity", 0)
          .transition()
          .duration(50)
          .delay((50 * i))
          .attr("opacity", 1);
      }

    }

    function drawMenu() {

      var menuData = [];
      for (var decade in visConfig.recordistsData) {
        var decInt = parseInt(decade);
        menuData.push({
          "decade": ((decInt < 20) ? (2000 + decInt) : (1900 + decInt)),
          "years": []
        });
        for (var year in visConfig.recordistsData[decade]) {
          menuData[menuData.length - 1]["years"].push(parseInt(year));
        }
        menuData[menuData.length - 1]["years"].sort(function(a, b) { return a - b; });
      }
      menuData.sort(function(a,b) {
        return a.decade - b.decade;
      });

      var menu = superscription.append("g")
        .attr("class", "compare-menu");

      var menuLevel = menu.selectAll(".menu-level-one")
        .data(menuData)
        .enter()
        .append("g")
        .attr("class", "menu-level-one");

      menuLevel.append("rect")
        .attr("class", "rect-lvl-one")
        .attr("x", function(d, i) {
            return visConfig.recTreemapW + visConfig.recMovieDescMargin + visConfig.recMovieDescSubWMargin + 90 + 5 - (visConfig.recMenuBoxW/2);
        })
        .attr("y", function(d, i) {
            return 2 * visConfig.superHMargin + 1.5* visConfig.superTextSize + visConfig.superSubtextSize + (visConfig.recMenuBoxH * i);
        })
        .attr("width", visConfig.recMenuBoxW)
        .attr("height", visConfig.recMenuBoxH)
        .attr("fill", visConfig.recMenuFill)
        .on("click", function(d) {
          var self = d3.select(this);
          drawMenuItems(d.years, menu, self);
        })
        .attr("opacity", 0)
        .transition()
        .duration(50)
        .delay(function(d,i) {
          return (i * 50);
        })
        .attr("opacity", 1);

      menuLevel.append("text")
        .attr("class", "subtitle")
        .attr("x", function() {
          return visConfig.recTreemapW + visConfig.recMovieDescMargin + visConfig.recMovieDescSubWMargin + 90 + 5;
        })
        .attr("y", function(d, i) {
          return 2 * visConfig.superHMargin + 1.5* visConfig.superTextSize + visConfig.superSubtextSize + (visConfig.recMenuBoxH * i) + visConfig.recMenuBoxH/2 + visConfig.natSubTitleSize/2;
        })
        .attr("text-anchor", "middle")
        .attr("fill", visConfig.monthBoxHexValue)
        .attr("font-size", visConfig.natSubTitleSize)
        .text(function(d) {
          return d.decade;
        })
        .on("click", function(d) {
          var self = d3.select(this);
          drawMenuItems(d.years, menu, self);
        })
        .attr("opacity", 0)
        .transition()
        .duration(50)
        .delay(function(d,i) {
          return (i * 50);
        })
        .attr("opacity", 1);

      function drawMenuItems(data, reference, fatherReference) {

        var menuLevel = reference.selectAll(".menu-level-two")
          .data(data)
          .enter()
          .append("g")
          .attr("class", "menu-level-two");

        menuLevel.append("rect")
          .attr("class", "rect-lvl-two")
          .attr("x", function(d, i) {
              return parseFloat(fatherReference.attr("x")) + visConfig.recMenuBoxW;
          })
          .attr("y", function(d, i) {
              return parseFloat(fatherReference.attr("y")) + (visConfig.recMenuBoxH * i);
          })
          .attr("width", visConfig.recMenuBoxW)
          .attr("height", visConfig.recMenuBoxH)
          .attr("fill", visConfig.recMenuFill)
          .attr("opacity", 0)
          .on("click", function(d) {
            drawYearDetails(d, "compared");
            d3.select("g.compare-menu").remove();
          })
          .transition()
          .duration(50)
          .delay(function(d,i) {
            return (i * 50);
          })
          .attr("opacity", 1);

        menuLevel.append("text")
          .attr("class", "subtitle")
          .attr("x", function() {
            return parseFloat(fatherReference.attr("x")) + visConfig.recMenuBoxW + visConfig.recMenuBoxW/2;
          })
          .attr("y", function(d, i) {
            return parseFloat(fatherReference.attr("y")) + (visConfig.recMenuBoxH * i) + visConfig.recMenuBoxH/2 + visConfig.natSubTitleSize/2;
          })
          .attr("text-anchor", "middle")
          .attr("fill", visConfig.monthBoxHexValue)
          .attr("font-size", visConfig.natSubTitleSize)
          .text(function(d) {
            return d;
          })
          .attr("opacity", 0)
          .on("click", function(d) {
            drawYearDetails(d, "compared");
            d3.select("g.compare-menu").remove();
          })
          .transition()
          .duration(50)
          .delay(function(d,i) {
            return (i * 50);
          })
          .attr("opacity", 1);

      }

    }

    scaleVis(ratio);
  }

}
