function returnCirclesData(dataset) {
    var newDataset = {};
    for (var year in dataset) {
      newDataset[year] = {};
      for (var title in dataset[year]) {
        if(!newDataset[year][dataset[year][title]["Mês"]]) {
          newDataset[year][dataset[year][title]["Mês"]] = {
            "Títulos": 1,
            "Público": dataset[year][title]["Público"],
            "Renda": dataset[year][title]["Renda"],
            "Gêneros": {
              "Ficção": 0,
              "Documentário": 0,
              "Animação": 0
            }
          };
          newDataset[year][dataset[year][title]["Mês"]]["Gêneros"][dataset[year][title]["Gênero"]]++;
        } else {
          newDataset[year][dataset[year][title]["Mês"]]["Títulos"] += 1;
          newDataset[year][dataset[year][title]["Mês"]]["Público"] += dataset[year][title]["Público"];
          newDataset[year][dataset[year][title]["Mês"]]["Renda"] += dataset[year][title]["Renda"];
          newDataset[year][dataset[year][title]["Mês"]]["Gêneros"][dataset[year][title]["Gênero"]]++;
        }
      }
    }
    return newDataset;
}

function returnMoviesData(dataset) {
    var newDataset = {};
    for (var year in dataset) {
      newDataset[year] = [[],[],[],[],[],[],[],[],[],[],[],[]];
      for (var title in dataset[year]) {
        newDataset[year][parseInt(dataset[year][title]["Mês"])-1].push(dataset[year][title]);
      }
      for (var month in newDataset[year]) {
        newDataset[year][month].sort(function(a,b) {
          return b["Público"] - a["Público"];
        });
      }
    }
    return newDataset;
}

function returnMaxDataCircles(dataset, property) {
  var max = 0;
  for (var year in dataset) {
    for (var month in dataset[year]) {
        if (dataset[year][month][property] > max)
          max = dataset[year][month][property];
    }
  }
  return max;
}

function returnMinDataCircles(dataset, property) {
  var min = Infinity;
  for (var year in dataset) {
    for (var month in dataset[year]) {
        if (dataset[year][month][property] < min)
          min = dataset[year][month][property];
    }
  }
  return min;
}

function formatNumber(number) {
  var numberStr = "" + number,
      newNumberStr = [],
      j = numberStr.length-1,
      i = 0;
  for (; j >= 0; j--) {
    newNumberStr.unshift(numberStr[j]);
    i++;
    if ((i%3 == 0) && j > 0) {
      newNumberStr.unshift(".");
    }
  }
  return newNumberStr.join("");
}

function returnXPosition(index) {
  return 64 + (index * ((visConfig.circleBiggerRadius * 2) + visConfig.wCircleMargin)) + visConfig.circleBiggerRadius;
}

function returnYPosition(index) {
  return visConfig.hMonthMargin + visConfig.hMonthBox + 4 + (index * ((visConfig.circleBiggerRadius * 2) + visConfig.hCircleMargin)) + visConfig.circleBiggerRadius;
}

function testXPosition(x) {
  var index = (x - 64 - visConfig.circleBiggerRadius) / ((visConfig.circleBiggerRadius * 2) + visConfig.wCircleMargin);
  if (Math.abs(index - Math.floor(index + 0.5)) <= 0.3) {
    return Math.floor(index + 0.5);
  }
  return false;
}

function testYPosition(y) {
  var index = (y - visConfig.hMonthMargin - visConfig.circleBiggerRadius - visConfig.hMonthBox - 4) / ((visConfig.circleBiggerRadius * 2) + visConfig.wCircleMargin);
  if (Math.abs(index - Math.floor(index + 0.5)) <= 0.3) {
    return Math.floor(index + 0.5);
  }
  return false;
}

function moveAllSpecificMonthDrag(index, month, dx) {
  d3.selectAll("rect.month[currentmonth='" + month + "']")
    .attr("x", function() {
      return returnXPosition(index) - visConfig.circleBiggerRadius + dx;
    });

  d3.select("text.month[currentmonth='" + month + "']")
    .attr("x", function() {
      return returnXPosition(index) + dx;
    });

  d3.selectAll("circle[currentmonth='" + month + "']")
    .attr("cx", function() {
      return returnXPosition(index) + dx;
    });
}

function scaleSvg(ratio) {
  d3.select("svg")
    .attr("width", function() { return visConfig.width * ratio; })
    .attr("height", function() { return visConfig.height * ratio; });
}

function scaleRatio(windowWidth, visWidth, baseVisResolutionWidth) {
  var proportion = visWidth/baseVisResolutionWidth;
  var finalWidth = windowWidth * proportion;

  return finalWidth/visWidth;
}

function scaleVis(ratio) {
  d3.select("g.vis")
    .attr("transform", function() {
      return "scale(" + ratio + ")";
    });
}


function moveAllSpecificYear(year) {

}

function deleteVis() {
  d3.select("g.vis").remove();
}
