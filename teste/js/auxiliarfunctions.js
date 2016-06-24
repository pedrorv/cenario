function getBoundingBoxCenter(selection) {
    var element = selection.node(),
        bbox = element.getBBox();
    return [bbox.x + bbox.width/2, bbox.y + bbox.height/2];
}

function getBoundingBoxWidthAndHeight(selection) {
    var element = selection.node(),
        bbox = element.getBBox();
    return [bbox.width, bbox.height];
}

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

function deleteVis() {
  d3.select("g.vis").remove();
}
