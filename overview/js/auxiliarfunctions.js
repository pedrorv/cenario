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

function returnCirclesData(data) {
    var data2 = {};
    for (var year in data) {
      data2[year] = {};
      for (var title in data[year]) {
        if(!data2[year][data[year][title]["Mês"]]) {
          data2[year][data[year][title]["Mês"]] = {
            "Títulos": 0
          };
        } else {
          data2[year][data[year][title]["Mês"]]["Títulos"] += 1;
        }
      }
    }
    return data2;
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

function deleteVis() {
  d3.select("g.vis").remove();
}
